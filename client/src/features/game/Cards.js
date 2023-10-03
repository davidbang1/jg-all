import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import data from "../data/cardData.json"
import { Card } from "../game/Card"
import { setCardList, setGoldNum, startReserve } from "./cardsSlice"
import { getJewel, setCurrPlayer } from "./playerOneSlice.js"
import { getJewel2, checkWin } from "./playerTwoSlice.js"
import { showBoard, setBoard, clearBoard } from "./boardSlice"
import { socket } from "../../app/hooks/socket"

export function Cards(props) {
  const [count3, setCount3] = useState(13)
  const [count2, setCount2] = useState(24)
  const [count1, setCount1] = useState(0)
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
  const threeCost = [...threeCostTemp]
  const twoCost = [...twoCostTemp]
  const oneCost = [...oneCostTemp]

  const cardStatus = useSelector((state) => state.cards.status)
  const cardsStore = useSelector((state) => state.cards.cardList)
  // const currPlayer = useSelector((state) => state.playerOne.currPlayer)

  console.log("its player " + props.currPlayer)
  const dispatch = useDispatch()

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

  function addToPlayer(index) {
    removeCard(index)
    //add option for top of deck button

    //todo: currplayer isn't switching
    if (props.currPlayer === 1) {
      dispatch(getJewel(["gold"]))
    } else {
      dispatch(getJewel2(["gold"]))
    }
    dispatch(setCurrPlayer())
    dispatch(checkWin())
    dispatch(clearBoard("gold"))
    dispatch(startReserve(false))
  }

  function getCard(deck, index) {
    let info = deck?.pop()
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
