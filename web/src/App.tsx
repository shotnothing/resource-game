import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Room from '@/game/Components/room'
import { useGameStore } from '@/game/Store/game-store'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:roomName/:yourName" element={<Room />} />
        <Route path="/:roomName/*" element={<div>User not provided</div>} />
        <Route path="*" element={<div>URL Format Not Understood</div>} />
      </Routes>
    </Router>
  )
}

export default App
