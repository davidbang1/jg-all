import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

const container = document.getElementById("root")
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <ToastContainer />
    <App />
  </Provider>,
)

reportWebVitals()
