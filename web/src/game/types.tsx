export type Player = {
    name: string
    attained_collection: number | null
    developments: number[]
    reservations: number[]
    wallet: Wallet
}

export type GameCard = {
    id: number
    art: string
    discount: string
    price: Record<string, number>
    score: number
    tier: string
}

export type Noble = {
    art: string
    score: number
    trigger: Record<string, number>
}

export type GameState = {
    cards: Record<number, GameCard>
    collections: Record<number, Noble>
    game: {
        bank: Wallet
        began: boolean
        collections_in_play: number[]
        decks: Record<string, Deck>
        players: Record<string, Player>
        turn: number
    }
}

export type Wallet = {
    black: number
    blue: number
    gold: number
    green: number
    red: number
    white: number
}

export type Deck = {
    visible: number[]
    hidden_count: number
}
