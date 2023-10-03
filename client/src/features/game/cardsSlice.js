import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
  cardList: [],
  threeDeck: [],
  twoDeck: [],
  oneDeck: [],
}

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
  },

  extraReducers: () => {},
})

export const { setCardList, emptyBag, startReserve, setDecks } =
  cardsSlice.actions

export default cardsSlice.reducer
