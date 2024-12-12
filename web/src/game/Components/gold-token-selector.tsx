import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GetOrderedPrice } from "@/game/utils"
import { GetTokenColorScheme } from "@/game/utils"

export default function GoldTokenSelector({
    maxGoldTokens,
    price,
    onGoldTokensChange,
    goldTokenUsage,
}: {
    maxGoldTokens: number,
    price: Record<string, number>,
    onGoldTokensChange: (color: string, amount: number) => void,
    goldTokenUsage: Record<string, number>
}) {
    const totalUsed = Object.values(goldTokenUsage).reduce((sum, amount) => sum + amount, 0)
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span>Use <span className="text-amber-500 font-bold">gold tokens</span>: </span>
                <Badge variant="outline" className="bg-amber-100 text-amber-900">
                    {maxGoldTokens - totalUsed} left
                </Badge>
            </div>
            <div className="flex flex-row gap-2 justify-center">
                {GetOrderedPrice(price).map(([color, amount]) => (
                    <div key={color} className="flex flex-col items-center">
                        <div className="flex items-center">
                            <Input
                                type="number"
                                value={goldTokenUsage[color]}
                                onChange={(e) => onGoldTokensChange(color, parseInt(e.target.value))}
                                className={`
                    ${GetTokenColorScheme(color).verylight} 
                    ${GetTokenColorScheme(color).border}
                    ${GetTokenColorScheme(color).text}
                    text-center`}
                                min={0}
                                max={
                                    Math.min(
                                        maxGoldTokens - totalUsed + goldTokenUsage[color],
                                        price[color]
                                    )
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
