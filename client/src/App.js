import React, { useState } from "react"
import { useSelector } from "react-redux"
import "./App.css"
import { Home } from "./features/pages/Home"
import { JewelDuel } from "./features/pages/JewelDuel"

function App() {
  const [action, setAction] = useState("")
  const [access, setAccess] = useState(true)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const status = useSelector((state) => state.home.status)
  return (
    <>
      {status ? (
        <JewelDuel
          action={action}
          setAction={setAction}
          currPlayer={currPlayer}
        />
      ) : (
        <div>
          <Home access={access} setAccess={setAccess} />
        </div>
      )}
    </>
  )
}

export default App
