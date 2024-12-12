import { Card, CardContent } from "@/components/ui/card"
import { GetTokenColorScheme } from "@/game/utils"
import { GameCard } from "@/game/types"
import { GetArtFromCard } from "@/game/art"

export default function MiniReservationCard({ card }: { card: GameCard }) {
    return (
        <Card className={`${GetTokenColorScheme(card.discount).verylight} ${GetTokenColorScheme(card.discount).border} border-0 border-l-4 rounded-md`}>
            <CardContent className="p-1 flex flex-row gap-1">
                <div className="text-sm">{GetArtFromCard(card).icon}</div>
            </CardContent>
        </Card>
    )
}