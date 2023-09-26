import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
}

export const homeSlice = createSlice({
  name: "board",
  initialState,

  reducers: {
    acceptUser: (state) => {
      state.status = true
    },
  },

  extraReducers: () => {},
})

export const { acceptUser } = homeSlice.actions

export default homeSlice.reducer
