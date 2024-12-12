import { create } from 'zustand'
import { GameState, Player, Noble } from '@/game/types'

import defaultGameState from '@/temp.json'
const currentPlayerName = Object.keys(defaultGameState.game.players)[0] as keyof typeof defaultGameState.game.players
const currentPlayer = { name: currentPlayerName, ...defaultGameState.game.players[currentPlayerName] }
const yourName = "Alice"

export const useGameStore = create<{
  gameState: GameState
  setGameState: (gameState: GameState) => void

  currentPlayer: Player
  setCurrentPlayer: (currentPlayer: Player) => void

  yourName: string
  setYourName: (yourName: string) => void
}>((set) => ({
    gameState: defaultGameState,
    setGameState: (gameState: GameState) => set({ gameState }),

    currentPlayer: currentPlayer,
    setCurrentPlayer: (currentPlayer: Player) => set({ currentPlayer }),

    yourName: yourName,
    setYourName: (yourName: string) => set({ yourName }),
}))
