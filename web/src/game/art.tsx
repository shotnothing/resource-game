import { GameCard, Noble } from './types'
import art from '@/resources/art.json'

export function GetArtFromCard(card: GameCard) {
    return art[card.art as keyof typeof art]
}

export function GetArtFromNoble(noble: Noble) {
    return art[noble.art as keyof typeof art]
}