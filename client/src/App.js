import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch } from "react-redux"

import { useSelector } from "react-redux"
import "./App.css"
import { Home } from "./features/pages/Home"
import { JewelDuel } from "./features/pages/JewelDuel"
import { PeerPage } from "./features/pages/PeerPage"
import { getAllRooms } from "./app/redux/actions"
import routes, { renderRoutes } from "./routes"
function App() {
  const [action, setAction] = useState("")
  const [access, setAccess] = useState(true)
  const [rooms, setRooms] = useState([])
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const status = useSelector((state) => state.home.status)
  const [roomUUID, setRoomUUID] = useState("jewelgame")

  const dispatch = useDispatch()

  useEffect(() => {
    //get room ids an map to routes
    //not used
    dispatch(getAllRooms()).then((res) => {
      setRooms(res)
      console.log(res)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Home
              access={access}
              setAccess={setAccess}
              roomUUID={roomUUID}
              setRoomUUID={setRoomUUID}
            />
          }
        />
        <Route
          path="/hello"
          element={<PeerPage access={access} setAccess={setAccess} />}
        />
        {/* {renderRoutes(routes)} */}
        <Route
          exact
          path={roomUUID}
          element={
            <JewelDuel
              roomId={roomUUID}
              action={action}
              setAction={setAction}
              currPlayer={currPlayer}
            />
          }
        />
        <Route
          path="/24358228-98e0-4b7b-b9fe-7ae3c6209aee"
          element={
            <JewelDuel
              roomId="/24358228-98e0-4b7b-b9fe-7ae3c6209aee"
              action={action}
              setAction={setAction}
              currPlayer={currPlayer}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
