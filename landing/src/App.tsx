import { Toaster } from "@/components/ui/toaster"

import './App.css'
import Landing from './views/landing'
import Lobby from './views/lobby'

function App() {
  return (
    <>
      <Lobby />
      <Toaster />
    </>
  )
}

export default App
