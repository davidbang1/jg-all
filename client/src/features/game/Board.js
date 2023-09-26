import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Cell from "./Cell.js"
import { showBoard, setBoard, clearBoard } from "./boardSlice"
import { emptyBag } from "./bagSlice"
import { getJewel, setCurrPlayer } from "./playerOneSlice.js"
import { getJewel2, checkWin } from "./playerTwoSlice.js"
import "../index.css"

export function Board(props) {
  const count = useSelector(showBoard)
  const dispatch = useDispatch()
  const [grid, setGrid] = useState([])
  const [pot, setPot] = useState([])

  const data = useSelector((state) => state.bag.bag)
  const boardState = useSelector((state) => state.board.grid)
  const boardStatus = useSelector((state) => state.board.status)
  const currPlayer = useSelector((state) => state.playerOne.currPlayer)

  useEffect(() => {
    let newGrid = new Array(25)
    if (Object.seal) {
      newGrid.fill(undefined)
      Object.seal(newGrid)
    }
    setGrid(newGrid)
  }, [])

  useEffect(() => {
    //cleaning
    if (boardStatus === "gold") {
      removeThis(pot)
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
  console.log("what")

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
    if (data.length) {
      let arrayForSort = [...data]
      shuffle(arrayForSort)
      arrayForSort = mapFirst(arrayForSort, boardState)
      setGrid(arrayForSort)
      dispatch(emptyBag())
      dispatch(setBoard(arrayForSort))
    }
  }
  function takeJewels() {
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
    currPlayer === 1
      ? dispatch(getJewel(takeThese))
      : dispatch(getJewel2(takeThese))

    dispatch(setCurrPlayer())
    dispatch(checkWin())

    setPot([])
  }
  return (
    <div>
      <button aria-label="fill board" onClick={() => handleFill()}>
        Fill Board
      </button>
      <button aria-label="fill board" onClick={() => takeJewels()}>
        Take {pot}
      </button>
      <table>
        <tbody>
          {grid
            .reduce(function (rows, key, index) {
              return (
                (index % 5 === 0
                  ? rows.push([
                      <Cell
                        action={props.action}
                        setAction={props.setAction}
                        number={index}
                        jewel={key}
                        pot={pot}
                        getJewel={getJewel}
                        getJewel2={getJewel2}
                        removeThis={removeThis}
                      />,
                    ])
                  : rows[rows.length - 1].push(
                      <Cell
                        action={props.action}
                        setAction={props.setAction}
                        number={index}
                        jewel={key}
                        pot={pot}
                        getJewel={getJewel}
                        getJewel2={getJewel2}
                        removeThis={removeThis}
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
