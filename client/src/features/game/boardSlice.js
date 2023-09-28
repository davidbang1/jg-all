import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  grid: [],
  status: "",
}

export const boardSlice = createSlice({
  name: "board",
  initialState,

  reducers: {
    putOnBoard: (state) => {
      state.grid[0] = "hi"
    },
    setBoard: (state, action) => {
      state.grid = action.payload
    },
    clearBoard: (state, action) => {
      state.status = action.payload
    },
  },

  extraReducers: () => {},
})

export const { putOnBoard, setBoard, clearBoard } = boardSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const showBoard = (state) => state.board.grid

export default boardSlice.reducer
