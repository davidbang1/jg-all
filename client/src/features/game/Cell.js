import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { takeScroll } from "./playerOneSlice"
import { takeScroll2 } from "./playerTwoSlice"
import { addScroll } from "./scrollSlice"
import { startReserve } from "./cardsSlice"
import "../index.css"

function Cell(props) {
  const dispatch = useDispatch()
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const cardStatus = useSelector((state) => state.card.status)
  const goldNum = useSelector((state) => state.cards.goldNum)

  function withinLine(pot, newNum) {
    //math to check pot is in a line
    if (pot.length === 0) {
      return true
    } else if (pot.length === 1) {
      if (
        Math.abs(pot[0] - newNum) === 1 ||
        Math.abs(pot[0] - newNum) === 4 ||
        Math.abs(pot[0] - newNum) === 5 ||
        Math.abs(pot[0] - newNum) === 6
      ) {
        return true
      }
    } else if (pot.length === 2) {
      if (
        (Math.abs(pot[0] - newNum) === 1 && Math.abs(pot[1] - newNum) === 2) ||
        (Math.abs(pot[1] - newNum) === 1 && Math.abs(pot[0] - newNum) === 2) ||
        (Math.abs(pot[0] - newNum) === 4 && Math.abs(pot[1] - newNum) === 8) ||
        (Math.abs(pot[1] - newNum) === 4 && Math.abs(pot[0] - newNum) === 8) ||
        (Math.abs(pot[0] - newNum) === 5 && Math.abs(pot[1] - newNum) === 10) ||
        (Math.abs(pot[1] - newNum) === 5 && Math.abs(pot[0] - newNum) === 10) ||
        (Math.abs(pot[0] - newNum) === 6 && Math.abs(pot[1] - newNum) === 12) ||
        (Math.abs(pot[1] - newNum) === 6 && Math.abs(pot[0] - newNum) === 12)
      ) {
        return true
      }
    } else {
      return false
    }
  }

  function handleClick(pot) {
    //TODO Fix clicking between gold and pink
    //scroll action
    if (props.action === "scroll") {
      if (props.jewel && props.jewel !== "gold") {
        if (currPlayer === 1) {
          dispatch(props.getJewel([props.jewel]))
          dispatch(takeScroll())
        } else {
          dispatch(props.getJewel2([props.jewel]))
          dispatch(takeScroll2())
        }
        props.removeThis([props.number])
        props.setAction("")
        //give scroll to zone
        dispatch(addScroll())
      }
    } else {
      if (props.jewel === "gold") {
        if (cardStatus) {
          document.getElementById(props.number).style.backgroundColor = "white"
          dispatch(startReserve(false))
          pot.splice(0, 1)
        } else {
          document.getElementById(props.number).style.backgroundColor = "gold"
          // props.setAction("reserve")
          dispatch(startReserve(true))
          pot.push(props.number)
        }
        //once reserved, reset the gold click
      }
      //adds to pot if within line
      if (props.jewel && props.jewel !== "gold" && props.action === "") {
        if (pot.includes(props.number)) {
          const index = pot.indexOf(props.number)
          if (index > -1) {
            pot.splice(index, 1)
          }
          document.getElementById(props.number).style.backgroundColor = "white"
        } else if (pot.length < 3 && withinLine(pot, props.number)) {
          pot.push(props.number)
          document.getElementById(props.number).style.backgroundColor = "pink"
        } else {
          return false
        }
      }
    }
  }

  return (
    <td
      id={props.number}
      className="cell"
      key={props.number}
      onClick={() => handleClick(props.pot)}
    >
      <div className={props.jewel}></div>
    </td>
  )
}

export default Cell
