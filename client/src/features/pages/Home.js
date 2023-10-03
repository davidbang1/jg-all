import { useState, useEffect } from "react"
import {
  createRoom,
  titleTest,
  getRoom,
  joinRoom,
} from "../../app/redux/actions"
import { useSelector, useDispatch } from "react-redux"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import cardData from "../data/cardData.json"
import { setBag } from "../game/bagSlice"
import { setDecks } from "../game/cardsSlice"

export function Home(props) {
  const navigate = useNavigate()

  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")
  const [testData, setTestData] = useState("Backend Not Connected")
  const dispatch = useDispatch()

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }
    return array
  }

  const boardData = useSelector((state) => state.bag.bag)

  function sendCode() {
    let arrayForSort = [...boardData]
    const threeCost = shuffle(cardData[0]["3"])
    const twoCost = shuffle(cardData[1]["2"])
    const oneCost = shuffle(cardData[2]["1"])
    shuffle(arrayForSort)
    const roomId = uuidv4()
    props.setRoomUUID(roomId)
    navigate("/" + roomId)
    //set board and three decks
    dispatch(
      createRoom(
        roomId,
        "fromfrontend2222",
        input,
        arrayForSort,
        threeCost,
        twoCost,
        oneCost,
      ),
    )
    //set to here
    dispatch(setBag(arrayForSort))
    dispatch(setDecks([threeCost, twoCost, oneCost]))
  }
  function enterCode() {
    dispatch(joinRoom("joinimngfromfrontend2222", input2)).then((res) => {
      props.setRoomUUID(res.name)
      //set board and three decks here
      dispatch(setBag(res.board))
      dispatch(setDecks([res.threeDeck, res.twoDeck, res.oneDeck]))
      navigate("/" + res.name)
    })
  }
  function test() {
    dispatch(getRoom()).then((response) => {
      navigate("/" + response)
    })
    //connect to api
    //navigate("/jewelgame")
  }
  useEffect(() => {
    //set player 1 id
    uuidv4()
    dispatch(titleTest()).then((response) => {
      setTestData(response)
    })
  }, [])
  return (
    <div style={{ padding: "20%" }}>
      {testData}
      <br />
      <input
        id="send"
        value={input}
        onInput={(e) => setInput(e.target.value)}
      />
      <button aria-label="Decrement value" onClick={() => sendCode()}>
        Create Room and this is the password
      </button>
      <br />
      <input
        id="send"
        value={input2}
        onInput={(e) => setInput2(e.target.value)}
      />
      <button aria-label="Decrement value" onClick={() => enterCode()}>
        Join Room and this is the password
      </button>
      <button aria-label="Decrement value" onClick={() => test()}>
        Test button
      </button>
    </div>
  )
}
