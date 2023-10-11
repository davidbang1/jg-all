import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
  cardList: [],
  threeDeck: [],
  twoDeck: [],
  oneDeck: [],
  gem: [],
  status2: "",
}
console.log("cardsslice")
export const cardsSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
    startReserve: (state, b) => {
      state.status = b.payload[0]
      state.currJewel = b.payload[1]
    },
    setCardList: (state, c) => {
      state.cardList.push(c.payload.props)
    },
    setDecks: (state, x) => {
      state.threeDeck = x.payload[0]
      state.twoDeck = x.payload[1]
      state.oneDeck = x.payload[2]
    },
    setDeck3: (state, x) => {
      state.threeDeck = x.payload
    },
    setDeck2: (state, x) => {
      state.twoDeck = x.payload
    },
    setDeck1: (state, x) => {
      state.oneDeck = x.payload
    },
    setGem: (state, x) => {
      state.gem = x.payload
    },
    setStatus: (state, x) => {
      state.status2 = x.payload
    },
  },

  extraReducers: () => {},
})

export const {
  setCardList,
  emptyBag,
  startReserve,
  setDecks,
  setDeck3,
  setDeck2,
  setDeck1,
  setGem,
  setStatus,
} = cardsSlice.actions

export default cardsSlice.reducer
