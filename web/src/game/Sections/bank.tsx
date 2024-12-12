import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { tokenColorScheme } from "@/game/constants"
import Take2SameButton from "@/game/Components/action-buttons/take-2-same-button"
import Take3DiffButton from "@/game/Components/action-buttons/take-3-diff-button"
import { useGameStore } from "@/game/Store/game-store"

export default function BankSection() {
    const gameState = useGameStore.getState().gameState
    const tokens = [
        { name: 'White', amount: gameState.game.bank.white, max: 7 },
        { name: 'Black', amount: gameState.game.bank.black, max: 7 },
        { name: 'Red', amount: gameState.game.bank.red, max: 7 },
        { name: 'Green', amount: gameState.game.bank.green, max: 7 },
        { name: 'Blue', amount: gameState.game.bank.blue, max: 7 },
        { name: 'Gold', amount: gameState.game.bank.gold, max: 5 },
    ]

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 pb-4">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-medium">Bank</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {tokens.map((token) => (
                        <div key={token.name} className={`${tokenColorScheme[token.name].background} p-2 rounded`}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.name}</span>
                                <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.amount}/{token.max}</span>
                            </div>
                            <Progress
                                value={(token.amount / token.max) * 100}
                                className={`h-2 ${tokenColorScheme[token.name].verylight}`}
                                indicatorColor={tokenColorScheme[token.name].indicator}
                            />
                        </div>
                    ))}
                </div>

                <Separator className="w-full my-2" />

                <div className="flex flex-row gap-2">
                    <Take2SameButton />
                    <Take3DiffButton />
                </div>

            </CardContent>
        </Card>
    )
}