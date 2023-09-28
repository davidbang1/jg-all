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
  // create new peer in here
  // const peer = useSelector((state) => state.playerOne.peerInfo)
  // const peer = new Peer()
  useEffect(() => {
    // peer.on("open", (id) => {
    //   setPeerId(id)
    socket.emit("join-room", 10, 10000)
    // })
  }, [])
  socket.on("user-connected", (id, callback) => {
    setRemotePeer(id)
  })
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
            <br />
            {peerId} is connected <br />
            {remotePeer ? remotePeer + "is connected" : "cant find partner"}
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
      </body>
    </div>
  )
}
