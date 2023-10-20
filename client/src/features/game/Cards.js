import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card } from "../game/Card"
import {
  setCardList,
  setDecks,
  setGoldNum,
  startReserve,
  setDeck3,
  setDeck2,
  setDeck1,
} from "./cardsSlice"
import { showBoard, setBoard, clearBoard } from "./boardSlice"
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
  const [count3, setCount3] = useState(13)
  const [count2, setCount2] = useState(24)
  const [count1, setCount1] = useState(30)
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
    //add x.playernum
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
    removeCard(index)
    //add option for top of deck button

    //todo: currplayer isn't switching
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

  return (
    <div>
      Cards Tier Three {count3}
      <button>reserve</button>
      <div className="cardBox">
        {card1}
        {card2}
        {card3}
      </div>
      <div>
        <button>reserve</button>
        Tier Two
        {card4}
        {card5}
        {card6}
      </div>
      <div>
        <button>reserve</button>
        Tier One
        {card7}
        {card8}
        {card9}
      </div>
    </div>
  )
}
