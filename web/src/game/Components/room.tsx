import { useWebSocket } from '@/hooks/use-websocket'
import GameInterface from '@/game/game-interface'

export default function Room() {
  const { doAction } = useWebSocket()

  return <GameInterface doAction={doAction} /> 
}




