import { useState, useEffect } from "react"
import {
  createRoom,
  titleTest,
  getRoom,
  joinRoom,
} from "../../app/redux/actions"
import { useDispatch } from "react-redux"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

export function Home(props) {
  const navigate = useNavigate()

  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")
  const [testData, setTestData] = useState("Backend Not Connected")
  const dispatch = useDispatch()

  function sendCode() {
    const roomId = uuidv4()
    props.setRoomUUID(roomId)
    navigate("/" + roomId)
    dispatch(createRoom(roomId, "fromfrontend2222", input))
  }
  function enterCode() {
    dispatch(joinRoom("joinimngfromfrontend2222", input2)).then((res) => {
      props.setRoomUUID(res.name)
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
