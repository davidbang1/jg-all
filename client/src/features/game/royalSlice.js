import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  scrolls: ["s", "s", "s"],
  status: "notEmpty",
  royalAction: "",
}

export const royalSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    emptyBag: (state) => {},
    setRoyalAction: (state, x) => {
      state.royalAction = x.payload
    },
  },

  extraReducers: () => {},
})

export const { emptyBag, setRoyalAction } = royalSlice.actions

// export const getScrolls = (state) => state.scrolls.scrolls

export default royalSlice.reducer
