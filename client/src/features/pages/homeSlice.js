import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
  info: "",
}

export const homeSlice = createSlice({
  name: "board",
  initialState,

  reducers: {
    acceptUser: (state) => {
      state.status = true
    },
    setInfo(state, x) {
      state.info = x.payload
    },
  },

  extraReducers: () => {},
})

export const { acceptUser, setInfo } = homeSlice.actions

export default homeSlice.reducer
