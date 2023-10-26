import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  scrolls: 2,
  status: "notEmpty",
}

export const scrollSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
    addScrollZone: (state) => {
      state.scrolls += 1
    },
    takeScrollZone: (state) => {
      state.scrolls -= 1
    },
  },

  extraReducers: () => {},
})

export const { emptyBag, addScrollZone, takeScrollZone } = scrollSlice.actions

export const getScrolls = (state) => state.scrolls.scrolls

export default scrollSlice.reducer
