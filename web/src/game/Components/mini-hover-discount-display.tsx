import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { GetOrderedPrice } from "@/game/utils"
import { GetTokenColorScheme } from "@/game/utils"
import { Player } from "@/game/types"

import { DevelopmentCard } from "@/game/Sections/developments"
import { useGameStore } from "@/game/Store/game-store"

export function MiniHoverDiscountHover({ color, player }: { color: string, player: Player }) {
  const gameState = useGameStore.getState().gameState
  const cards = gameState.cards
  const filteredCardIndexes = player.developments.filter((index) => cards[index].discount == color)
  const filteredCards = filteredCardIndexes.map((index) => cards[index])

  return (
    <div className="w-full flex flex-col gap-1 rounded-md">
      {filteredCards.map((card) => (
        <DevelopmentCard key={card.id} card={card} />
      ))}
    </div>
  )
}

export default function MiniHoverDiscountDisplay({ tokens, player }: { tokens: Record<string, number>, player: Player }) {
  return (<>{
    GetOrderedPrice(tokens).map(([color, amount]) => (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger>
          <Badge
            key={color}
            className={
              `${GetTokenColorScheme(color).verylight}
             ${GetTokenColorScheme(color).border}
             ${GetTokenColorScheme(color).text}
             text-xs text-center h-5 no-select`
            }
            variant="outline"
          >
            {amount}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-full p-0 rounded-md">
          <MiniHoverDiscountHover color={color} player={player} />
        </HoverCardContent>
      </HoverCard>
    ))
  } </>)
}