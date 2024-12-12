import { Badge } from "@/components/ui/badge"
import { GetOrderedPrice } from "@/game/utils"
import { GetTokenColorScheme } from "@/game/utils"

export default function MiniTokenDisplay({ tokens, dropZero = false }: { tokens: Record<string, number>, dropZero?: boolean }) {
    return (<>{
        GetOrderedPrice(tokens).map(([color, amount]) => (
            dropZero && amount == 0 ? <></> : <Badge
                key={color}
                className={
                    `${GetTokenColorScheme(color).backgroundDark} text-xs text-center ${GetTokenColorScheme(color).text} h-5`
                }
                variant="outline"
            >
                {amount}
            </Badge>
        ))
    } </>)
}