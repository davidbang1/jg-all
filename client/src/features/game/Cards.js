import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card } from "../game/Card"
import {
  setCardList,
  startReserve,
  setDeck3,
  setDeck2,
  setDeck1,
} from "./cardsSlice"
import { clearBoard } from "./boardSlice"
import { socket } from "../../app/hooks/socket"
import {
  addCard,
  payJewels,
  setCurrPlayer,
  reserveCards,
  getJewel,
} from "./playerOneSlice"
import {
  addCard2,
  payJewels2,
  checkWin,
  reserveCards2,
  getJewel2,
} from "./playerTwoSlice"
import { addToBag } from "./bagSlice"
import { toast } from "react-toastify"

export function Cards(props) {
  const dispatch = useDispatch()
  const [card1, setCard1] = useState(0)
  const [card2, setCard2] = useState(0)
  const [card3, setCard3] = useState(0)
  const [card4, setCard4] = useState(0)
  const [card5, setCard5] = useState(0)
  const [card6, setCard6] = useState(0)
  const [card7, setCard7] = useState(0)
  const [card8, setCard8] = useState(0)
  const [card9, setCard9] = useState(0)

  const threeCostTemp = useSelector((state) => state.cards.threeDeck)
  const twoCostTemp = useSelector((state) => state.cards.twoDeck)
  const oneCostTemp = useSelector((state) => state.cards.oneDeck)
  const [threeCost] = useState(JSON.parse(JSON.stringify(threeCostTemp)))
  const [twoCost] = useState(JSON.parse(JSON.stringify(twoCostTemp)))
  const [oneCost] = useState(JSON.parse(JSON.stringify(oneCostTemp)))

  const cardStatus = useSelector((state) => state.cards.status)
  const cardsStore = useSelector((state) => state.cards.cardList)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const startingInfo = useSelector((state) => state.home.info)

  socket.off("skip-turn2")
  socket.on("skip-turn2", (x) => {
    dispatch(addToBag(x.cart))
    if (currPlayer === 1) {
      dispatch(payJewels(x.cart))
      dispatch(addCard(x.props))
    } else {
      dispatch(payJewels2(x.cart))
      dispatch(addCard2(x.props))
    }
    dispatch(checkWin())
    toast.info("opponent goes again")
    //remove card and set new decks
    if (!x.reserved) {
      removeCard(x.index)
    }
  })
  socket.off("again-royal2")
  socket.on("again-royal2", (x) => {
    dispatch(setCurrPlayer())
    toast.info("opponent goes again")
  })
  socket.off("buy-card2")
  socket.on("buy-card2", (x) => {
    dispatch(addToBag(x.cart))
    if (currPlayer === 1) {
      dispatch(payJewels(x.cart))
      dispatch(addCard(x.props))
    } else {
      dispatch(payJewels2(x.cart))
      dispatch(addCard2(x.props))
    }
    dispatch(setCurrPlayer())
    dispatch(checkWin())
    //remove card and set new decks
    if (!x.reserved) {
      removeCard(x.index)
    }
  })

  socket.off("reserve-card2")
  socket.on("reserve-card2", (x) => {
    if (x.deck === 3) {
      dispatch(setDeck3(threeCost.splice(-1)))
    } else if (x.deck === 2) {
      dispatch(setDeck2(twoCost.splice(-1)))
    } else {
      dispatch(setDeck1(oneCost.splice(-1)))
    }
    addToPlayer(x.index, x.playerNum)
    if (x.playerNum === 1) {
      dispatch(reserveCards(x.info))
    } else {
      dispatch(reserveCards2(x.info))
    }
  })

  const cardList = [
    card1,
    card2,
    card3,
    card4,
    card5,
    card6,
    card7,
    card8,
    card9,
  ]

  function removeCard(index) {
    switch (index) {
      case 1:
        setCard1(getCard(threeCost, 1))
        break
      case 2:
        setCard2(getCard(threeCost, 2))
        break
      case 3:
        setCard3(getCard(threeCost, 3))
        break
      case 4:
        setCard4(getCard(twoCost, 4))
        break
      case 5:
        setCard5(getCard(twoCost, 5))
        break
      case 6:
        setCard6(getCard(twoCost, 6))
        break
      case 7:
        setCard7(getCard(oneCost, 7))
        break
      case 8:
        setCard8(getCard(oneCost, 8))
        break
      default:
        setCard9(getCard(oneCost, 9))
    }
  }

  function addToPlayer(index, playerNum) {
    //add player
    if (index >= 0) {
      removeCard(index)
    }
    //add option for top of deck button
    if (playerNum === 1) {
      dispatch(getJewel(["gold"]))
    } else if (playerNum === 2) {
      dispatch(getJewel2(["gold"]))
    }
    dispatch(setCurrPlayer())
    dispatch(checkWin())
    dispatch(clearBoard("gold"))
    dispatch(startReserve(false))
  }

  function getCard(deck, index) {
    let info = deck[deck.length - 1]
    if (index < 4) {
      dispatch(setDeck3(threeCost.splice(-1)))
    } else if (index < 7) {
      dispatch(setDeck2(twoCost.splice(-1)))
    } else {
      dispatch(setDeck1(oneCost.splice(-1)))
    }
    if (info) {
      let thisCard = (
        <Card
          index={index}
          color={info.color}
          points={info.points}
          crowns={info.crowns}
          quantity={info.quantity}
          special={info.special}
          requirements={info.requirements}
          removeCard={() => removeCard(index)}
          action={props.action}
          setAction={props.setAction}
          addToPlayer={addToPlayer}
        />
      )
      dispatch(setCardList(thisCard))
      return thisCard
    } else return null
  }

  useEffect(() => {
    setCard1(getCard(threeCost, 1))
    setCard2(getCard(threeCost, 2))
    setCard3(getCard(threeCost, 3))
    setCard4(getCard(twoCost, 4))
    setCard5(getCard(twoCost, 5))
    setCard6(getCard(twoCost, 6))
    setCard7(getCard(oneCost, 7))
    setCard8(getCard(oneCost, 8))
    setCard9(getCard(oneCost, 9))
  }, [])

  useEffect(() => {
    if (cardStatus) {
      document.getElementById("button1").disabled = false
      document.getElementById("button2").disabled = false
      document.getElementById("button3").disabled = false
    } else {
      document.getElementById("button1").disabled = true
      document.getElementById("button2").disabled = true
      document.getElementById("button3").disabled = true
    }
  }, [cardStatus])

  function handleClick3() {
    if (cardStatus) {
      let card = threeCost[threeCost.length - 1]
      dispatch(setDeck3(threeCost.splice(-1)))
      let info = {
        color: card.color,
        points: card.points,
        crowns: card.crowns,
        quantity: card.quantity,
        special: card.special,
        requirements: card.requirements,
      }
      if (currPlayer === 1) {
        addToPlayer(-1, 1)
        dispatch(reserveCards(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 1,
          deck: 3,
        })
      } else {
        addToPlayer(-1, 2)
        dispatch(reserveCards2(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 2,
          deck: 3,
        })
      }
    }
  }

  function handleClick2() {
    if (cardStatus) {
      let card = twoCost[twoCost.length - 1]
      dispatch(setDeck3(twoCost.splice(-1)))
      let info = {
        color: card.color,
        points: card.points,
        crowns: card.crowns,
        quantity: card.quantity,
        special: card.special,
        requirements: card.requirements,
      }
      if (currPlayer === 1) {
        addToPlayer(-1, 1)
        dispatch(reserveCards(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 1,
          deck: 2,
        })
      } else {
        addToPlayer(-1, 2)
        dispatch(reserveCards2(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 2,
          deck: 2,
        })
      }
    }
  }
  function handleClick1() {
    if (cardStatus) {
      let card = oneCost[oneCost.length - 1]
      dispatch(setDeck1(oneCost.splice(-1)))
      let info = {
        color: card.color,
        points: card.points,
        crowns: card.crowns,
        quantity: card.quantity,
        special: card.special,
        requirements: card.requirements,
      }
      if (currPlayer === 1) {
        addToPlayer(-1, 1)
        dispatch(reserveCards(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 1,
          deck: 1,
        })
      } else {
        addToPlayer(-1, 2)
        dispatch(reserveCards2(info))
        socket.emit("reserve-card", {
          index: -1,
          info: info,
          playerNum: 2,
          deck: 1,
        })
      }
    }
  }
  return (
    <div>
      <button id="button1" onClick={() => handleClick3()}>
        reserve top
      </button>
      Tier Three: {threeCost.length} remaining
      <div className="cardBox">
        {card1}
        {card2}
        {card3}
      </div>
      <div>
        <button id="button2" onClick={() => handleClick2()}>
          reserve top
        </button>
        Tier Two: {twoCost.length} remaining
        {card4}
        {card5}
        {card6}
      </div>
      <div>
        <button id="button3" onClick={() => handleClick1()}>
          reserve top
        </button>
        Tier One: {oneCost.length} remaining
        {card7}
        {card8}
        {card9}
      </div>
    </div>
  )
}
