import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import { Button, Modal, Box } from "@mui/material"
import { clearStatus } from "./playerOneSlice"
import { clearStatus2 } from "./playerTwoSlice"

export function PlayerTwo(props) {
  const dispatch = useDispatch()
  const playerJewels = useSelector((state) => state.playerTwo.jewels)
  const playerPoints = useSelector((state) => state.playerTwo.points)
  const playerCrowns = useSelector((state) => state.playerTwo.crowns)
  const playerPermaJewels = useSelector((state) => state.playerTwo.permaJewels)
  const playerScrolls = useSelector((state) => state.playerTwo.scrolls)
  const reservedCards = useSelector((state) => state.playerTwo.reservedCards)

  const [bText, setBText] = useState("Use Scroll")
  const [open, setOpen] = useState(false)

  function handleClose() {
    dispatch(clearStatus())
    dispatch(clearStatus2())
    setOpen(false)
  }
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

  return (
    <div>
      <button onClick={handleClick}>{bText}</button>
      <br />
      Player Two
      <br />
      Points:
      {myPoints.map((point, id) => (
        // <div onClick={() => handleClick()} key={id} name={jewel}>
        <div key={id}>{point}</div>
      ))}
      <br />
      Crowns: {playerCrowns}
      <br />
      Scrolls: {playerScrolls}
      <br /> <button onClick={viewCards}>View Reserved Cards</button>
      <br />
      <b>Permanent Jewels:</b>
      {myPerms.map((jewel, id) => (
        // <div onClick={() => handleClick()} key={id} name={jewel}>
        <div key={id}>{jewel}</div>
      ))}
      <b>Jewels:</b>
      {myJewels.map((jewel, id) => (
        // <div onClick={() => handleClick()} key={id} name={jewel}>
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
