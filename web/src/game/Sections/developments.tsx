import { Trophy } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { GameCard } from "@/game/types"
import { GetTokenColorScheme, GetDisplayName, GetOrderedPrice } from "@/game/utils"
import { GetArtFromCard } from "@/game/art"
import PriceDisplay from "@/game/Components/price-display"
import { useGameStore } from "@/game/Store/game-store"

export function DevelopmentCard({ card }: { card: GameCard }) {
    const art = GetArtFromCard(card)
    return (
        <Card className={`transition-colors hover:bg-muted/50 border-0 border-l-4 ${GetTokenColorScheme(card.discount).border} ${GetTokenColorScheme(card.discount).verylight}`}>
            <CardContent className="p-1">

                <div className='flex items-center justify-between gap-4'>

                    <div className="flex items-center gap-2">
                        <div className="text-2xl">{art.icon}</div>
                        <div className="text-md font-bold text-muted-foreground">{GetArtFromCard(card).name} ({card.score})</div>
                    </div>

                    <div className="flex flex-row gap-1">
                        <PriceDisplay price={card.price} />
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

export default function DevelopmentsSection() {
    const { gameState, yourName } = useGameStore();
    const currentPlayer = gameState.game.players[yourName];

    if (!currentPlayer) {
        return <div>Loading...</div>; // Render a loading state if player is undefined
    }

    const developments = currentPlayer.developments.map((development) => gameState.cards[development]);

    const totalDiscount = developments.reduce((acc, development) => {
        const discountColor = development.discount as keyof typeof acc;
        acc[discountColor] += 1;
        return acc;
    }, {
        black: 0,
        blue: 0,
        green: 0,
        red: 0,
        white: 0,
    });

    const totalScore = developments.reduce((acc, development) => {
        return acc + development.score;
    }, 0);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="py-5">
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                    Developments
                    <div className="text-muted-foreground">({GetDisplayName(currentPlayer.name, yourName)})</div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 flex-1 overflow-hidden flex flex-col">
                <div className="flex flex-col gap-3 mb-3">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="text-md font-semibold text-muted-foreground">Total Discount: </div>
                        <div className="flex flex-row gap-1 no-select">
                            {GetOrderedPrice(totalDiscount).map(([color, amount]) => (
                                <Badge
                                    key={color}
                                    className={
                                        `${GetTokenColorScheme(color).verylight} ${GetTokenColorScheme(color).border} text-sm text-center ${GetTokenColorScheme(color).text} h-7`
                                    }
                                    variant="outline"
                                >
                                    {amount}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <div className="text-md font-semibold text-muted-foreground">Total Victory Points: </div>
                        <div className="text-md font-bold text-muted-foreground">{totalScore} / 15</div>
                        <Progress className="w-[30%]" indicatorColor='bg-muted-foreground' value={totalScore / 15 * 100} />
                    </div>

                    <Separator className="w-full" />
                </div>

                <ScrollArea className="flex-1">
                    <div className="space-y-3 pr-4">
                        {developments.length > 0
                            ? developments.reverse().map((development) => (
                                    <DevelopmentCard key={development.id} card={development} />
                                ))
                            : <div className="text-muted-foreground text-center">No developments</div>}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}