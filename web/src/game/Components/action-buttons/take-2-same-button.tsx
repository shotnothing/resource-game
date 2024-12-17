import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { BorderBeam } from "@/components/ui/border-beam"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { GetTokenColorScheme } from "@/game/utils"
import ActionMarker from "@/game/Components/action-buttons/action-marker"

import { useGameStore } from '@/game/Store/game-store'
import { DoActionType } from '@/hooks/use-websocket'
import { Wallet } from "@/game/types"

export default function Take2SameButton({ doAction }: { doAction: DoActionType }) {
    const { gameState, yourName } = useGameStore();
    const player = gameState.game.players[yourName];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null)

    if (!player) {
        return <div>Loading...</div>;
    }

    
    const colors: Array<keyof Wallet> = ['white', 'black', 'red', 'green', 'blue']
    const totalInPlayerWallet = Object.values(player.wallet).reduce((acc, curr) => acc + curr, 0)


    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full relative" variant="outline" disabled={totalInPlayerWallet >= 10}>
                    <ActionMarker />
                    Take 2 Same
                    {totalInPlayerWallet < 10 && <BorderBeam size={50} duration={5} />}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Take 2 Same-colored Tokens</DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-base space-y-2">
                    Take 2 tokens of the same color from the bank to your wallet.
                </DialogDescription>

                <div className={`grid grid-cols-2 gap-2`}>
                    {colors.map((color) => (
                        <div key={color} className={`flex items-center space-x-2 p-1 rounded-md 
                ${GetTokenColorScheme(color).backgroundDark}
                ${GetTokenColorScheme(color).border}
                ${GetTokenColorScheme(color).text}
              `}>
                            <Checkbox
                                id={color}
                                checked={color == selectedColor}
                                onCheckedChange={() => {
                                    selectedColor == color ? setSelectedColor(null) : setSelectedColor(color)
                                }}
                                className={`
                                    flex items-center justify-center
                                    data-[state=checked]:bg-muted-foreground
                                    p-4
                                    ${GetTokenColorScheme(color).verylight}
                                    ${GetTokenColorScheme(color).border}
                                    ${GetTokenColorScheme(color).text}
                                `}
                                disabled={
                                    gameState.game.bank[color] < 4
                                }
                            />
                            <Label
                                htmlFor={color}
                                className={`capitalize`}
                            >
                                +2 {color}
                            </Label>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        className="relative"
                        variant="outline"
                        disabled={selectedColor == null}
                        onClick={() => {
                            doAction('take_same', { color: selectedColor });
                            setDialogOpen(false);
                        }}
                    >
                        Commit Turn
                        <ActionMarker />
                        {selectedColor && <BorderBeam size={50} duration={5} />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}