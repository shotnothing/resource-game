import { Crown } from "lucide-react"

import { Player } from "@/game/types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Swords, Trophy } from "lucide-react"
import { GetPlayerDiscount } from "@/game/utils"
import { GetPlayerScore } from "@/game/utils"
import MiniTokenDisplay from "@/game/Components/mini-token-display"
import MiniHoverDiscountDisplay from "@/game/Components/mini-hover-discount-display"
import MiniHoverReservationCard from "@/game/Components/mini-hover-reservation-card"
import { useGameStore } from "@/game/Store/game-store"
import { cn } from "@/lib/utils"

export function PlayerCard({ player, isTurn = false }: { player: Player, isTurn: boolean }) {
  const gameState = useGameStore.getState().gameState
  const yourName = useGameStore.getState().yourName

  const totalDiscount = GetPlayerDiscount(player, gameState.cards)
  const reservations = player.reservations.map((index) => gameState.cards[index])

  return (
    <Card className={cn("transition-colors hover:bg-muted/50", isTurn && "border-yellow-500 border-2")}>
      <CardContent className="p-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2">
            <Swords className="h-4 w-4" />
          </div>
          <div className="space-y-1">

            <div className="flex flex-row items-center justify-between gap-2">
              <h3 className="font-medium">{player.name} {player.name == yourName ? "(You)" : ""}</h3>
              <div className="flex flex-row items-center gap-1">
                {player.name != yourName && <p className="text-md font-bold text-muted-foreground">{GetPlayerScore(player, gameState.cards)}</p>}
                {player.name != yourName && <Trophy className="h-4 w-4 text-muted-foreground/50" />}
              </div>
            </div>

            {player.name != yourName && (
              <>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-semibold text-muted-foreground">Wallet:</p>

                  <div className="flex flex-row gap-1 no-select">
                    <MiniTokenDisplay tokens={player.wallet} />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-semibold text-muted-foreground">Discount:</p>

                  <div className="flex flex-row gap-1">
                    <MiniHoverDiscountDisplay tokens={totalDiscount} player={player} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-muted-foreground">Reservations:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {reservations.map((reservation) => (
                      <MiniHoverReservationCard key={reservation.id} card={reservation} />
                    ))}
                  </div>
                </div>

              </>)}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayersList() {
  const gameState = useGameStore.getState().gameState
  const yourName = useGameStore.getState().yourName
  const players = Object.entries(gameState.game.players).map(([name, player]) => ({ ...player, name }))

  const turn = gameState.game.turn % players.length

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-5">
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Players
          </div>
          {yourName == players[turn].name && (
            <div className=" text-primary animate-pulse-scale">
              Your Turn
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} isTurn={player.name == players[turn].name} />
        ))}
      </CardContent>
    </Card >
  )
}
