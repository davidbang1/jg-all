import { useState, useEffect } from "react"
import { socket } from "../../app/hooks/socket"
import { useSelector } from "react-redux"

export function PeerPage() {
  const [peerId, setPeerId] = useState()
  const [remotePeer, setRemotePeer] = useState()
  const [num, setNum] = useState(0)
  const peer = useSelector((state) => state.playerOne.peerInfo)

  socket.on("user-connected", (id, callback) => {
    setRemotePeer(id)
  })

  socket.on("increment", (id) => {
    setNum(id)
  })

  useEffect(() => {
    peer.on("open", (id) => {
      setPeerId(id)
      socket.emit("join-room", 10, id)
    })
  }, [])

  function increment() {
    socket.emit("hello", num, (response) => {
      setNum(response)
    })
  }

  return (
    <div style={{ padding: "20%" }}>
      Peer page
      <br />
      {peerId} is connected <br />
      {remotePeer ? remotePeer + "is connected" : "cant find partner"}
      <br />
      {num}
      <br />
      <button onClick={increment}>button</button>
    </div>
  )
}
