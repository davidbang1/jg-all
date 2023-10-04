import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import { clearStatus } from "./playerOneSlice"
import { clearStatus2 } from "./playerTwoSlice"
import { Button, Modal, Box } from "@mui/material"
import { toast } from "react-toastify"

export function PlayerOne(props) {
  const dispatch = useDispatch()
  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const playerPoints = useSelector((state) => state.playerOne.points)
  const playerCrowns = useSelector((state) => state.playerOne.crowns)
  const playerPermaJewels = useSelector((state) => state.playerOne.permaJewels)
  const playerScrolls = useSelector((state) => state.playerOne.scrolls)
  const [bText, setBText] = useState("Use Scroll")
  const [open, setOpen] = useState(false)
  const winC = useSelector((state) => state.playerOne.status)
  const winC2 = useSelector((state) => state.playerTwo.status)
  const reservedCards = useSelector((state) => state.playerOne.reservedCards)
  const startingInfo = useSelector((state) => state.home.info)

  function handleOpen() {
    setOpen(true)
  }

  useEffect(() => {
    if (startingInfo[0] === 2) {
      document.getElementById("scroll-button1").disabled = true
      document.getElementById("reserved-cards1").disabled = true
    }
  }, [])

  function handleClose() {
    dispatch(clearStatus())
    dispatch(clearStatus2())
    setOpen(false)
  }
  console.log("playerone")
  function viewCards() {
    console.log("asdf")
    setOpen(true)
  }
  useEffect(() => {
    //reset button text after successful use of scroll
    setBText("Use Scroll")
  }, [playerScrolls])

  function handleClick() {
    //cancel scroll use
    if (playerScrolls > 0) {
      if (bText === "Use Scroll") {
        //enter scroll using state
        props.setAction("scroll")
        //clear board highlights
        dispatch(clearBoard("clean"))
        setBText("Cancel Scroll")
      } else {
        props.setAction("")
        setBText("Use Scroll")
      }
    } else {
      toast.error("insufficient scrolls")
    }
  }

  const myJewels = Object.entries(playerJewels)
  const myPerms = Object.entries(playerPermaJewels)
  const myPoints = Object.entries(playerPoints)

  return (
    <div>
      <button id="scroll-button1" onClick={handleClick}>
        {bText}
      </button>
      <br />
      Player One
      <br />
      Points:
      {myPoints.map((point, id) => (
        <div key={id}>{point}</div>
      ))}
      <br />
      Crowns: {playerCrowns}
      <br />
      Scrolls: {playerScrolls}
      <br />
      <button id="reserved-cards1" onClick={viewCards}>
        View Reserved Cards
      </button>
      <br />
      <b>Permanent Jewels:</b>
      {myPerms.map((jewel, id) => (
        <div key={id}>{jewel}</div>
      ))}
      <b>Jewels:</b>
      {myJewels.map((jewel, id) => (
        <div key={id}>{jewel}</div>
      ))}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalStyle">{reservedCards}</Box>
      </Modal>
    </div>
  )
}
