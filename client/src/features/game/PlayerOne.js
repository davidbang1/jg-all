import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import { clearStatus, removeReserved, setCurrPlayer } from "./playerOneSlice"
import { clearStatus2 } from "./playerTwoSlice"
import { Button, Modal, Box } from "@mui/material"
import { toast } from "react-toastify"
import { Card } from "../game/Card"
import { socket } from "../../app/hooks/socket"

export function PlayerOne(props) {
  const dispatch = useDispatch()
  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const playerPoints = useSelector((state) => state.playerOne.points)
  const playerTotalPoints = useSelector((state) => state.playerOne.totalPoints)
  const playerCrowns = useSelector((state) => state.playerOne.crowns)
  const playerPermaJewels = useSelector((state) => state.playerOne.permaJewels)
  const playerScrolls = useSelector((state) => state.playerOne.scrolls)
  const [bText, setBText] = useState("Use Scroll")
  const [open, setOpen] = useState(false)
  const winC = useSelector((state) => state.playerOne.status)
  const winC2 = useSelector((state) => state.playerTwo.status)
  const reservedCards = useSelector((state) => state.playerOne.reservedCards)
  const startingInfo = useSelector((state) => state.home.info)

  const [myCards, setMyCards] = useState(reservedCards)

  function handleOpen() {
    setOpen(true)
  }

  useEffect(() => {
    if (startingInfo[0] === 2) {
      document.getElementById("scroll-button1").disabled = true
      document.getElementById("reserved-cards1").disabled = true
    }
  }, [])

  socket.off("remove-reserved2")
  socket.on("remove-reserved2", (x) => {
    dispatch(removeReserved(x.index))
  })

  function handleClose() {
    dispatch(clearStatus())
    dispatch(clearStatus2())
    setOpen(false)
  }
  console.log("playerone")
  function viewCards() {
    setOpen(true)
  }
  useEffect(() => {
    //reset button text after successful use of scroll
    setBText("Use Scroll")
  }, [playerScrolls])

  function removeCard(i) {
    dispatch(removeReserved(i))
    socket.emit("remove-reserved", { index: i })
    setOpen(false)
  }

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
      Total: {playerTotalPoints}
      <br />
      Crowns: {playerCrowns}
      <br />
      Scrolls: {playerScrolls}
      <br />
      <button id="reserved-cards1" onClick={viewCards}>
        View Reserved Cards {reservedCards.length}
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
        <Box className="modalStyle">
          {reservedCards.length > 0
            ? reservedCards.map((item, index) => {
                return (
                  <Card
                    index={index}
                    color={item.color}
                    points={item.points}
                    crowns={item.crowns}
                    quantity={item.quantity}
                    special={item.special}
                    requirements={item.requirements}
                    removeCard={() => removeCard(index)}
                    action={props.action}
                    setAction={props.setAction}
                    reserved={true}
                    //addToPlayer={addToPlayer}
                  />
                )
              })
            : "No Reserved Cards"}
        </Box>
      </Modal>
    </div>
  )
}
