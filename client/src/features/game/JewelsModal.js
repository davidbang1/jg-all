import { useState, useEffect } from "react"
import { Button, Modal, Box } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { addToBag } from "./bagSlice"
import { socket } from "../../app/hooks/socket"

import {
  addCard,
  payJewels,
  setCurrPlayer,
  reserveCards,
  getJewel,
} from "./playerOneSlice"
import {
  addCard2,
  payJewels2,
  checkWin,
  reserveCards2,
  getJewel2,
} from "./playerTwoSlice"

export function JewelsModal(props) {
  //props are jewels and action
  const dispatch = useDispatch()
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const startingInfo = useSelector((state) => state.home.info)

  console.log("jewel modal")
  //pass in title,
  //pass in my permajewels if getting colorless card
  //pass in opps jewels if stealing a jewel
  //pass in all jewels if using a gold jewel
  //   const [title, setTitle] = useState("Use gold as which color?")
  //   const [reqs, setReqs] = useState([
  //     "white",
  //     "blue",
  //     "green",
  //     "red",
  //     "black",
  //     "pearl",
  //   ])
  //   useEffect(() => {
  //     if (props.jewel) {
  //       setReqs(props.jewel)
  //     }
  //     if (props.action) {
  //       if (props.action === "colorless") {
  //         setTitle("Select a color to make your card that one")
  //       } else if (props.action === "steal") {
  //         setTitle(
  //           "Select a jewel from your oppponents jewel pile to take as your own",
  //         )
  //       } else {
  //         setTitle("Use gold as which color?")
  //       }
  //     }
  //   }, props.open)

  socket.off("steal-jewel2")
  socket.on("steal-jewel2", (x) => {
    if (x.currPlayer === 1) {
      dispatch(payJewels2([x.jewel]))
      dispatch(getJewel([x.jewel]))
    } else {
      dispatch(payJewels([x.jewel]))
      dispatch(getJewel2([x.jewel]))
    }
    dispatch(setCurrPlayer())
    dispatch(checkWin())
  })

  function handleClick(jewel) {
    if (props.action === "steal") {
      if (currPlayer === 1) {
        dispatch(payJewels2([jewel]))
        dispatch(getJewel([jewel]))
        socket.emit("steal-jewel", { jewel: jewel, currPlayer: 1 })
      } else {
        dispatch(payJewels([jewel]))
        dispatch(getJewel2([jewel]))
        socket.emit("steal-jewel", { jewel: jewel, currPlayer: 2 })
      }
      dispatch(setCurrPlayer())
      dispatch(checkWin())
      props.handleClose()

      //emit
    } else if (props.action === "colorless") {
      let obj = JSON.parse(JSON.stringify(props.extra))
      obj.color = jewel
      dispatch(addToBag(props.cost))
      if (currPlayer === 1) {
        dispatch(payJewels(props.cost))
        dispatch(addCard(obj))
      } else {
        dispatch(payJewels2(props.cost))
        dispatch(addCard2(obj))
      }
      dispatch(setCurrPlayer())
      dispatch(checkWin())

      props.removeCard()

      socket.emit("buy-card", {
        cart: props.cost,
        props: obj,
        index: props.index,
      })
      props.handleClose()
    } else {
      //use gold as a color
      //add to card modal
    }
  }

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box className="modalStyle">
        {props.action}

        {props.jewels?.map((item, index) => {
          return (
            <div key={index} className={item} onClick={() => handleClick(item)}>
              {item}
            </div>
          )
        })}
      </Box>
    </Modal>
  )
}
