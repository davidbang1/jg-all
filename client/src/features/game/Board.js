import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Cell from "./Cell.js"
import { showBoard, setBoard, clearBoard } from "./boardSlice"
import { emptyBag, fillBoard, setBag } from "./bagSlice"
import { getJewel, setCurrPlayer } from "./playerOneSlice.js"
import { getJewel2, checkWin } from "./playerTwoSlice.js"
import "../index.css"
import { socket } from "../../app/hooks/socket"
import { toast } from "react-toastify"
import { takeScroll } from "./playerOneSlice"
import { takeScroll2 } from "./playerTwoSlice"
import { addScroll } from "./scrollSlice"
import { setStatus } from "./cardsSlice.js"

export function Board(props) {
  const count = useSelector(showBoard)
  const dispatch = useDispatch()
  const [grid, setGrid] = useState([])
  const [pot, setPot] = useState([])

  const data = useSelector((state) => state.bag.bag)
  const boardState = useSelector((state) => state.board.grid)
  const boardStatus = useSelector((state) => state.board.status)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)
  const startingInfo = useSelector((state) => state.home.info)

  socket.off("remove-this2")
  socket.on("remove-this2", (x) => {
    //dispatch(clearBoard("clean"))
    removeThis(x.pot)
    currPlayer === 1
      ? dispatch(getJewel(x.takeThese))
      : dispatch(getJewel2(x.takeThese))
    dispatch(setCurrPlayer())
    dispatch(checkWin())
  })

  socket.off("gold-board2")
  socket.on("gold-board2", (x) => {
    removeThis(x.pot)
    setPot([])
    dispatch(clearBoard(""))
  })

  socket.off("gem-picked2")
  socket.on("gem-picked2", (x) => {
    console.log("socket 2")
    removeThis([x.ind])
    if (currPlayer === 1) {
      dispatch(getJewel([x.jewel]))
    } else {
      dispatch(getJewel2([x.jewel]))
    }
  })

  socket.off("use-scroll2")
  socket.on("use-scroll2", (x) => {
    removeThis([x.number])
    dispatch(addScroll())
    if (currPlayer === 1) {
      dispatch(getJewel([x.jewel]))
      dispatch(takeScroll())
    } else {
      dispatch(getJewel2([x.jewel]))
      dispatch(takeScroll2())
    }
  })

  socket.off("fill-board2")
  socket.on("fill-board2", (x) => {
    setGrid(x.board)
    dispatch(emptyBag())
    dispatch(setBoard(x.board))
  })

  useEffect(() => {
    let newGrid = new Array(25)
    if (Object.seal) {
      newGrid.fill(undefined)
      Object.seal(newGrid)
    }
    setGrid(newGrid)
    if (data.length) {
      let final = mapFirst(data, boardState)
      setGrid(final)
      dispatch(emptyBag())
      dispatch(setBoard(final))
      socket.emit("fill-board", { board: final })
    }
  }, [])

  useEffect(() => {
    //cleaning
    if (boardStatus === "gold") {
      removeThis(pot)
      socket.emit("gold-board", { pot: pot })
    } else {
      for (let i = 0; i < pot.length; i++) {
        document.getElementById(pot[i]).style.backgroundColor = "white"
      }
    }
    setPot([])
    dispatch(clearBoard(""))
  }, [boardStatus])

  const gridMapping = [
    17, 18, 19, 20, 21, 16, 5, 6, 7, 22, 15, 4, 1, 8, 23, 14, 3, 2, 9, 24, 13,
    12, 11, 10, 25,
  ]

  function giveGem(jewel, number, cardInfo) {
    removeThis([number])
    currPlayer === 1
      ? dispatch(getJewel([jewel]))
      : dispatch(getJewel2([jewel]))
    socket.emit("gem-picked", { jewel: jewel, ind: number })
    dispatch(setStatus([jewel, cardInfo[1], cardInfo[2]]))
  }

  //unused
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }
    return array
  }

  function removeThis(x) {
    let tempArr = [...grid]
    for (let i = 0; i < x.length; i++) {
      tempArr[x[i]] = undefined
    }
    setGrid(tempArr)
    dispatch(setBoard(tempArr))
  }

  function mapFirst(arr, currGrid) {
    if (currGrid.length === 0) {
      let newGrid = new Array(25)
      if (Object.seal) {
        newGrid.fill(undefined)
        Object.seal(newGrid)
      }
      for (let i = 0; i < arr.length; i++) {
        newGrid[gridMapping.indexOf(i + 1)] = arr[i]
      }
      return newGrid
    } else {
      let temp = [...currGrid]
      for (let i = 0, x = 0; i < 25; i++) {
        if (temp[gridMapping.indexOf(i + 1)] === undefined) {
          temp[gridMapping.indexOf(i + 1)] = arr[x]
          x++
        }
      }
      return temp
    }
  }

  function handleFill() {
    if (currPlayer === startingInfo[0]) {
      if (data.length) {
        let final = mapFirst(data, boardState)
        setGrid(final)
        dispatch(emptyBag())
        dispatch(setBoard(final))
        socket.emit("fill-board", { board: final })
      }
    } else {
      toast.error("not your turn")
    }
  }
  function takeJewels() {
    if (currPlayer === startingInfo[0]) {
      //double check pot is not separated
      if (pot.length === 2) {
        if (
          Math.abs(pot[0] - pot[1]) === 2 ||
          Math.abs(pot[0] - pot[1]) === 8 ||
          Math.abs(pot[0] - pot[1]) === 10 ||
          Math.abs(pot[0] - pot[1]) === 12
        ) {
          return false
        }
      }
      //then add to player and end turn
      let takeThese = []
      for (let i = 0; i < pot.length; i++) {
        takeThese.push(grid[pot[i]])
        document.getElementById(pot[i]).style.backgroundColor = "white"
      }
      removeThis(pot)
      socket.emit("remove-this", { pot: pot, takeThese: takeThese })

      currPlayer === 1
        ? dispatch(getJewel(takeThese))
        : dispatch(getJewel2(takeThese))

      dispatch(setCurrPlayer())
      dispatch(checkWin())

      setPot([])
    } else {
      toast.error("not ur turn")
    }
  }

  return (
    <div>
      <button aria-label="fill-board" onClick={() => handleFill()}>
        Fill Board
      </button>
      <button aria-label="take-board" onClick={() => takeJewels()}>
        Take
      </button>
      <table>
        <tbody>
          {grid
            .reduce(function (rows, key, index) {
              return (
                (index % 5 === 0
                  ? rows?.push([
                      <Cell
                        key={index}
                        action={props.action}
                        setAction={props.setAction}
                        number={index}
                        jewel={key}
                        pot={pot}
                        getJewel={getJewel}
                        getJewel2={getJewel2}
                        removeThis={removeThis}
                        giveGem={giveGem}
                      />,
                    ])
                  : rows[rows.length - 1].push(
                      <Cell
                        key={index}
                        action={props.action}
                        setAction={props.setAction}
                        number={index}
                        jewel={key}
                        pot={pot}
                        getJewel={getJewel}
                        getJewel2={getJewel2}
                        removeThis={removeThis}
                        giveGem={giveGem}
                      />,
                    )) && rows
              )
            }, [])
            .map((item, index) => {
              return <tr key={index}>{item}</tr>
            })}
        </tbody>
      </table>
    </div>
  )
}
