import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import data from "../data/royalsData.json"
import { toast } from "react-toastify"
import { JewelsModal } from "../game/JewelsModal"
//import royalData from "../data/royalsData.json"
import {
  addScroll,
  takeScroll,
  setCurrPlayer,
  addRoyal,
} from "./playerOneSlice"
import { checkWin, addScroll2, takeScroll2, addRoyal2 } from "./playerTwoSlice"
import { takeScrollZone } from "./scrollSlice"
import { socket } from "../../app/hooks/socket"

export function Royals() {
  const dispatch = useDispatch()

  let test = data[0].image
  let test2 = data[1].image
  let test3 = data[2].image
  let test4 = data[3].image
  const royalData = useSelector((state) => state.playerOne.royals)
  const p1Royals = useSelector((state) => state.playerOne.getRoyal)
  const p2Royals = useSelector((state) => state.playerTwo.getRoyal2)
  const p1gotFirst = useSelector((state) => state.playerOne.gotFirst)
  const p2gotFirst = useSelector((state) => state.playerTwo.gotFirst2)
  const p1gotSecond = useSelector((state) => state.playerOne.gotSecond)
  const p2gotSecond = useSelector((state) => state.playerTwo.gotSecond2)

  const royalAction = useSelector((state) => state.royal.royalAction)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const p1Scrolls = useSelector((state) => state.playerOne.scrolls)
  const p2Scrolls = useSelector((state) => state.playerTwo.scrolls)
  const scrollZone = useSelector((state) => state.scrolls.scrolls)
  const startingInfo = useSelector((state) => state.home.info)

  const playerJewels = useSelector((state) => state.playerOne.jewels)
  const playerJewels2 = useSelector((state) => state.playerTwo.jewels)
  const [open, setOpen] = useState(false)
  const [jmAction, setJMAction] = useState()
  const [jmJewels, setJMJewels] = useState(royalData)

  function goAgain() {
    dispatch(checkWin())
    toast.success("Go again!")
    socket.emit("again-royal")
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
      setOpen(true)
    } else {
      toast.success(
        "Achievement: Kick 'em while they're down: You tried to steal when they had nothing",
      )
    }
  }

  function scrollAction() {
    if (startingInfo[0] === 1) {
      if (scrollZone > 0) {
        dispatch(takeScrollZone())
        dispatch(addScroll())
        socket.emit("scroll-card", { take: 0, give: 1 })
      } else if (p2Scrolls > 0) {
        dispatch(takeScroll2())
        dispatch(addScroll())
        socket.emit("scroll-card", { take: 2, give: 1 })
      } else {
        toast.success("Achievement: Book worm You have all the scrolls")
      }
    } else {
      if (scrollZone > 0) {
        dispatch(takeScrollZone())
        dispatch(addScroll2())
        socket.emit("scroll-card", { take: 0, give: 2 })
      } else if (p1Scrolls > 0) {
        dispatch(takeScroll())
        dispatch(addScroll2())
        socket.emit("scroll-card", { take: 1, give: 2 })
      } else {
        toast.success("Achievement: Book worm You have all the scrolls")
      }
    }
  }

  function addHelper(p, r) {
    if (startingInfo[0] === 1) {
      dispatch(addRoyal({ points: p, royal: r }))
    } else {
      dispatch(addRoyal2({ points: p, royal: r }))
    }
  }

  useEffect(() => {
    if (royalAction === "steal") {
      stealAction()
      addHelper(2, "steal")
    } else if (royalAction === "again") {
      dispatch(setCurrPlayer())
      goAgain()
      addHelper(2, "again")
      setOpen(false)
    } else if (royalAction === "scroll") {
      scrollAction()
      addHelper(2, "scroll")
      setOpen(false)
    } else if (royalAction === "none") {
      setOpen(false)
      addHelper(3, "none")
    }
  }, [royalAction])

  function openModal() {
    setOpen(true)
    setJMJewels(royalData)
    setJMAction("royals")
  }

  function handleClose() {
    setOpen(false)
  }

  useEffect(() => {
    //when points are earned
    if (p1Royals !== "" && 1 === startingInfo[0]) {
      toast.success("royals timeeeee")
      setOpen(true)
      setJMJewels(royalData)
      setJMAction("royals")
    }
  }, [p1Royals])

  useEffect(() => {
    if (p2Royals !== "" && 2 === startingInfo[0]) {
      toast.success("royals 222 timeeeee")
      setOpen(true)
      setJMJewels(royalData)
      setJMAction("royals")
    }
  }, [p2Royals])
  console.log("royals")
  let arrRoyals = ["1", "2", "3", "4"]

  //show whats there, not test
  return (
    <div>
      Royals
      <br />
      {test}
      <br />
      {test2}
      <br />
      {test3}
      <br />
      {test4}
      <button onClick={openModal}>Royals test</button>
      <JewelsModal
        open={open}
        handleClose={handleClose}
        jewels={jmJewels}
        action={jmAction}
        // extra={props}
        // cost={cart}
        // removeCard={props.removeCard}
        // index={props.index}
      />
    </div>
  )
}
