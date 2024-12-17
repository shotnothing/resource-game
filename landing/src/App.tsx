import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'

import './App.css'
import Landing from './views/landing'
import Lobby from './views/lobby'
import Error404Page from "./views/404"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
