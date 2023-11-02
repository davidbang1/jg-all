import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import { Button, Modal, Box } from "@mui/material"
import {
  clearStatus,
  payJewels,
  addCard,
  checkWin,
  setCurrPlayer,
} from "./playerOneSlice"
import {
  clearStatus2,
  addCard2,
  payJewels2,
  checkWin2,
  removeReserved2,
} from "./playerTwoSlice"
import { Card } from "../game/Card"
import { addToBag } from "./bagSlice"
import { socket } from "../../app/hooks/socket"
import { toast } from "react-toastify"
import { setStatus } from "./cardsSlice"

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
  const playerStatus = useSelector((state) => state.playerTwo.status)
  const [pot, setPot] = useState([])
  const [reduceOpen, setReduceOpen] = useState(false)
  const cardsStatus = useSelector((state) => state.cards.status2)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)

  const [bText, setBText] = useState("Use Scroll")
  const [open, setOpen] = useState(false)

  const tempJewels = Object.entries(playerJewels)
  const [whatIHave, setWhatIHave] = useState(
    JSON.parse(JSON.stringify(tempJewels)),
  )

  useEffect(() => {
    setWhatIHave(JSON.parse(JSON.stringify(tempJewels)))
  }, [playerJewels])
  const count = whatIHave.reduce((a, b) => a + b[1], 0) - 10

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

  socket.off("remove-extra2")
  socket.on("remove-extra2", (x) => {
    dispatch(addToBag(x.pot))
    dispatch(payJewels2(x.pot))
    toast.success("paid jewels")
  })

  function reduceHandleClose() {
    //shouldn't be able to close
    // setReduceOpen(false)
  }

  useEffect(() => {
    if (playerStatus === "reduce") {
      toast.info("remove thing")
      setReduceOpen(true)
    }
  }, [playerStatus])
  function addJewel(item) {
    if (item[1] > 0 && count > 0) {
      const tempHave = JSON.parse(JSON.stringify(whatIHave))
      for (let j = 0; j < tempHave.length; j++) {
        if (tempHave[j][0] === item[0]) {
          tempHave[j][1] -= 1
        }
      }
      let tempCart = pot
      tempCart.push(item[0])
      setWhatIHave(tempHave)
      setPot(tempCart)
    }
  }

  function removeExtras() {
    //dispatch add to bag. remove from player
    if (count <= 0) {
      dispatch(addToBag(pot))
      dispatch(payJewels2(pot))
      for (let i = 0; i < pot.length; i++) {
        tempJewels[pot[i]] -= 1
      }
      //emit
      socket.emit("remove-extra", { pot: pot })
      //clear pot
      setPot([])
      setReduceOpen(false)
      dispatch(clearStatus2())
    } else {
      toast.error("need to remove jewels")
    }
  }
  useEffect(() => {
    //reset button text after successful use of scroll
    setBText("Use Scroll")
  }, [playerScrolls])

  useEffect(() => {
    if (cardsStatus[3] === 2) {
      dispatch(addToBag(cardsStatus[2]))
      if (currPlayer === 1) {
        dispatch(payJewels(cardsStatus[2]))
        dispatch(addCard(reservedCards[0]))
      } else {
        dispatch(payJewels2(cardsStatus[2]))
        dispatch(addCard2(reservedCards[0]))
      }
      dispatch(setCurrPlayer())
      dispatch(checkWin(startingInfo[0]))
      dispatch(checkWin2(startingInfo[0]))
      removeCard()
      socket.emit("buy-card", {
        cart: cardsStatus[2],
        props: reservedCards[0],
        index: props.index,
        reserved: true,
      })
      dispatch(setStatus([]))
    }
  }, [cardsStatus])

  function viewCards() {
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
                    fromPlayer={2}
                    handleClose={handleClose}
                  />
                )
              })
            : "No Reserved Cards"}
        </Box>
      </Modal>
      <Modal open={reduceOpen} onClose={reduceHandleClose}>
        <Box className="modalStyle">
          your temp jewels, click on some until less than equal to 10, and add
          those to bag, cannot move forward until done so Still need to remove
          {count}
          {whatIHave.map((jewel, id) => (
            <div onClick={() => addJewel(jewel)} key={id}>
              {jewel}
            </div>
          ))}
          Removing:
          {pot.map((item, index) => {
            // TODO: improve look, not all in a vertical line
            return item
          })}
          <Button onClick={() => removeExtras()}>Remove these</Button>
        </Box>
      </Modal>
    </div>
  )
}
