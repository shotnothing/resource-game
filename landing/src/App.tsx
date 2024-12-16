import { useEffect } from 'react'
import { useWebSocket } from './hooks/use-websocket'
import './App.css'

function App() {
  const {
    createRoom,
    joinRoom,
    beginGame,
    viewRoom,
    getCardsAndCollections,
    doAction,
    debugWebSocketStatus
  } = useWebSocket()

  return (
    <>
      <button onClick={() => {
        createRoom('testRoom', 'testUser1')
        joinRoom('testRoom', 'testUser2')
        joinRoom('testRoom', 'testUser3')
        joinRoom('testRoom', 'testUser4')
        beginGame('testRoom')
      }}>Initiate Game</button>
    </>
  )
}

export default App
