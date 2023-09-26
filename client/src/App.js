import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { useSelector } from "react-redux"
import "./App.css"
import { Home } from "./features/pages/Home"
import { JewelDuel } from "./features/pages/JewelDuel"
import { PeerPage } from "./features/pages/PeerPage"

function App() {
  const [action, setAction] = useState("")
  const [access, setAccess] = useState(true)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const status = useSelector((state) => state.home.status)
  const [roomUUID, setRoomUUID] = useState(
    "123-2344-123134-34234-1231323123-34343",
  )
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home access={access} setAccess={setAccess} />} />
        <Route
          path="/hello"
          element={<PeerPage access={access} setAccess={setAccess} />}
        />
        <Route
          path={roomUUID}
          element={
            <JewelDuel
              action={action}
              setAction={setAction}
              currPlayer={currPlayer}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
