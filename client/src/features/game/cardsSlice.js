import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
  cardList: [],
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
  },

  extraReducers: () => {},
})

export const { setCardList, emptyBag, startReserve } = cardsSlice.actions

export default cardsSlice.reducer
