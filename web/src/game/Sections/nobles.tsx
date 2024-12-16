import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GetOrderedPrice, GetTokenColorScheme } from "@/game/utils"
import { Noble } from "@/game/types"
import { useGameStore } from "../Store/game-store"
import { PersonStanding } from "lucide-react"
import { GetArtFromNoble } from "../art"

export function NobleCard({ noble }: { noble: Noble }) {
    const art = GetArtFromNoble(noble)
    return (
        <Card className="hover:scale-105 transition-all">
            <CardContent className="flex flex-col items-center justify-center py-2 px-2">

                <div className="flex flex-col gap-3">

                    <div className="flex flex-col items-center">
                        <div className="text-md font-bold text-muted-foreground">{art.name}</div>
                        <div className="text-5xl text-muted-foreground">{art.icon}</div>
                    </div>

                    <div className="grid grid-cols-2 items-center justify-center gap-1 no-select">
                        {GetOrderedPrice(noble.trigger).map(([color, amount]) => (
                            amount > 0 && (
                                <Badge
                                    key={color}
                                    className={
                                        `${GetTokenColorScheme(color).verylight} ${GetTokenColorScheme(color).border} text-sm text-center ${GetTokenColorScheme(color).text} h-7`
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
    )
}

export default function NoblesSection() {
    const gameState = useGameStore.getState().gameState
    
    const nobles = gameState.game.collections_in_play.map((index) => {
        const noble = gameState.collections[index];
        // Ensure all keys are present in the trigger
        const completeTrigger: Record<string, number> = {
            black: noble.trigger.black || 0,
            blue: noble.trigger.blue || 0,
            green: noble.trigger.green || 0,
            red: noble.trigger.red || 0,
            white: noble.trigger.white || 0,
        };
        return { ...noble, trigger: completeTrigger };
    });

    return (
        <Card>
            <CardHeader className="py-5">
                <CardTitle className="flex items-center gap-2">
                    <PersonStanding className="h-5 w-5 text-muted-foreground text-yellow-500" />
                    Nobles
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-2">
                    {nobles.map((noble) => (
                        <NobleCard key={noble.art} noble={noble} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
