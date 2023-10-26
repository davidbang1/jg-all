import { Modal, Box } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { addToBag } from "./bagSlice"
import { socket } from "../../app/hooks/socket"
import {
  addCard,
  payJewels,
  setCurrPlayer,
  getJewel,
  checkWin,
} from "./playerOneSlice"
import { addCard2, payJewels2, checkWin2, getJewel2 } from "./playerTwoSlice"
import { toast } from "react-toastify"
import { setRoyalAction } from "./royalSlice"
import { useEffect } from "react"

export function JewelsModal(props) {
  const dispatch = useDispatch()
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const startingInfo = useSelector((state) => state.home.info)

  socket.off("steal-jewel2")
  socket.on("steal-jewel2", (x) => {
    if (x.currPlayer === 2) {
      dispatch(payJewels2([x.jewel]))
      dispatch(getJewel([x.jewel]))
    } else {
      dispatch(payJewels([x.jewel]))
      dispatch(getJewel2([x.jewel]))
    }
  })
  // useEffect(() => {
  //   handleClick(props.action)
  // }, [props.action])
  function handleClick(jewel) {
    if (props.action === "steal") {
      if (currPlayer === 2) {
        dispatch(payJewels2([jewel]))
        dispatch(getJewel([jewel]))
        socket.emit("steal-jewel", { jewel: jewel, currPlayer: 2 })
      } else {
        dispatch(payJewels([jewel]))
        dispatch(getJewel2([jewel]))
        socket.emit("steal-jewel", { jewel: jewel, currPlayer: 1 })
      }
      props.handleClose()
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
      dispatch(checkWin(startingInfo[0]))
      dispatch(checkWin2(startingInfo[0]))

      props.removeCard()

      socket.emit("buy-card", {
        cart: props.cost,
        props: obj,
        index: props.index,
      })
      props.handleClose()
    } else if (props.action === "royals") {
      dispatch(setRoyalAction(jewel))
      //steal, again, scroll,none
    } else {
      //use gold as a color
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
