import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  scrolls: ["s", "s", "s"],
  status: "notEmpty",
}

export const royalSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
  },

  extraReducers: () => {},
})

export const { emptyBag } = royalSlice.actions

export const getScrolls = (state) => state.scrolls.scrolls

export default royalSlice.reducer
