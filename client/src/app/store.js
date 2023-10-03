import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import bagReducer from "../features/game/bagSlice"
import boardReducer from "../features/game/boardSlice"
import playerOneReducer from "../features/game/playerOneSlice"
import playerTwoReducer from "../features/game/playerTwoSlice"
import scrollReducer from "../features/game/scrollSlice"
import cardReducer from "../features/game/cardSlice"
import cardsReducer from "../features/game/cardsSlice"
import royalReducer from "../features/game/royalSlice"
import homeReducer from "../features/pages/homeSlice"

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    counter: counterReducer,
    bag: bagReducer,
    board: boardReducer,
    playerOne: playerOneReducer,
    playerTwo: playerTwoReducer,
    scrolls: scrollReducer,
    card: cardReducer,
    cards: cardsReducer,
    royal: royalReducer,
    home: homeReducer,
  },
})
