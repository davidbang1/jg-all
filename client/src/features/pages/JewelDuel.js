import React, { useState, useEffect } from "react"
import { Grid } from "@mui/material"
import { Bag } from "../game/Bag"
import { Board } from "../game/Board"
import "../../App.css"
import { PlayerOne } from "../game/PlayerOne"
import { PlayerTwo } from "../game/PlayerTwo"
import { Cards } from "../game/Cards"
import { Scrolls } from "../game/Scrolls"
import { Royals } from "../game/Royals"
import useScript from "../../app/hooks/useScript" //delete useScript
import { useSelector } from "react-redux"
import { socket } from "../../app/hooks/socket"

export function JewelDuel(props) {
  const [peerId, setPeerId] = useState()
  const [remotePeer, setRemotePeer] = useState()
  const idData = useSelector((state) => state.playerOne.playerId)
  const idData2 = useSelector((state) => state.playerTwo.playerId)
  const startingInfo = useSelector((state) => state.home.info)

  useEffect(() => {
    console.log(startingInfo)
    //props.roomId
    socket.emit("join-room", props.roomId, startingInfo[1], startingInfo[0])
    if (startingInfo[0] === 1) {
      setPeerId(startingInfo[1])
    }
  }, [])

  socket.on("user-connected", (id, callback) => {
    setRemotePeer(id)
  })

  return (
    <div className="App">
      <header className="App-header">
        Jewel Duel! It's Player {props.currPlayer}'s turn
      </header>
      <div>
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
            <hr />
            {peerId} is player 1 <br />
            {remotePeer} is player 2 <br />
            You are Player {startingInfo[0]}
            <br />
          </Grid>
          <Grid item xs={4}>
            <Cards
              action={props.action}
              setAction={props.setAction}
              currPlayer={props.currPlayer}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
