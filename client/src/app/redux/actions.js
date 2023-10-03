import axios from "axios"

const baseURL = "http://localhost:8000/"
const myHeader = { "content-type": "application/json" }

export const createRoom = (roomid, playerid, password) => async (dispatch) => {
  const response = await axios.post(
    baseURL + "rooms/",
    { name: roomid, password: password, player1: playerid },
    { headers: myHeader },
  )
  if (response.status === 200) {
    return response.data
  }
}

export const joinRoom = (playerid, password) => async (dispatch) => {
  const response = await axios.post(
    baseURL + "rooms/search",
    { password: password, player2: playerid },
    { headers: myHeader },
  )
  if (response.status === 200) {
    return response.data
  }
}
export const getAllRooms = () => async (dispatch) => {
  const response = await axios.get(baseURL + "rooms/", { headers: myHeader })
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
