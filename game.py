import json
from itertools import groupby
import random

class WinException(Exception):
    '''
    An exception to be raised when a player wins the game.
    '''
    pass

class ActionInvalidException(Exception):
    '''
    An exception to be raised when an action is invalid.
    '''
    pass

class CardLoader:
    '''
    A static class for loading the decks of cards from a JSON file.
    
    Not gonna lie, I'm don't think I should have made this a class, but
    whatever.
    '''
    @staticmethod
    def load_decks(cards_file: str, num_revealed: int = 4) -> tuple[list, dict]:
        '''
        Load the decks from a JSON file.
        
        Args:
            cards_file (str): The path to the JSON file containing the cards.
            num_revealed (int): The number of cards to reveal from each tier.
            
        Returns:
            tuple[list, dict]: A tuple containing:
                - list[dict] of raw card info, and
                - dict[int, {visible: list[int], hidden: list[int]}] of the
                deck of cards, keyed by tier.
        '''
        # Load the raw cards
        with open(cards_file, 'r') as f:
            cards_raw = json.load(f)
        
        # Add an id to each card
        for index, card in enumerate(cards_raw):
            card['id'] = index
            card['tier'] = str(card['tier'])
            
        # Get dictionary of cards, keyed by id
        cards_glossary = {card['id']: card for card in cards_raw}

        # Group the cards by tier
        cards_grouped = {
            tier: list(cards)
            for tier, cards in groupby(
                sorted(cards_raw, key=lambda x: x['tier']), key=lambda x: x['tier'])
        }
        
        # Get the ids of the cards in each tier
        cards_ids = {
            tier: [card['id'] for card in cards]
            for tier, cards in cards_grouped.items()
        }

        # Shuffle the cards
        cards_shuffled = {
            tier: random.sample(cards, len(cards))
            for tier, cards in cards_ids.items()
        }

        # Split the cards into visible and hidden decks
        cards_drawn = {
            str(tier): { 
                "visible": cards_shuffled[tier][:num_revealed], 
                "hidden": cards_shuffled[tier][num_revealed:]
            }
            for tier in cards_shuffled.keys()
        }
        
        return cards_glossary, cards_drawn

class CollectionsLoader:
    @staticmethod
    def load_collections(collections_file: str, num_collections: int = 5) -> tuple[list[dict], list[int]]:
        '''
        Load the collections from a JSON file.
        
        Args:
            collections_file (str): The path to the JSON file containing the collections.
            num_collections (int): The number of collections to draw.
            
        Returns:
            tuple[list[dict], list[int]]: A tuple containing:
                - list[dict] of raw collection info, and
                - list[int] of the ids of the collections that were drawn.
        '''
        with open(collections_file, 'r') as f:
            collections_raw = json.load(f)
            
        return collections_raw, random.sample(range(len(collections_raw)), num_collections)


