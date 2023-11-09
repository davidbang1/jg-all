import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { JewelsModal } from "../game/JewelsModal"
//import royalData from "../data/royalsData.json"
import {
  addScroll,
  takeScroll,
  setCurrPlayer,
  addRoyal,
  removeRoyal,
  checkWin,
} from "./playerOneSlice"
import { checkWin2, addScroll2, takeScroll2, addRoyal2 } from "./playerTwoSlice"
import { takeScrollZone } from "./scrollSlice"
import { socket } from "../../app/hooks/socket"

export function Royals() {
  const dispatch = useDispatch()
  const royalData = useSelector((state) => state.playerOne.royals)
  const p1Royals = useSelector((state) => state.playerOne.getRoyal)
  const p2Royals = useSelector((state) => state.playerTwo.getRoyal2)
  // const p1gotFirst = useSelector((state) => state.playerOne.gotFirst)
  // const p2gotFirst = useSelector((state) => state.playerTwo.gotFirst2)
  // const p1gotSecond = useSelector((state) => state.playerOne.gotSecond)
  // const p2gotSecond = useSelector((state) => state.playerTwo.gotSecond2)

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
    dispatch(checkWin(startingInfo[0]))
    dispatch(checkWin2(startingInfo[0]))
    toast.success("Go again!")
    socket.emit("again-royal")
  }
  console.log("royals")

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
      // setJMJewels(temp)
      setJMJewels(() => temp)
      setOpen(() => !open)
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
  socket.off("remove-royal2")
  socket.on("remove-royal2", (x) => {
    if (startingInfo[0] === 2) {
      dispatch(addRoyal({ points: x.points, royal: x.royal }))
    } else {
      dispatch(addRoyal2({ points: x.points, royal: x.royal }))
    }
    dispatch(removeRoyal(x.royal))
  })

  function addHelper(p, r) {
    socket.emit("remove-royal", { points: p, royal: r })
    if (startingInfo[0] === 1) {
      dispatch(addRoyal({ points: p, royal: r }))
    } else {
      dispatch(addRoyal2({ points: p, royal: r }))
    }
    dispatch(removeRoyal(royalAction))
  }

  useEffect(() => {
    if (royalAction === "steal") {
      stealAction()
      // addHelper(2, "steal")
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

  return (
    <div>
      Royals
      <br />
      {royalData}
      {/* <button onClick={openModal}>Royals test</button> */}
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
