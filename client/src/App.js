import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Grid } from "@mui/material"
import { Counter } from "./features/counter/Counter"
import { Bag } from "./features/game/Bag"
import { Board } from "./features/game/Board"
import "./App.css"
import { PlayerOne } from "./features/game/PlayerOne"
import { PlayerTwo } from "./features/game/PlayerTwo"
import { Cards } from "./features/game/Cards"
import { Scrolls } from "./features/game/Scrolls"
import { Royals } from "./features/game/Royals"
import { Home } from "./features/newGame/Home"

function App() {
  const [action, setAction] = useState("")
  const [access, setAccess] = useState(true)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const status = useSelector((state) => state.home.status)
  return (
    <>
      {status ? (
        <div className="App">
          <header className="App-header">
            Jewel Duel! It's Player {currPlayer}'s turn
          </header>
          <body>
            <Grid container>
              <Grid item xs={2}>
                <PlayerOne action={action} setAction={setAction} />
              </Grid>
              <Grid item xs={2}>
                <PlayerTwo action={action} setAction={setAction} />
              </Grid>
              <Grid item xs={4}>
                <Bag />
                <Board action={action} setAction={setAction} />
                <Scrolls />
                <Royals />
              </Grid>
              <Grid item xs={4}>
                <Cards
                  action={action}
                  setAction={setAction}
                  currPlayer={currPlayer}
                />
              </Grid>
            </Grid>
          </body>
        </div>
      ) : (
        <div>
          <Home access={access} setAccess={setAccess} />
        </div>
      )}
    </>
  )
}

export default App