class Game:
    '''
    A class representing a game. 
    
    Players must be added before the game begins, and the game should be
    initialized with begin(). 
    
    No methods prefixed with "action_" can be called before the game has
    begun.
    
    Attributes:
        players (dict[str, dict]): A dictionary of players, keyed by id.
        began (bool): Whether the game has begun.
        cards (list[dict]): A list of all the cards in the game.
        decks (dict[int, dict[str, list[int]]]): A dictionary of the decks of
            cards, keyed by tier.
        collections (list[dict]): A list of all the collections in the game.
        collections_in_play (list[int]): A list of the ids of the collections that are
            currently in play.
        bank (dict[str, int]): A dictionary of the bank of tokens, keyed by
            color.
        turn (int): The number of turns that have passed.
    '''
    def __init__(self):
        self.players = {}
        self.began = False
    
    def _ensure_game_began(func):
        '''
        A decorator that ensures the method is only called after the game has
        begun.
        '''
        def wrapper(self, *args, **kwargs):
            if not self.began:
                raise ActionInvalidException("Game has not begun")
            return func(self, *args, **kwargs)
        return wrapper
    
    @_ensure_game_began
    def _find_tier_of_card(self, card_id: int) -> int:
        '''
        Find the tier of a card.
        
        Args:
            card_id (int): The id of the card to find the tier of.
            
        Returns:
            int: The tier of the card.
        '''
        if card_id not in self.cards:
            raise ActionInvalidException(f"Card {card_id} does not exist")
        
        return self.cards[card_id]['tier']
    
    @_ensure_game_began
    def _get_player_discount(self, player_id: str, color: str) -> dict[str, int]:
        '''
        Get the discounts of a player for a given color.
        
        Args:
            player_id (str): The id of the player to get the discounts of.
            color (str): The color to get the discounts of.
            
        Returns:
            int: The number of discounts the player has for the given color.
        '''
        player = self.players[player_id]
        
        # Count the number of cards in the player's developments that have the
        # given discount color
        return len([card_id for card_id in player["developments"] 
                    if self.cards[card_id]["discount"] == color])

    @_ensure_game_began
    def _get_player_score(self, player_id: str) -> int:
        '''
        Get the score of a player.
        '''
        player = self.players[player_id]
        
        # Sum the scores of the player's developments
        score_from_developments = sum(self.cards[card_id]["score"] 
                                      for card_id in player["developments"])
        
        # Add the score of the player's collection, if they have one
        if player["attained_collection"] is not None:
            score_from_collection = self.collections[player["attained_collection"]]["score"]
        else:
            score_from_collection = 0
        
        return score_from_developments + score_from_collection
    
    @_ensure_game_began
    def _assign_collection_if_eligible(self, player_id: str) -> bool:
        '''
        Assign a collection to a player if they are eligible.
        
        A collection is attained if the player has the required development cards
        for the collection. The player is unable to refuse the collection once they are
        eligible.
        
        A player can only attain one collection in the game.
        
        Args:
            player_id (str): The id of the player to check for eligibility.
            
        Returns:
            bool: Whether a collection was assigned to the player.
        '''
        player = self.players[player_id]
        
        # If the player has already attained a collection, they will not be
        # eligible for any more
        if player["attained_collection"] is not None:
            return False
        
        for collection in self.collections:
            for color, count in collection["trigger"].items():
                # If the player doesn't have the required number of cards with
                # the discount for the collection, they are not eligible
                if sum(self.cards[card_id]["discount"] == color 
                       for card_id in player["developments"]) < count:
                    break
            else: # This is intended to be a for-else loop
                # Assign the collection to the player
                player["attained_collection"] = collection["id"]
                return True
        
        return False
        
    def add_player(self, id: str) -> "Game":
        '''
        Add a player to the game. 
        
        Note that players can only be added before the game has begun, and
        that players must have unique ids.
        
        Args:
            id (str): The id of the player to add.
            
        Returns:
            Game: The updated game state.
        '''
        if self.began:
            raise ActionInvalidException("Game has already begun")
        
        if id in self.players:
            raise ActionInvalidException(f"Player {id} already exists")
        
        # Initialize the player's wallet, developments, and reservations
        self.players[id] = {
            "wallet": { "black": 0, "white": 0, "red": 0, "blue": 0, "green": 0, "gold": 0 },
            "developments": tuple(),
            "reservations": tuple(),
            "attained_collection": None,
        }
        
        return self
    
    def begin(self, cards_file: str, collections_file: str) -> "Game":
        '''
        Initialize the game. Is idempotent and to be called after all players
        have been added.
        
        Args:
            cards_file (str): The path to the JSON file containing the cards.
            collections_file (str): The path to the JSON file containing the collections.
            
        Returns:
            Game: The initialized game state.
        '''
        if self.began:
            return self
        
        self.began = True
        
        # Load everything else needed in the game state
        self.cards, self.decks = CardLoader.load_decks(cards_file)
        self.collections, self.collections_in_play = CollectionsLoader.load_collections(collections_file)
        self.bank = { "black": 7, "white": 7, "red": 7,"blue": 7, "green": 7, "gold": 5 }
        self.turn = 0
        
        return self

    def action(func):
        '''
        A decorator for actions that can be taken by a player.
        '''
        def wrapper(self, player_id, *args, **kwargs):
            if not self.began:
                raise ActionInvalidException("Game has not begun")
            
            # Ensure the action is being taken by the player whose turn it is
            current_player = list(self.players.keys())[
                self.turn % len(self.players.keys())
            ]
            if current_player != player_id:
                raise ActionInvalidException(f"Currently Player {current_player}'s turn")

            result = func(self, player_id, *args, **kwargs)

            # Check for win condition
            if self._get_player_score(player_id) >= 15:
                raise ActionInvalidException(f"Player {player_id} has won the game")
            
            # Assign a collection to the player if they are eligible
            self._assign_collection_if_eligible(player_id)

            # Increment the turn counter
            self.turn += 1
            
            return result
        return wrapper

    @action
    def action_take_different(self, player_id: str, colors: tuple) -> "Game":
        '''
        Take 3 tokens of different colors.
        
        Args:
            player_id (str): The player taking the action.
            colors (tuple): A tuple of 3 different colors.
            
        Returns:
            Game: The updated game state.
        '''
        if len(set(colors)) != 3:
            raise ActionInvalidException("Must take 3 different colors")
        
        player = self.players[player_id]
        
        if sum(player["wallet"].values()) > 7:
            raise ActionInvalidException("Cannot have more than 10 tokens at once")
        
        for color in colors:
            if self.bank[color] < 1:
                raise ActionInvalidException(f"Not enough {color} tokens left in the bank")
        
        # Add 1 token to the player's wallet and remove 1 from the bank, of
        # each chosen color
        for color in colors:
            player["wallet"][color] += 1
            self.bank[color] -= 1
            
        return self
    
    @action
    def action_take_same(self, player_id: str, color: str) -> "Game":
        '''
        Take 2 tokens of the same color. This action is only possible if
        there are at least 4 tokens of the chosen color left when the player
        takes them.
        
        Args:
            player_id (str): The player taking the action.
            color (str): The color of the tokens to take.
            
        Returns:
            Game: The updated game state.
        '''
        player = self.players[player_id]
        
        if color not in player["wallet"]:
            raise ActionInvalidException(f"Color {color} is not a valid color")
        
        if self.bank[color] < 4:
            raise ActionInvalidException(f"There are less than 4 {color} tokens left in the bank")
        
        if sum(player["wallet"].values()) > 8:
            raise ActionInvalidException("Cannot have more than 10 tokens at once")

        # Add 2 tokens to the player's wallet and remove 2 from the bank, of
        # the chosen color
        player["wallet"][color] += 2
        self.bank[color] -= 2

        return self
    
    @action
    def action_reserve(self, player_id: str, tier: str, card_id: int | None) -> "Game":
        ''' Reserve 1 development card and take 1 gold token. 
        
        If card_id is None, the player will choose the topmost hidden card of
        the chosen tier. Players may not have more than three reserved cards in
        hand.
        
        If there is no gold left, you can still reserve a card, but you won’t
        get any gold.
        
        Args:
            player_id (str): The player taking the action.
            tier (int): The tier of the development card to reserve. Has no
                effect if the card is specified (i.e. card_id is not None).
            card_id (int | None): The id of the development card to reserve. If
                None, the player will choose the top card of the tier.
                
        Returns:
            Game: The updated game state.
        '''
        player = self.players[player_id]
        
        if tier not in self.decks:
            raise ActionInvalidException(f"Tier {tier} does not exist")
        
        if card_id is not None and card_id not in self.cards:
            raise ActionInvalidException(f"Card {card_id} does not exist")
        
        # If the card is specified, find its tier
        if card_id is not None:
            tier = self._find_tier_of_card(card_id)
        
        # If the card is not on the table, i.e. it's not available to be
        # reserved or purchased
        if card_id is not None and card_id not in self.decks[tier]["visible"]:
            raise ActionInvalidException(f"Card {card_id} is not up for grabs")
        
        if len(player["reservations"]) >= 3:
            raise ActionInvalidException("Cannot have more than 3 reserved cards at once")
        
        if sum(player["wallet"].values()) > 9:
            raise ActionInvalidException("Cannot have more than 10 tokens at once")
        
        # If the card is not specified, the player is choosing the topmost
        # card from the hidden deck
        if card_id is None:
            # If there are no cards left in the hidden deck, raise an error...
            if len(self.decks[tier]["hidden"]) == 0:
                raise ActionInvalidException(f"No cards left in tier {tier}")
            
            # ...otherwise, pop the top card from the hidden deck
            card_id = self.decks[tier]["hidden"].pop()
            
            is_from_visible = False
        else:
            # Remove the card from the visible deck
            self.decks[tier]["visible"].remove(card_id)
            
            is_from_visible = True

        # Add the card to the player's reservations
        player["reservations"] += (card_id,)
        
        # If there are any gold tokens left, take one
        if self.bank["gold"] > 0:
            player["wallet"]["gold"] += 1
            self.bank["gold"] -= 1

        # Replace the reserved card with a new one from the hidden deck, if
        # there are cards left in the hidden deck.
        if is_from_visible:
            if len(self.decks[tier]["hidden"]) > 0:
                new_card = self.decks[tier]["hidden"].pop()
                self.decks[tier]["visible"].append(new_card)
        
        return self
        
    @action
    def action_purchase(self, player_id: str, card_id: int,
                        gold_usage: list[str]=[]) -> "Game":
        '''
        Purchase a development card, either from the visible deck or the
        player's reservations.
        
        Args:
            player_id (str): The player taking the action.
            card_id (int): The id of the development card to purchase.
            gold_usage (list[str]): A list of colors to use gold tokens for.
                Defaults to an empty list.
            
        Returns:
            Game: The updated game state.
        '''
        player = self.players[player_id]
        
        if card_id not in self.cards:
            raise ActionInvalidException(f"Card {card_id} does not exist")
        
        if player["wallet"]["gold"] < len(gold_usage):
            raise ActionInvalidException("Not enough gold tokens to use")
        
        # Calculate the effective price of the card, taking into account the
        # player's discounts
        effective_price = {
            color: price - self._get_player_discount(player_id, color)
            for color, price in self.cards[card_id]["price"].items()
        }
        
        # If the player is using gold tokens, adjust the effective price
        for color in gold_usage:
            # Effective price can't go below 0
            if effective_price[color] < 1:
                raise ActionInvalidException(f"Used excessive gold tokens for {color}")
            
            # Discount the price of the color...
            effective_price[color] -= 1
            
            # ...and add to the price of gold
            if "gold" not in effective_price:
                effective_price["gold"] = 1
            else:
                effective_price["gold"] += 1
                
        
        # Check if player can afford the card
        for color, price in effective_price.items():
            if player["wallet"][color] < price:
                raise ActionInvalidException(f"Not enough {color} tokens to purchase card")
                
        if card_id in player["reservations"]:
            # Transfer the card from reservations to developments
            player["reservations"] = tuple(
                card_id for card_id in player["reservations"] if card_id != card_id
            )
            player["developments"] += (card_id,)
            
        else:
            # Check if the card is available to be purchased
            tier = self._find_tier_of_card(card_id)
            if card_id not in self.decks[tier]["visible"]:
                raise ActionInvalidException(f"Card {card_id} is not up for grabs")
            
            # Transfer the card from the visible deck to the player's
            # developments
            self.decks[tier]["visible"].remove(card_id)
            player["developments"] += (card_id,)
            
            # Replace the purchased card with a new one from the hidden deck,
            # if there are cards left in the hidden deck
            if len(self.decks[tier]["hidden"]) > 0:
                new_card = self.decks[tier]["hidden"].pop()
                self.decks[tier]["visible"].append(new_card)
            
        # Transfer the price of the card from the player's wallet to the 
        # bank
        for color, price in effective_price.items():
            player["wallet"][color] -= price
            self.bank[color] += price
            
        return self

    def get_visible_state(self) -> dict:
        '''
        Get the visible state of the game. Intended to be used for API
        endpoints to communicate with the frontend.
        
        Returns:
            dict: A dictionary containing the visible state of the game.
        '''
        out = self.__dict__.copy()
        
        # Don't show the hidden decks
        for tier in out["decks"]:
            out["decks"][tier].pop("hidden")
            
        # Don't show the card glossary
        out.pop("cards")
        
        # Don't show the collection glossary
        out.pop("collections")
        
        return out
    
    def get_cards(self) -> list[dict]:
        '''
        Get the entire glossary of cards in the game. Intended to be used for
        API endpoints to communicate with the frontend.
        
        Returns:
            list[dict]: A list of all the cards in the game.
        '''
        return list(self.cards.values())
    
    def get_collections(self) -> list[dict]:
        '''
        Get the entire glossary of collections in the game. Intended to be used for
        API endpoints to communicate with the frontend.
        
        Returns:
            list[dict]: A list of all the collections in the game.
        '''
        return self.collections  

    @action
    def debug_action_pass(self, player_id: str) -> "Game":
        '''
        Debug action to pass the turn.
        
        Args:
            player_id (str): The player taking the action.
            
        Returns:
            Game: The updated game state.
        ''' 
        return self

    def __repr__(self) -> str:
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
