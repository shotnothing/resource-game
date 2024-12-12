import { Badge } from "@/components/ui/badge"
import { GetOrderedPrice } from "@/game/utils"
import { GetTokenColorScheme } from "@/game/utils"

export default function PriceDisplay({ price }: { price: Record<string, number> }) {
    return (
        <div className="grid grid-cols-4 gap-1 items-center no-select">
            {GetOrderedPrice(price).map(([color, amount]) => (
                amount > 0 && (
                    <Badge
                        key={color}
                        className={
                            `${GetTokenColorScheme(color).backgroundDark} text-sm text-center ${GetTokenColorScheme(color).text} w-7 h-7`
                        }
                        variant="outline"
                    >
                        {amount}
                    </Badge>
                )
            ))}
        </div>
    )
}