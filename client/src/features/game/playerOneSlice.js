import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
const initialState = {
  playerId: "",
  permaJewels: {
    white: 0,
    blue: 10,
    green: 10,
    red: 0,
    black: 0,
    pearl: 0,
  },
  jewels: {
    white: 10,
    blue: 10,
    green: 10,
    red: 10,
    black: 10,
    pearl: 0,
    gold: 10,
  },
  points: { white: 0, blue: 0, green: 0, red: 0, black: 0, pearl: 0, gold: 0 },
  totalPoints: 0,
  crowns: 0,
  scrolls: 2,
  currPlayer: 1,
  reservedCards: [],
  gotFirst: false,
  gotSecond: false,
  getRoyal: "",
  myRoyals: [],
  royals: ["steal", "again", "scroll", "none"],
  roomId: "",
}

export const playerOneSlice = createSlice({
  name: "playerOne",
  initialState,
  reducers: {
    setId: (state, x) => {
      state.playerId = x.payload
    },
    getJewel: (state, x) => {
      for (let i = 0; i < x.payload.length; i++) {
        let myColor = x.payload[i]
        state.jewels[myColor] += 1
      }
    },
    addCard: (state, x) => {
      let myColor = x.payload.color
      state.permaJewels[myColor] += x.payload.quantity
      if (x.payload.color) {
        state.points[x.payload.color] += x.payload.points
      }
      state.totalPoints += x.payload.points
      state.crowns += x.payload.crowns

      //if crowns >= 3 and !gotFirst, getRoyal = true and gotFirst = true
      if (state.crowns >= 3 && !state.gotFirst) {
        state.gotFirst = true
        state.getRoyal = "first"
      }
      //if crowns >= 6 and !gotSecond, getRoyal = false and gotSecond = true
      if (state.crowns >= 6 && !state.gotSecond) {
        state.gotSecond = true
        state.getRoyal = "second"
      }
    },
    payJewels: (state, x) => {
      for (let i = 0; i < x.payload.length; i++) {
        state.jewels[x.payload[i]] -= 1
      }
    },
    takeScroll: (state) => {
      state.scrolls -= 1
    },
    addScroll: (state) => {
      state.scrolls += 1
    },
    checkWin: (state, x) => {
      // check win conditions
      if (x.payload === 1) {
        let colorPoints = Object.entries(state.points)
        let maxP = 0
        for (let i = 0; i < colorPoints.length; i++) {
          if (colorPoints[i][1] > maxP) {
            maxP = colorPoints[i][1]
          }
        }
        let pointsTotal = Object.values(state.points).reduce((a, b) => a + b, 0)
        if (state.crowns >= 10 || pointsTotal >= 20 || maxP >= 10) {
          toast.success("Congrats, you win!")
          state.status = "win"
        }
        //check num jewels
        if (Object.values(state.jewels).reduce((a, b) => a + b, 0) > 10) {
          toast.error("You have too many jewels, get rid of some")
          state.status = "reduce"
        }
      }
    },
    setCurrPlayer: (state) => {
      //do only change player,make a separate function for check win conditions
      if (state.currPlayer === 1) {
        state.currPlayer = 2
      } else {
        state.currPlayer = 1
      }
    },
    clearStatus: (state) => {
      state.status = ""
    },
    reserveCards: (state, x) => {
      state.reservedCards.push(x.payload)
    },
    removeReserved: (state, x) => {
      state.reservedCards.splice(x.payload, 1)
    },
    addRoyal: (state, x) => {
      state.totalPoints += x.payload.points
      state.myRoyals.push(x.payload.royal)
    },
    removeRoyal: (state, x) => {
      const index = state.royals.indexOf(x.payload)
      if (index > -1) {
        state.royals.splice(index, 1)
      }
    },
    setRoom: (state, x) => {
      state.roomId = x.payload
    },
  },
  extraReducers: () => {},
})

export const {
  setCurrPlayer,
  addCard,
  getJewel,
  payJewels,
  takeScroll,
  clearStatus,
  reserveCards,
  setId,
  addScroll,
  addRoyal,
  removeRoyal,
  removeReserved,
  setRoom,
  checkWin,
} = playerOneSlice.actions

export const showBoard = (state) => state.playerOne.jewels

export default playerOneSlice.reducer
