import { tokenColorScheme, tokenColorOrder } from "./constants"
import { type Player, type GameCard } from "./types"

export function Capitalize(token: string) {
    return token.charAt(0).toUpperCase() + token.slice(1)
}

export function GetTokenColorScheme(token: string) {
    return tokenColorScheme[Capitalize(token)]
}

export function GetOrderedPrice(price: Record<string, number>) {
    return Object.entries(price)
        .filter(([color]) => tokenColorOrder.includes(color)) // Filter out any colors that are not in the ORDER array
        .sort(([colorA], [colorB]) => tokenColorOrder.indexOf(colorA) - tokenColorOrder.indexOf(colorB)); // Sort
}

export function GetDisplayName(name: string, yourName: string) {
    if (name == yourName) {
        return `You`
    }
    return name
}

export function GetPlayerScore(player: Player, cards: Record<string, GameCard>) {
    return player.developments.reduce((acc, development) => acc + cards[development].score, 0)
}

export function GetPlayerDiscount(player: Player | undefined, cards: Record<number, GameCard>): Record<string, number> {
    if (!player) {
        console.warn("Player is undefined");
        return {
            black: 0,
            blue: 0,
            green: 0,
            red: 0,
            white: 0,
        };
    }
    return player.developments.reduce((acc, development) => {
        const discountColor = cards[development].discount as keyof typeof acc;
        acc[discountColor] += 1;
        return acc;
    }, {
        black: 0,
        blue: 0,
        green: 0,
        red: 0,
        white: 0,
    });
}

export function GetPriceAfterDiscount(
    price: Record<string, number>,
    discount: Record<string, number>
): Record<string, number> {
    const adjustedPrice: Record<string, number> = {};
    for (const [color, amount] of Object.entries(price)) {
        // Ensure we don't end up with negative values
        adjustedPrice[color] = Math.max(0, amount - (discount[color] || 0));
    }
    return adjustedPrice;
}

export function IsFree(price: Record<string, number>) {
    return Object.values(price).every(amount => amount === 0)
}


export function ApplyGoldTokens(price: Record<string, number>, subtractions: Record<string, number>): Record<string, number> {
    return Object.fromEntries(
        Object.entries(price).map(([color, amount]) => [color, amount - subtractions[color]])
    );
}

export function PriceSubtraction(price: Record<string, number>, subtractions: Record<string, number>): Record<string, number> {
    return Object.fromEntries(
        Object.entries(price).map(([color, amount]) => [color, amount - subtractions[color]])
    );
}

export function PriceSum(price: Record<string, number>): number {
    return Object.values(price).reduce((acc, amount) => amount ? acc + amount : acc, 0);
}

export function PriceDropNonNegative(price: Record<string, number>): Record<string, number> {
    return Object.fromEntries(
        Object.entries(price).map(([color, amount]) => [color, amount < 0 ? amount : 0])
    );
}

export function CanPlayerAfford(player: Player, priceAfterDiscount: Record<string, number>) {
    const finalWallet = PriceSubtraction(player.wallet, priceAfterDiscount)
    const walletDeficit = PriceDropNonNegative(finalWallet)

    const numberOfGoldTokens = player.wallet.gold
    const goldTokenCost = -PriceSum(walletDeficit)

    return numberOfGoldTokens >= goldTokenCost
}

export function DropZeros(price: Record<string, number>) {
    return Object.fromEntries(Object.entries(price).filter(([color, amount]) => amount > 0))
}