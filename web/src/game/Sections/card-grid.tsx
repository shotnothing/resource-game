import { Card, CardContent } from "@/components/ui/card"
import { useGameStore } from "@/game/Store/game-store"
import { cn } from "@/lib/utils"
import { GameCard as GameCardType } from "@/game/types"
import { IsFree, GetOrderedPrice, GetPlayerDiscount, GetPriceAfterDiscount, GetTokenColorScheme } from "@/game/utils"
import { Trophy, Gem } from "lucide-react"
import PurchaseButton from "@/game/Components/action-buttons/purchase-button"
import ReserveButton from "@/game/Components/action-buttons/reserve-button"
import RainbowText from "@/game/Components/rainbow-text"
import { Badge } from "@/components/ui/badge"
import { useBoardSettingsStore } from "@/game/Store/board-settings-store"
import { GetArtFromCard } from "@/game/art"


export function DeckCard({ tier, onClick = () => { } }: { tier: string, onClick?: () => void }) {
    const gameState = useGameStore.getState().gameState
    return (
        <Card
            className="bg-gradient-to-br from-primary/10 to-primary/5 border-r-4 border-b-4 border-t-0 border-l-0 border-muted-foreground/25"
            onClick={onClick}
        >
            <CardContent className="flex aspect-[3/4] items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-lg font-semibold">Tier {tier}</div>
                    <div className="text-sm text-muted-foreground">Cards Left: {gameState.game.decks[tier as keyof typeof gameState.game.decks].hidden_count}</div>
                </div>
            </CardContent>
        </Card>
    );
}

export function GameCard({
    card,
    isFocused = false,
    setFocused = () => { },

}: {
    card: GameCardType,
    isFocused?: boolean,
    setFocused: (card: number) => void,
}) {
    const { viewDiscountedPrices } = useBoardSettingsStore()
    const gameState = useGameStore.getState().gameState
    const currentPlayer = useGameStore.getState().currentPlayer

    const discount = GetPlayerDiscount(currentPlayer, gameState.cards)
    const priceAfterDiscount = GetPriceAfterDiscount(card.price, discount)

    return (
        <Card
            className={cn("transition-all hover:scale-105 shadow-lg", isFocused && "scale-105 shadow-indigo-500/50")}
            onClick={() => setFocused(card.id)}
        >
            <CardContent className="flex flex-col aspect-[3/4] p-4 py-3">
                <div className="flex items-start gap-2">
                    {card.score > 0 && <div>
                        <h2 className="text-3xl font-bold text-muted-foreground">{card.score}</h2>
                        <Trophy className="h-4 w-4 text-muted-foreground/50" />
                        {/* <div className="text-xs text-muted-foreground font-semibold ${GetTokenColorScheme(card.discount).textlight">Points</div> */}
                    </div>}
                    <div className="flex-grow"></div>
                    <div className={`flex flex-col items-center pt-1`}>
                        <Gem className={`h-8 w-8 ${GetTokenColorScheme(card.discount).textlight}`} />
                        {/* <div className={`text-md text-muted-foreground font-medium ${GetTokenColorScheme(card.discount).textlight}`}>-1</div> */}
                    </div>

                </div>

                <div className="flex items-center justify-center flex-col gap-4">
                    <div className={cn("text-6xl font-bold", isFocused && "blur-sm")}>{GetArtFromCard(card).icon}</div>
                    <div className={cn("text-md font-bold text-muted-foreground", isFocused && "blur-sm")}>{GetArtFromCard(card).name}</div>
                    {isFocused && (<>
                        <div className="flex flex-col gap-2 absolute inset-0 m-auto w-3/4 justify-center">
                            <PurchaseButton card={card} player={currentPlayer} />
                            <ReserveButton />
                        </div>
                    </>)}
                </div>

                <div className="mt-auto">

                    <div className="flex flex-row gap-1">
                        <div className="text-sm text-muted-foreground font-semibold">Price:</div>
                        {IsFree(viewDiscountedPrices ? priceAfterDiscount : card.price) ? <RainbowText text="Free!" className="text-sm font-bold" /> : <></>}
                    </div>

                    <div className="grid grid-cols-4 gap-2 no-select">
                        {GetOrderedPrice(viewDiscountedPrices ? priceAfterDiscount : card.price).map(([color, amount]) => (
                            amount > 0 && (
                                <Badge
                                    key={color}
                                    className={
                                        `${GetTokenColorScheme(color).background} text-md text-center ${GetTokenColorScheme(color).text}`
                                    }
                                    variant="outline"
                                >
                                    {amount}
                                </Badge>
                            )
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CardGrid({ focusedCard, setFocusedCard }: { focusedCard: number | null, setFocusedCard: (card: number) => void }) {
    const gameState = useGameStore.getState().gameState

    return (
        <div className="grid grid-cols-5 gap-4">
            {["3", "2", "1"].map((tier) => (
                <>
                    <DeckCard key={`deck-${tier}`} tier={tier} onClick={() => setFocusedCard(-1)} />
                    {[0, 1, 2, 3].map((index) => {
                        const deck = gameState.game.decks[tier as keyof typeof gameState.game.decks]
                        const cardIndex = deck.visible[index]
                        const card = gameState.cards[cardIndex]
                        return <GameCard key={`card-${tier}-${index}`} card={card} isFocused={focusedCard === cardIndex} setFocused={setFocusedCard} />
                    })}
                </>
            ))}
        </div>
    )
}


