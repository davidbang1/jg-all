import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getScrolls } from "./scrollSlice"
import { socket } from "../../app/hooks/socket"
import { toast } from "react-toastify"
import { addScroll, takeScroll } from "./playerOneSlice"
import { addScroll2, takeScroll2 } from "./playerTwoSlice"
import { takeScrollZone } from "./scrollSlice"
export function Scrolls() {
  const count = useSelector(getScrolls)
  const dispatch = useDispatch()
  socket.off("scroll-card2")
  socket.on("scroll-card2", (x) => {
    switch (x.take) {
      case 0:
        dispatch(takeScrollZone())
        break
      case 1:
        dispatch(takeScroll())
        break
      case 2:
        dispatch(takeScroll2())
        break
      default:
    }
    switch (x.give) {
      case 1:
        dispatch(addScroll())
        break
      case 2:
        dispatch(addScroll2())
        break
      default:
    }
    if (x.tell) {
      toast.info("opponent took 3 of a kind or 2 pearls so you get a scroll")
    }
  })

  return <div>Scrolls {count}</div>
}
