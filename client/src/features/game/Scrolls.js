import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getScrolls } from "./scrollSlice"

export function Scrolls() {
  const count = useSelector(getScrolls)

  return <div>Scrolls {count}</div>
}
