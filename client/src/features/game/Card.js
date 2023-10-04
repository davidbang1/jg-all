import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import "./card.css"
import "../index.css"
import { Paper, Button, Modal, Box, Grid } from "@mui/material"
import {
  addCard,
  payJewels,
  setCurrPlayer,
  reserveCards,
} from "./playerOneSlice"
import { addCard2, payJewels2, checkWin, reserveCards2 } from "./playerTwoSlice"
import { addToBag } from "./bagSlice"
import { toast } from "react-toastify"
import crown from "../assets/crown.png"
import crown2 from "../assets/crown2.jpeg"
import crown3 from "../assets/crown3.jpeg"
import { socket } from "../../app/hooks/socket"

export function Card(props) {
  const [open, setOpen] = useState(false)
  const [afterPerm, setAfterPerm] = useState([])
  const [cart, setCart] = useState([])
  const playerPermaJewels = useSelector((state) => state.playerOne.permaJewels)
  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const startingInfo = useSelector((state) => state.home.info)

  const playerPermaJewels2 = useSelector((state) => state.playerTwo.permaJewels)
  const playerJewels2 = useSelector((state) => state.playerTwo.jewels)
  const cardStatus = useSelector((state) => state.card.status)
  const tempJewels = Object.entries(
    startingInfo[0] === 1 ? playerJewels : playerJewels2,
  )
  const [whatIHave, setWhatIHave] = useState(
    JSON.parse(JSON.stringify(tempJewels)),
  )

  useEffect(() => {
    setWhatIHave(JSON.parse(JSON.stringify(tempJewels)))
  }, [playerJewels, playerJewels2])
  const dispatch = useDispatch()

  function handleOpen() {
    setOpen(true)
    let temp
    startingInfo[0] === 1
      ? (temp = playerPermaJewels)
      : (temp = playerPermaJewels2)
    let afterP = Object.keys(props.requirements).reduce((a, k) => {
      a[k] = props.requirements[k] - temp[k]
      return a < 0 ? 0 : a
    }, {})
    setAfterPerm(Object.entries(afterP))
  }

  function handleClose() {
    setWhatIHave(JSON.parse(JSON.stringify(tempJewels)))
    setCart([])
    setOpen(false)
  }

  const reqs = Object.entries(props.requirements)

  function addToCart(item) {
    if (item[1] > 0) {
      for (let i = 0; i < afterPerm.length; i++) {
        if (afterPerm[i][0] === item[0] && afterPerm[i][1] > 0) {
          const temp = JSON.parse(JSON.stringify(afterPerm))
          const tempHave = JSON.parse(JSON.stringify(whatIHave))
          temp[i][1] -= 1
          for (let j = 0; j < tempHave.length; j++) {
            //find color in temphave and reduce by 1
            if (tempHave[j][0] === item[0]) {
              tempHave[j][1] -= 1
            }
          }
          let tempCart = cart
          tempCart.push(item[0])
          setWhatIHave(tempHave)
          setAfterPerm(temp)
          setCart(tempCart)
        }
      }
    } else {
      toast.error("Insufficient funs")
    }
    //gold is wild
  }

  function handleClick(e) {
    //for reserving a card
    if (cardStatus) {
      props.addToPlayer(props.index)
      let info = [
        props.color,
        props.points,
        props.crowns,
        props.quantity,
        props.special,
        reqs,
      ]
      if (currPlayer === 1) {
        dispatch(reserveCards(info))
      } else {
        dispatch(reserveCards2(info))
      }
      socket.emit("reserve-card", { index: props.index, info: info })
    }
  }

  function buyCard() {
    if (currPlayer === startingInfo[0]) {
      let check = true
      for (let i = 0; i < afterPerm.length; i++) {
        if (afterPerm[i][1] !== 0) {
          check = false
        }
      }
      if (check) {
        dispatch(addToBag(cart))
        if (currPlayer === 1) {
          dispatch(payJewels(cart))
          dispatch(addCard(props))
        } else {
          dispatch(payJewels2(cart))
          dispatch(addCard2(props))
        }
        dispatch(setCurrPlayer())
        dispatch(checkWin())

        props.removeCard()

        socket.emit("buy-card", {
          cart: cart,
          props: props,
          index: props.index,
        })
      }
      setCart([])
      setOpen(false)
    } else {
      toast.error("not your turn")
    }
  }

  function myCrown() {
    if (props.crowns === 1) {
      return <img src={crown} className="crown" alt="crown" />
    } else if (props.crowns === 2) {
      return <img src={crown2} className="crown" alt="crown" />
    } else if (props.crowns === 3) {
      return <img src={crown3} className="crown" alt="crown" />
    } else {
      return ""
    }
  }

  return (
    <div className="card" onClick={(e) => handleClick(e)}>
      <Grid container spacing={1} className="cardLayout">
        <Grid item xs={4}>
          <Paper>P: {props.points}</Paper>
        </Grid>
        <Grid item xs={4}>
          {myCrown()}
        </Grid>
        <Grid item xs={4}>
          <Paper>
            {props.quantity} {props.color}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className="reqWrapper">
            Reqs:
            {reqs.map((item, index) => {
              return (
                <div key={index} className={item[0]}>
                  {item[1]}
                </div>
              )
            })}
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper>S: {props.special}</Paper>
          <Button onClick={handleOpen}>BUY</Button>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalStyle">
          This card costs:
          {reqs.map((item, index) => {
            return (
              <div key={index} className={item[0]}>
                {item[1]}
              </div>
            )
          })}
          <br />
          After permaJewels, You still need:
          {afterPerm.map((item, index) => {
            return (
              <div key={index} className={item[0]}>
                {item[1]}
              </div>
            )
          })}
          <br />
          You have:
          {whatIHave.map((item, index) => {
            return (
              <div
                className={item[0]}
                key={index}
                onClick={() => addToCart(item)}
              >
                {item[1]}
              </div>
            )
          })}
          <br />
          You will pay:
          {cart.map((item, index) => {
            // TODO: improve look, not all in a vertical line
            // return <div key={index} className={item}></div>
            return item
          })}
          <br />
          <Button onClick={() => buyCard()}>BUY</Button>
        </Box>
      </Modal>
    </div>
  )
}
