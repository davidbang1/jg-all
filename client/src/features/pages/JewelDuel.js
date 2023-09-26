import React from "react"
import { Grid } from "@mui/material"
import { Bag } from "../game/Bag"
import { Board } from "../game/Board"
import "../../App.css"
import { PlayerOne } from "../game/PlayerOne"
import { PlayerTwo } from "../game/PlayerTwo"
import { Cards } from "../game/Cards"
import { Scrolls } from "../game/Scrolls"
import { Royals } from "../game/Royals"
import useScript from "../../app/hooks/useScript"

export function JewelDuel(props) {
  useScript("https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js")
  useScript("/socket.io/socket.io.js")
  // create new peer in here

  return (
    <div className="App">
      <header className="App-header">
        Jewel Duel! It's Player {props.currPlayer}'s turn
      </header>
      <body>
        <Grid container>
          <Grid item xs={2}>
            <PlayerOne action={props.action} setAction={props.setAction} />
          </Grid>
          <Grid item xs={2}>
            <PlayerTwo action={props.action} setAction={props.setAction} />
          </Grid>
          <Grid item xs={4}>
            <Bag />
            <Board action={props.action} setAction={props.setAction} />
            <Scrolls />
            <Royals />
          </Grid>
          <Grid item xs={4}>
            <Cards
              action={props.action}
              setAction={props.setAction}
              currPlayer={props.currPlayer}
            />
          </Grid>
        </Grid>
      </body>
    </div>
  )
}
