import { Flag } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameCard } from "@/game/types"
import { GetArtFromCard } from "@/game/art"
import {
  GetPlayerDiscount,
  GetPriceAfterDiscount,
  GetTokenColorScheme,
  GetDisplayName,
} from "@/game/utils"
import PriceDisplay from "@/game/Components/price-display"
import PurchaseButton from "@/game/Components/action-buttons/purchase-button"

import { useGameStore } from "@/game/Store/game-store"
import { useBoardSettingsStore } from "@/game/Store/board-settings-store"
import { DoActionType } from "@/hooks/use-websocket"

export function ReservationCard({ card, isPurchasable = true, doAction = null }: { card: GameCard, isPurchasable: boolean, doAction: DoActionType | null }) {
  const gameState = useGameStore.getState().gameState
  const currentPlayerName = useGameStore.getState().yourName
  const currentPlayer = gameState.game.players[currentPlayerName]

  const { viewDiscountedPrices } = useBoardSettingsStore()
  const art = GetArtFromCard(card)

  const discount = GetPlayerDiscount(currentPlayer, gameState.cards)
  const priceAfterDiscount = GetPriceAfterDiscount(card.price, discount)

  return (
    <Card className={`transition-colors hover:bg-muted/50 border-0 border-l-4 ${GetTokenColorScheme(card.discount).border} ${GetTokenColorScheme(card.discount).verylight}`}>
      <CardContent className="p-1">

        <div className='flex justify-between gap-4'>

          <div className="flex items-center gap-2">
            <div className="text-2xl">{art.icon}</div>
            <div className="text-md font-bold text-muted-foreground">{GetArtFromCard(card).name} ({card.score})</div>
          </div>

          <div className="flex justify-between gap-1">
            <PriceDisplay price={viewDiscountedPrices ? priceAfterDiscount : card.price} />

            {isPurchasable && <PurchaseButton card={card} player={currentPlayer} doAction={doAction} />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export default function ReservationsSection({ doAction }: { doAction: DoActionType }) {
  const { gameState, yourName } = useGameStore();
  const currentPlayer = gameState.game.players[yourName];

  if (!currentPlayer) {
    return <div>Loading...</div>; // Render a loading state if player is undefined
  }

  const reservationsIndexes = currentPlayer.reservations;
  const reservations = reservationsIndexes.map((index) => gameState.cards[index]);

  return (
    <Card>
      <CardHeader className="py-5">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-muted-foreground" />
            Reservations
            <div className="text-muted-foreground">({GetDisplayName(yourName, yourName)})</div>
          </CardTitle>
          <div className="font-semibold text-muted-foreground">Maximum 3</div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        {reservations.length > 0
          ?   <div className="space-y-3">
              {reservations.map((reservation) => (
                <ReservationCard key={reservation.id} card={reservation} isPurchasable={true} doAction={doAction} />
              ))}
            </div>
          : <div className="text-muted-foreground text-center">No reservations</div>}
      </CardContent>
    </Card>
  )
}