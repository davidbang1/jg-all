import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import data from "../data/royalsData.json"

export function Royals() {
  let test = data[0].image
  let test2 = data[1].image
  let test3 = data[2].image
  let test4 = data[3].image
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
    </div>
  )
}
