import axios from "axios"

const baseURL = "http://localhost:8000/"
const myHeader = { "content-type": "application/json" }

export const testBackend = (password) => async (dispatch) => {
  const response = await axios.post(
    baseURL,
    { password: password },
    { headers: myHeader },
  )
  if (response.status === 200) {
    return response.data
  }
}

export const titleTest = () => async (dispatch) => {
  const response = await axios.get(baseURL + "test/", { headers: myHeader })
  if (response.status === 200) {
    return response.data
  } else {
    return "failed"
  }
}

export const getRoom = () => async (dispatch) => {
  const response = await axios.get(baseURL + "getRoom/", { headers: myHeader })
  if (response.status === 200) {
    return response.data
  } else {
    return "failed"
  }
}

export const makeConnection = (peer1, uid) => async (dispatch) => {
  const response = await axios.post(
    baseURL + "conn/",
    { peer1: peer1, peer2: uid },
    { headers: myHeader },
  )
  if (response.status === 200) {
    //save connection in state
    return response.data
  } else {
    return "failed"
  }
}
