import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import { Button, Modal, Box } from "@mui/material"
import { clearStatus } from "./playerOneSlice"
import { clearStatus2, removeReserved2 } from "./playerTwoSlice"
import { Card } from "../game/Card"

export function PlayerTwo(props) {
  const dispatch = useDispatch()
  const playerJewels = useSelector((state) => state.playerTwo.jewels)
  const playerPoints = useSelector((state) => state.playerTwo.points)
  const playerTotalPoints = useSelector((state) => state.playerTwo.totalPoints)
  const playerCrowns = useSelector((state) => state.playerTwo.crowns)
  const playerPermaJewels = useSelector((state) => state.playerTwo.permaJewels)
  const playerScrolls = useSelector((state) => state.playerTwo.scrolls)
  const reservedCards = useSelector((state) => state.playerTwo.reservedCards)
  const startingInfo = useSelector((state) => state.home.info)

  const [bText, setBText] = useState("Use Scroll")
  const [open, setOpen] = useState(false)

  function handleClose() {
    dispatch(clearStatus())
    dispatch(clearStatus2())
    setOpen(false)
  }

  useEffect(() => {
    if (startingInfo[0] === 1) {
      document.getElementById("scroll-button2").disabled = true
      document.getElementById("reserved-cards2").disabled = true
    }
  }, [])
  console.log("playerTwo")

  useEffect(() => {
    //reset button text after successful use of scroll
    setBText("Use Scroll")
  }, [playerScrolls])
  function viewCards() {
    console.log("asdf")
    setOpen(true)
  }
  function handleClick() {
    //cancel scroll use
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
  }

  const myJewels = Object.entries(playerJewels)
  const myPerms = Object.entries(playerPermaJewels)
  const myPoints = Object.entries(playerPoints)

  function removeCard(i) {
    dispatch(removeReserved2(i))
    //socket.emit("remove-reserved", { index: i })
    setOpen(false)
  }

  return (
    <div>
      <button id="scroll-button2" onClick={handleClick}>
        {bText}
      </button>
      <br />
      Player Two
      <br />
      Points:
      {myPoints.map((point, id) => (
        // <div onClick={() => handleClick()} key={id} name={jewel}>
        <div key={id}>{point}</div>
      ))}
      Total: {playerTotalPoints}
      <br />
      Crowns: {playerCrowns}
      <br />
      Scrolls: {playerScrolls}
      <br />
      <button id="reserved-cards2" onClick={viewCards}>
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
          {reservedCards
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
