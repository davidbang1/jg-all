import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
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
import { socket } from "../../app/hooks/socket"
import { removeRoyal, setRoom, setCurrPlayer } from "../game/playerOneSlice"
import { toast } from "react-toastify"
import { Button, Modal, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"

export function JewelDuel(props) {
  const dispatch = useDispatch()

  const [peerId, setPeerId] = useState()
  const [remotePeer, setRemotePeer] = useState()
  const idData = useSelector((state) => state.playerOne.playerId)
  const roomId = useSelector((state) => state.playerOne.roomId)
  const idData2 = useSelector((state) => state.playerTwo.playerId)
  const startingInfo = useSelector((state) => state.home.info)
  const p1Status = useSelector((state) => state.playerOne.status)
  const p2Status = useSelector((state) => state.playerTwo.status)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => {
    socket.emit("join-room", props.roomId, startingInfo[1], startingInfo[0])
    //TODO: store roomid in store, then use in emits with .to(roomid)
    dispatch(setRoom(props.roomId))
    if (startingInfo[0] === 1) {
      setPeerId(startingInfo[1])
    }
  }, [])

  socket.off("user-connected")
  socket.on("user-connected", (id, callback) => {
    setRemotePeer(id)
  })
  function handleClose() {
    console.log("")
  }
  function buttonClick() {
    navigate("/")
    window.location.reload()
  }
  function skipTurn() {
    dispatch(setCurrPlayer())
  }
  useEffect(() => {
    if (p1Status === "win" || p2Status === "win") {
      setOpen(true)
      setMessage("You WIN!")
    } else if (p1Status === "lose" || p2Status === "lose") {
      setOpen(true)
      setMessage("You lose :(")
    }
  }, [p1Status, p2Status])

  return (
    <div className="App">
      <header className="App-header">
        Jewel Duel! It's Player {props.currPlayer}'s turn
      </header>
      <div>
        <Grid container>
          <Grid item xs={4}>
            <PlayerOne action={props.action} setAction={props.setAction} />
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
            <button onClick={() => skipTurn()}>skip two</button>
          </Grid>
          <Grid item xs={4}>
            <Cards
              action={props.action}
              setAction={props.setAction}
              currPlayer={props.currPlayer}
            />
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleClose}>
          <Box className="modalStyle">
            {message}
            <Button onClick={() => buttonClick()}>Exit</Button>
          </Box>
        </Modal>
      </div>
    </div>
  )
}
