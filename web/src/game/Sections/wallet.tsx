import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"

import { GameState, Player } from "@/game/types"
import { tokenColorScheme } from "@/game/constants"
import { GetDisplayName } from "@/game/utils"
import { useGameStore } from "@/game/Store/game-store"

export default function WalletSection() {
    const { gameState, yourName } = useGameStore();
    const currentPlayer = gameState.game.players[yourName];

    if (!currentPlayer) {
         // Render a loading state
        return <div>Loading...</div>;
    }

    const tokens = [
        { name: 'White', amount: currentPlayer.wallet.white },
        { name: 'Black', amount: currentPlayer.wallet.black },
        { name: 'Red', amount: currentPlayer.wallet.red },
        { name: 'Green', amount: currentPlayer.wallet.green },
        { name: 'Blue', amount: currentPlayer.wallet.blue },
        { name: 'Gold', amount: currentPlayer.wallet.gold },
    ]

    const total = tokens.reduce((acc, token) => acc + token.amount, 0);

    return (
        <Card className="mx-auto">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div>
                        <div className="flex justify-between">
                            <CardTitle className="flex items-center gap-2 pb-4">
                                <Coins className="h-5 w-5 text-muted-foreground" />
                                Wallet
                                <div className="text-muted-foreground">({GetDisplayName(currentPlayer.name, yourName)})</div>
                            </CardTitle>

                            <div className="font-semibold text-muted-foreground">Capacity: {total} / 10</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tokens.map((token) => (
                                <div key={token.name} className={`${tokenColorScheme[token.name].background} p-2 rounded w-24`}>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.name}</span>
                                    </div>
                                    <div className="flex items-center text-lg font-semibold">
                                        <span className={`${tokenColorScheme[token.name].text}`}>{token.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}