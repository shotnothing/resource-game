import { Card, CardContent} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { useBoardSettingsStore } from "@/game/Store/board-settings-store"

export default function SettingsSection() {
    const { viewDiscountedPrices, setViewDiscountedPrices } = useBoardSettingsStore()

    return (
        <Card className="p-4">
            <CardContent className="text-muted-foreground">

                <div className="flex items-center space-x-2">
                    <Switch
                        id="view-discounted-prices"
                        className="data-[state=checked]:bg-muted-foreground"
                        checked={viewDiscountedPrices}
                        onCheckedChange={setViewDiscountedPrices}
                    />
                    <Label htmlFor="view-discounted-prices">View Discounted Prices</Label>
                </div>

            </CardContent>
        </Card>
    )
}