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

export default function Take2SameButton() {
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const colors = ['white', 'black', 'red', 'green', 'blue']

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full relative" variant="outline">
                    <ActionMarker />
                    Take 2 Same
                    <BorderBeam size={50} duration={5} />
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
                    data-[state=checked]:
                    ${GetTokenColorScheme(color).verylight}
                    ${GetTokenColorScheme(color).border}
                    ${GetTokenColorScheme(color).text}
                  `}
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