import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import "./card.css"
import "../index.css"
import { JewelsModal } from "./JewelsModal"
import { Paper, Button, Modal, Box, Grid } from "@mui/material"
import {
  addCard,
  payJewels,
  setCurrPlayer,
  reserveCards,
  addScroll,
  takeScroll,
} from "./playerOneSlice"
import {
  addCard2,
  payJewels2,
  checkWin,
  reserveCards2,
  addScroll2,
  takeScroll2,
} from "./playerTwoSlice"
import { addToBag } from "./bagSlice"
import { takeScrollZone } from "./scrollSlice"
import { setGem } from "./cardsSlice"
import { toast } from "react-toastify"
import crown from "../assets/crown.png"
import crown2 from "../assets/crown2.jpeg"
import crown3 from "../assets/crown3.jpeg"
import { socket } from "../../app/hooks/socket"
import Popover from "@mui/material/Popover"

export function Card(props) {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [popOpen, setPopOpen] = useState(false)
  const [jOpen, setJOpen] = useState(false)
  const [jmAction, setJMAction] = useState()
  const [jmJewels, setJMJewels] = useState()
  const [afterPerm, setAfterPerm] = useState([])
  const [cart, setCart] = useState([])
  const playerPermaJewels = useSelector((state) => state.playerOne.permaJewels)
  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const p1Scrolls = useSelector((state) => state.playerOne.scrolls)
  const startingInfo = useSelector((state) => state.home.info)
  const playerPermaJewels2 = useSelector((state) => state.playerTwo.permaJewels)
  const playerJewels2 = useSelector((state) => state.playerTwo.jewels)
  const p2Scrolls = useSelector((state) => state.playerTwo.scrolls)
  const cardStatus = useSelector((state) => state.card.status)
  const scrollZone = useSelector((state) => state.scrolls.scrolls)
  const bs = useSelector((state) => state.board.grid)
  const gemGrabbed = useSelector((state) => state.cards.gem)
  const cardsStatus = useSelector((state) => state.cards.status2)
  const [anchorEl, setAnchorEl] = useState(null)

  const tempJewels = Object.entries(
    startingInfo[0] === 1 ? playerJewels : playerJewels2,
  )
  const [whatIHave, setWhatIHave] = useState(
    JSON.parse(JSON.stringify(tempJewels)),
  )

  useEffect(() => {
    setWhatIHave(JSON.parse(JSON.stringify(tempJewels)))
  }, [playerJewels, playerJewels2])

  useEffect(() => {
    if (cardsStatus[1] === props.index) {
      dispatch(addToBag(cardsStatus[2]))
      if (currPlayer === 1) {
        dispatch(payJewels(cardsStatus[2]))
        dispatch(addCard(props))
      } else {
        dispatch(payJewels2(cardsStatus[2]))
        dispatch(addCard2(props))
      }
      dispatch(setCurrPlayer())
      dispatch(checkWin())
      props.removeCard()
      socket.emit("buy-card", {
        cart: cardsStatus[2],
        props: props,
        index: props.index,
        reserved: props.reserved,
      })
    }
  }, [cardsStatus])

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

  const handlePopClose = () => {
    setAnchorEl(null)
    setPopOpen(false)
  }
  function handleJClose() {
    setCart([])
    setJOpen(false)
  }
  const reqs = Object.entries(props.requirements)

  console.log("card gold")

  function addToCart(e, item) {
    if (item[0] === "gold" && item[1] > 0) {
      //open popover
      setPopOpen(true)
      setAnchorEl(e.currentTarget)
    } else if (item[1] > 0) {
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
      toast.error("Insufficient funds")
    }
  }

  function buyWithGold(item) {
    if (item[1] > 0) {
      for (let i = 0; i < afterPerm.length; i++) {
        if (afterPerm[i][0] === item[0] && afterPerm[i][1] > 0) {
          const temp = JSON.parse(JSON.stringify(afterPerm))
          const tempHave = JSON.parse(JSON.stringify(whatIHave))
          temp[i][1] -= 1
          tempHave[tempHave.length - 1][1] -= 1
          let tempCart = cart
          tempCart.push("gold")
          setWhatIHave(tempHave)
          setAfterPerm(temp)
          setCart(tempCart)
        }
      }
    } else {
      toast.error("Insufficient funds")
    }
  }

  function handleClick(e) {
    //for reserving a card and gold
    if (cardStatus) {
      let info = {
        color: props.color,
        points: props.points,
        crowns: props.crowns,
        quantity: props.quantity,
        special: props.special,
        requirements: props.requirements,
      }
      if (currPlayer === 1) {
        props.addToPlayer(props.index, 1)
        dispatch(reserveCards(info))
        socket.emit("reserve-card", {
          index: props.index,
          info: info,
          playerNum: 1,
        })
      } else {
        props.addToPlayer(props.index, 2)
        dispatch(reserveCards2(info))
        socket.emit("reserve-card", {
          index: props.index,
          info: info,
          playerNum: 2,
        })
      }
    }
  }

  function regularCardAction() {
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
      reserved: props.reserved,
    })
  }

  function wildAction() {
    setJMAction("colorless")
    const temp = []
    if (currPlayer === 1) {
      for (const x in playerPermaJewels) {
        if (playerPermaJewels[x] > 0) {
          temp.push(x)
        }
      }
    } else {
      for (const x in playerPermaJewels2) {
        if (playerPermaJewels2[x] > 0) {
          temp.push(x)
        }
      }
    }
    if (temp.length > 0) {
      setJMJewels(temp)
      setJOpen(true)
    } else {
      toast.error("you need a color to buy colorless")
    }
  }
  function stealAction() {
    setJMAction("steal")
    const temp = []
    if (currPlayer === 2) {
      for (const x in playerJewels) {
        if (playerJewels[x] > 0) {
          temp.push(x)
        }
      }
    } else {
      for (const x in playerJewels2) {
        if (playerJewels2[x] > 0) {
          temp.push(x)
        }
      }
    }
    if (temp.length > 0) {
      setJMJewels(temp)
      setJOpen(true)
    } else {
      toast.error("Opponent has nothing you can steal")
    }
  }

  function scrollAction() {
    if (currPlayer === 1) {
      if (scrollZone > 0) {
        dispatch(takeScrollZone())
        dispatch(addScroll())
        socket.emit("scroll-card", { take: 0, give: 1 })
      } else if (p2Scrolls > 0) {
        dispatch(takeScroll2())
        dispatch(addScroll())
        socket.emit("scroll-card", { take: 2, give: 1 })
      } else {
        toast.error("Cannot take any scrolls")
      }
    } else {
      if (scrollZone > 0) {
        dispatch(takeScrollZone())
        dispatch(addScroll2())
        socket.emit("scroll-card", { take: 0, give: 2 })
      } else if (p2Scrolls > 0) {
        dispatch(takeScroll())
        dispatch(addScroll2())
        socket.emit("scroll-card", { take: 1, give: 2 })
      } else {
        toast.error("Cannot take any scrolls")
      }
    }
  }

  function goAgain() {
    dispatch(addToBag(cart))
    if (currPlayer === 1) {
      dispatch(payJewels(cart))
      dispatch(addCard(props))
    } else {
      dispatch(payJewels2(cart))
      dispatch(addCard2(props))
    }
    dispatch(checkWin())
    //works for p2??

    props.removeCard()
    toast.success("you get to go again!")
    socket.emit("skip-turn", {
      cart: cart,
      props: props,
      index: props.index,
      reserved: props.reserved,
    })
  }

  function buyCard() {
    if (currPlayer === startingInfo[0]) {
      let check = true
      for (let i = 0; i < afterPerm.length; i++) {
        if (afterPerm[i][1] > 0) {
          //TODO bug negative
          check = false
        }
      }
      if (check) {
        if (props.special === "wild" || props.color === "wild") {
          wildAction()
        } else if (props.special === "steal") {
          stealAction()
          regularCardAction()
        } else if (props.special === "scroll") {
          scrollAction()
          regularCardAction()
        } else if (props.special === "gem") {
          if (bs.includes(props.color)) {
            props.setAction("gem")
            dispatch(setGem([props.color, props.index, cart]))
            toast.info("Pick a " + props.color + " gem from the board")
          } else {
            toast.info("Gem cannot be used right now")
            regularCardAction()
          }
        } else if (props.special === "again") {
          goAgain()
        } else {
          regularCardAction()
        }
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
  const goldOpts = [
    ["white", 1],
    ["blue", 1],
    ["green", 1],
    ["red", 1],
    ["black", 1],
    ["pearl", 1],
  ]
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
      <JewelsModal
        open={jOpen}
        handleClose={handleJClose}
        jewels={jmJewels}
        action={jmAction}
        extra={props}
        cost={cart}
        removeCard={props.removeCard}
        index={props.index}
      />
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
                onClick={(e) => addToCart(e, item)}
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
      <Popover
        id={"id"}
        open={popOpen}
        anchorEl={anchorEl}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        Use Gold as:
        {goldOpts.map((item, index) => {
          return (
            <div
              className={item[0]}
              key={index}
              onClick={() => buyWithGold(item)}
            >
              {item[1]}
            </div>
          )
        })}
      </Popover>
    </div>
  )
}
