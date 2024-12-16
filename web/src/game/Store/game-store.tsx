import { create } from 'zustand'
import { GameState, Player, Noble } from '@/game/types'

import defaultGameState from '@/resources/temp.json'
const defaultCurrentPlayerName = "Alice";
const defaultYourName = "Alice"
const defaultRoomName = "testRoom"

export const useGameStore = create<{
  gameState: GameState
  setGameState: (gameState: GameState) => void

  yourName: string
  setYourName: (yourName: string) => void

  roomName: string
  setRoomName: (roomName: string) => void
}>((set) => ({
    gameState: defaultGameState,
    setGameState: (newState: GameState) => set({ gameState: newState }),

    yourName: defaultYourName,
    setYourName: (yourName: string) => set({ yourName }),

    roomName: defaultRoomName,
    setRoomName: (roomName: string) => set({ roomName }),
}))
