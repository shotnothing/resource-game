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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <a href="http://localhost:5173/testRoom/testUser1">Test User 1</a>
        <a href="http://localhost:5173/testRoom/testUser2">Test User 2</a>
        <a href="http://localhost:5173/testRoom/testUser3">Test User 3</a>
        <a href="http://localhost:5173/testRoom/testUser4">Test User 4</a>
      </div>
    </>
  )
}

export default App
