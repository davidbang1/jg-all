import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBoard } from "./boardSlice"
import {
  clearStatus,
  removeReserved,
  payJewels,
  addCard,
  checkWin,
  setCurrPlayer,
} from "./playerOneSlice"
import { clearStatus2, addCard2, payJewels2, checkWin2 } from "./playerTwoSlice"
import { Modal, Box, Button } from "@mui/material"
import { toast } from "react-toastify"
import { Card } from "../game/Card"
import { socket } from "../../app/hooks/socket"
import { addToBag } from "./bagSlice"
import { setStatus } from "./cardsSlice"

export function PlayerOne(props) {
  const dispatch = useDispatch()
  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const playerPoints = useSelector((state) => state.playerOne.points)
  const playerTotalPoints = useSelector((state) => state.playerOne.totalPoints)
  const playerCrowns = useSelector((state) => state.playerOne.crowns)
  const playerPermaJewels = useSelector((state) => state.playerOne.permaJewels)
  const playerScrolls = useSelector((state) => state.playerOne.scrolls)
  const [bText, setBText] = useState("Use Scroll")
  const [RCOpen, setRCOpen] = useState(false)
  const [reduceOpen, setReduceOpen] = useState(false)
  const reservedCards = useSelector((state) => state.playerOne.reservedCards)
  const startingInfo = useSelector((state) => state.home.info)
  const playerStatus = useSelector((state) => state.playerOne.status)
  const [pot, setPot] = useState([])
  const cardsStatus = useSelector((state) => state.cards.status2)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)

  const tempJewels = Object.entries(playerJewels)
  const [whatIHave, setWhatIHave] = useState(
    JSON.parse(JSON.stringify(tempJewels)),
  )

  useEffect(() => {
    setWhatIHave(JSON.parse(JSON.stringify(tempJewels)))
  }, [playerJewels])
  const count = whatIHave.reduce((a, b) => a + b[1], 0) - 10

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

  socket.off("remove-extra2")
  socket.on("remove-extra2", (x) => {
    dispatch(addToBag(x.pot))
    dispatch(payJewels(x.pot))
    toast.success("paid jewels")
  })

  function handleClose() {
    dispatch(clearStatus())
    dispatch(clearStatus2())
    setRCOpen(false)
  }
  function reduceHandleClose() {
    //shouldn't be able to close
    setReduceOpen(false)
  }

  useEffect(() => {
    if (playerStatus === "reduce") {
      toast.info("remove thing")
      setReduceOpen(true)
    }
  }, [playerStatus])

  useEffect(() => {
    if (cardsStatus[3] === 1) {
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
    setRCOpen(true)
  }
  useEffect(() => {
    //reset button text after successful use of scroll
    setBText("Use Scroll")
  }, [playerScrolls])

  function removeCard(i) {
    dispatch(removeReserved(i))
    socket.emit("remove-reserved", { index: i })
    setRCOpen(false)
  }
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
    //add to bag, remove from player
    if (count <= 0) {
      dispatch(addToBag(pot))
      dispatch(payJewels(pot))
      for (let i = 0; i < pot.length; i++) {
        tempJewels[pot[i]] -= 1
      }
      socket.emit("remove-extra", { pot: pot })
      setPot([])
      setReduceOpen(false)
      dispatch(clearStatus())
    } else {
      toast.error("need to remove jewels")
    }
  }

  function handleClick() {
    //cancel scroll use
    if (playerScrolls > 0) {
      if (bText === "Use Scroll") {
        props.setAction("scroll")
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
      {tempJewels.map((jewel, id) => (
        <div key={id}>{jewel}</div>
      ))}
      <Modal
        open={RCOpen}
        onClose={handleClose}
        aria-labelledby="reserved-cards-modal"
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
                    fromPlayer={1}
                    handleClose={handleClose}
                  />
                )
              })
            : "No Reserved Cards"}
        </Box>
      </Modal>
      <Modal
        open={reduceOpen}
        onClose={reduceHandleClose}
        aria-labelledby="extra-jewels-modal"
      >
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
