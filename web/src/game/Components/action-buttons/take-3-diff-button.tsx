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

export default function Take3DiffButton({ doAction }: { doAction: DoActionType }) {
    const { gameState, yourName } = useGameStore();
    const player = gameState.game.players[yourName];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>({
        white: false,
        black: false,
        red: false,
        green: false,
        blue: false,
    });

    if (!player) {
        return <div>Loading...</div>;
    }

    const handleColorChange = (color: string) => {
        setSelectedColors(prev => {
            const newSelection = { ...prev, [color]: !prev[color] };
            const selectedCount = Object.values(newSelection).filter(Boolean).length;
            if (selectedCount > 3) {
                return prev;
            }
            return newSelection;
        });
    };

    const selectedCount = Object.values(selectedColors).filter(Boolean).length;

    const totalInPlayerWallet = Object.values(player.wallet).reduce((acc, curr) => acc + curr, 0)

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full relative" variant="outline" disabled={totalInPlayerWallet >= 10}>
                    <ActionMarker />
                    Take 3 Diff.
                    {totalInPlayerWallet < 10 && <BorderBeam size={50} duration={5} />}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Take 3 Different-colored Tokens</DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-base space-y-2">
                    Take 3 different tokens from the bank to your wallet.
                    The colors chosen must be unique.
                </DialogDescription>

                <div className={`grid grid-cols-2 gap-2`}>
                    {Object.entries(selectedColors).map(([color, isSelected]) => (
                        <div key={color} className={`flex items-center space-x-2 p-1 rounded-md 
                ${GetTokenColorScheme(color).backgroundDark}
                ${GetTokenColorScheme(color).border}
                ${GetTokenColorScheme(color).text}
              `}>
                            <Checkbox
                                id={color}
                                checked={isSelected}
                                onCheckedChange={() => handleColorChange(color)}
                                disabled={!isSelected && selectedCount >= 3}
                                className={`
                    flex items-center justify-center
                    data-[state=checked]:bg-muted-foreground
                    p-4
                    ${GetTokenColorScheme(color).verylight}
                    ${GetTokenColorScheme(color).border}
                    ${GetTokenColorScheme(color).text}
                  `}
                            />
                            <Label
                                htmlFor={color}
                                className={`capitalize`}
                            >
                                +1 {color}
                            </Label>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        className="relative"
                        variant="outline"
                        disabled={selectedCount !== 3}
                        onClick={() => {
                            doAction('take_different', { 
                                colors: Object.keys(selectedColors).filter(color => selectedColors[color]) 
                            });
                            setDialogOpen(false);
                        }}
                    >
                        Commit Turn
                        <ActionMarker />
                        {selectedCount == 3 && <BorderBeam size={50} duration={5} />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}