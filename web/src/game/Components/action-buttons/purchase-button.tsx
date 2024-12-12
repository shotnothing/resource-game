import { useState } from "react"
import { CreditCard, Ticket, Trophy } from "lucide-react"

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

import { GetTokenColorScheme } from "@/game/utils"
import ActionMarker from "@/game/Components/action-buttons/action-marker"
import { GameCard, Player } from "@/game/types"
import {
    GetPlayerDiscount,
    GetPriceAfterDiscount,
    CanPlayerAfford,
    PriceSum,
    ApplyGoldTokens,
    IsFree,
    DropZeros
} from "@/game/utils"
import MiniTokenDisplay from "@/game/Components/mini-token-display"
import GoldTokenSelector from "@/game/Components/gold-token-selector"
import RainbowText from "@/game/Components/rainbow-text"
import { useGameStore } from "@/game/Store/game-store"

export default function PurchaseButton({ card, player }: { card: GameCard, player: Player }) {
    const [goldTokenUsage, setGoldTokenUsage] = useState({
        white: 0,
        black: 0,
        red: 0,
        green: 0,
        blue: 0,
    })

    const gameState = useGameStore.getState().gameState
    const cards = gameState.cards

    const discount = GetPlayerDiscount(player, cards)
    const priceAfterDiscount = GetPriceAfterDiscount(card.price, discount)

    const canPlayerAfford = CanPlayerAfford(player, priceAfterDiscount)
    const goldTokenCost = PriceSum(goldTokenUsage)

    const priceAfterGoldTokens = ApplyGoldTokens(priceAfterDiscount, goldTokenUsage)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={`px-2 h-8 ml-3 relative w-11/12`}
                    variant="outline"
                    disabled={!canPlayerAfford}
                >
                    <ActionMarker />
                    {'Purchase'}
                    {canPlayerAfford && <BorderBeam size={50} duration={5} />}
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                // TODO: Focus on the commit button first, instead of just disabling auto focus
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Purchase this card</DialogTitle>
                </DialogHeader>

                <div>
                    <DialogDescription className="text-base space-y-2">
                        <div className="flex items-center text-muted-foreground dark:bg-amber-900 p-3 rounded-md">
                            <CreditCard className="mr-4 h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col gap-2">
                                <span>
                                    This card will be added to your developments at the cost of {
                                        IsFree(priceAfterDiscount)
                                            ? <RainbowText className='font-semibold' text='Free! ' />
                                            : <MiniTokenDisplay tokens={
                                                DropZeros({
                                                    'gold': goldTokenCost,
                                                    ...priceAfterGoldTokens
                                                })
                                            } />
                                    }
                                    tokens
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center bg-muted dark:bg-amber-900 p-3 rounded-md">
                            <Ticket className="mr-4 h-4 w-4 text-muted-foreground" />
                            <span>
                                You will attain a
                                <span className={`${GetTokenColorScheme(card.discount).textlight} font-semibold`}>{` -1 `}</span>
                                discount on any
                                <span className={`${GetTokenColorScheme(card.discount).textlight} font-semibold`}>{` ${card.discount} `}</span>
                                token purchase in the future.
                            </span>
                        </div>

                        {card.score > 0 && <div className="flex items-center bg-muted dark:bg-amber-900 p-3 rounded-md">
                            <Trophy className="mr-4 h-4 w-4 text-muted-foreground" />
                            <span>
                                You will recieve <span className="text-muted-foreground font-bold">{card.score}</span> victory points from this purchase.
                            </span>
                        </div>}
                    </DialogDescription>
                </div>

                {player.wallet.gold > 0 && !IsFree(priceAfterDiscount) && <div className="w-full">
                    <GoldTokenSelector
                        maxGoldTokens={player.wallet.gold}
                        onGoldTokensChange={(color, amount) => {
                            setGoldTokenUsage((prev) => ({ ...prev, [color]: amount }))
                        }}
                        goldTokenUsage={goldTokenUsage}
                        price={DropZeros(priceAfterDiscount)}
                    />
                </div>}


                <DialogFooter>
                    <Button type="submit" className="relative" variant="outline">
                        Commit Turn
                        <ActionMarker />
                        <BorderBeam size={50} duration={5} />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}