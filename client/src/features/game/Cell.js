import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { takeScroll } from "./playerOneSlice"
import { takeScroll2 } from "./playerTwoSlice"
import { addScrollZone } from "./scrollSlice"
import { startReserve } from "./cardsSlice"
import { toast } from "react-toastify"
import { socket } from "../../app/hooks/socket"
import "../index.css"
import "./board.css"

function Cell(props) {
  const dispatch = useDispatch()
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const cardStatus = useSelector((state) => state.card.status)
  const goldNum = useSelector((state) => state.cards.goldNum)
  const startingInfo = useSelector((state) => state.home.info)
  const currGem = useSelector((state) => state.cards.gem)

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
    if (currPlayer === startingInfo[0]) {
      if (props.action === "gem") {
        if (currGem[0] === props.jewel) {
          toast.success("Added to jewels")
          props.giveGem(props.jewel, props.number, currGem)
          props.setAction("")
        } else {
          toast.error("Needs to be " + currGem[0])
        }
      }
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
          dispatch(addScrollZone())
          socket.emit("use-scroll", {
            jewel: props.jewel,
            number: props.number,
          })
        } else if (props.jewel && props.jewel === "gold") {
          toast.error("cannot buy gold with a scroll")
        }
      } else {
        if (props.jewel === "gold") {
          if (cardStatus) {
            document.getElementById(props.number).style.backgroundColor =
              "white"
            dispatch(startReserve(false))
            pot.splice(0, 1)
            props.setAction("")
          } else if (pot.length === 0) {
            document.getElementById(props.number).style.backgroundColor = "gold"
            dispatch(startReserve(true))
            pot.push(props.number)
            props.setAction("gold")
          } else {
            toast.error("Cannot take gold with other jewels")
          }
          //once reserved, reset the gold click
        }
        //adds to pot if within line
        if (
          props.jewel &&
          props.jewel !== "gold" &&
          props.action === "" &&
          pot[0] !== "gold"
        ) {
          if (pot.includes(props.number)) {
            const index = pot.indexOf(props.number)
            if (index > -1) {
              pot.splice(index, 1)
            }
            document.getElementById(props.number).style.backgroundColor =
              "white"
          } else if (pot.length < 3 && withinLine(pot, props.number)) {
            pot.push(props.number)
            document.getElementById(props.number).style.backgroundColor = "pink"
          } else {
            return false
          }
        }
      }
    } else {
      toast.error("not your turn")
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
