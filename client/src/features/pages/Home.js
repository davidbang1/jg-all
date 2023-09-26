import { useState, useEffect } from "react"
import { testBackend, titleTest } from "../../app/redux/actions"
import { useDispatch } from "react-redux"

export function Home() {
  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")
  const [testData, setTestData] = useState("Backend Not Connected")
  const dispatch = useDispatch()

  function sendCode() {
    dispatch(testBackend(input))
  }
  function enterCode() {}
  function test() {
    //connect to api
  }
  useEffect(() => {
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
