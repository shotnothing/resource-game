import { useState } from "react"
import { CreditCard, AlertCircle, Gift } from "lucide-react"

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

import { GameCard } from "@/game/types"
import ActionMarker from "@/game/Components/action-buttons/action-marker"
import { DoActionType } from '@/hooks/use-websocket'

export default function ReserveButton({ card, doAction }: { card: GameCard, doAction: DoActionType }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className={`px-2 h-8 ml-3 relative w-11/12`}
            variant="outline"
          >
            <ActionMarker />
            {'Reserve'}
            <BorderBeam size={50} duration={5} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Reserve this card</DialogTitle>
          </DialogHeader>
  
          <div>
            <DialogDescription className="text-base space-y-2">
              <div className="flex items-center text-muted-foreground dark:bg-amber-900 p-3 rounded-md">
                <CreditCard className="mr-4 h-8 w-8 text-muted-foreground" />
                <span>
                  This card will be reserved for you to purchase later, at a time of your choosing (or never).
                </span>
              </div>
  
              <div className="flex items-center text-muted-foreground dark:bg-amber-900 p-3 rounded-md">
                <AlertCircle className="mr-4 h-8 w-8 text-muted-foreground" />
                <span>
                  You can reserve up to 3 cards. Purchasing reserved cards will free up reservation slots.
                </span>
              </div>
  
              <div className="flex items-center bg-amber-100 dark:bg-amber-900 p-3 rounded-md">
                <Gift className="mr-4 h-8 w-8 text-amber-500" />
                <span>
                  You will receive a <span className="text-amber-500 font-bold">gold token</span>, which can substitute for a token of any color.
                </span>
              </div>
            </DialogDescription>
          </div>
  
          <DialogFooter>
            <Button type="submit" className="relative" variant="outline"
              onClick={() => {
                doAction('reserve', { 
                  tier: '1', // Tier should be ignored if card_id is provided
                  card_id: card.id 
                });
                setDialogOpen(false);
              }}
            >
              Commit Turn
              <ActionMarker />
              <BorderBeam size={50} duration={5} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }