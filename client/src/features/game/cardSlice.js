import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  scrolls: ["s", "s", "s"],
  status: false,
}

export const cardSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
    startReserve: (state, b) => {
      state.status = b.payload
    },
  },

  extraReducers: () => {},
})

export const { emptyBag, startReserve } = cardSlice.actions

export const getScrolls = (state) => state.scrolls.scrolls

export default cardSlice.reducer
