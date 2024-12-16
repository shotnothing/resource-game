import { useState } from "react";

import BankSection from "@/game/Sections/bank";
import PlayersList from "@/game/Sections/players";
import CardGrid from "@/game/Sections/card-grid";
import WalletSection from "@/game/Sections/wallet";
import SettingsSection from "@/game/Sections/settings";
import NoblesSection from "@/game/Sections/nobles";
import ReservationsSection from "@/game/Sections/reservations";
import DevelopmentsSection from "@/game/Sections/developments";
import { useGameStore } from "./Store/game-store";
import { DoActionType } from "@/hooks/use-websocket";

export default function GameInterface({ doAction }: { doAction: DoActionType }) {
    const [focusedCard, setFocusedCard] = useState<number | null>(null)
    const { gameState } = useGameStore()

    return (
      <>
        <div
          className="flex h-full w-full overflow-hidden bg-background p-4"
        >
          {/* Left sidebar - Players */}
          <div
            className="flex-shrink-0 mr-6 flex flex-col h-full"
            onMouseDown={() => setFocusedCard(null)}
          >
            {/* Top section */}
            <div className="flex flex-col h-full space-y-5">
              <BankSection doAction={doAction} />
              <div className="flex-grow">
                <PlayersList />
              </div>
            </div>
          </div>
  
          {/* Main content */}
          <div className="flex-1 flex-shrink-0 flex flex-col h-full">
  
            <div className="flex-grow no-select">
              <CardGrid focusedCard={focusedCard} setFocusedCard={setFocusedCard} doAction={doAction} />
            </div>
  
            {/* Anchored at the bottom */}
            <div
              className="mt-auto w-full flex flex-row gap-2 "
              onMouseDown={() => setFocusedCard(null)}
            >
              <WalletSection />
              <SettingsSection />
            </div>
  
          </div>
  
          {/* Right sidebar */}
          <div
            className="flex-shrink-0 ml-6 flex flex-col h-full space-y-5 overflow-hidden"
            onMouseDown={() => setFocusedCard(null)}
          >
            <NoblesSection />
            <ReservationsSection doAction={doAction} />
            <div className="flex-1 overflow-hidden">
              <DevelopmentsSection />
            </div>
          </div>
  
        </div>
      </>
    );
  }