import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  scrolls: ["s", "s"],
  status: "notEmpty",
}

export const scrollSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
    addScroll: (state) => {
      state.scrolls.push("s")
    },
  },

  extraReducers: () => {},
})

export const { emptyBag, addScroll } = scrollSlice.actions

export const getScrolls = (state) => state.scrolls.scrolls

export default scrollSlice.reducer
