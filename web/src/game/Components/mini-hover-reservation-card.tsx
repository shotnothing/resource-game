import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { GameCard } from "@/game/types"
import MiniReservationCard from "@/game/Components/mini-reservation-card"
import { ReservationCard } from "@/game/Sections/reservations"

export default function MiniHoverReservationCard({ card }: { card: GameCard }) {
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger>
          <MiniReservationCard card={card} />
        </HoverCardTrigger>
        <HoverCardContent className="w-full p-0">
          <div className="w-full">
            <ReservationCard card={card} isPurchasable={false} />
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }