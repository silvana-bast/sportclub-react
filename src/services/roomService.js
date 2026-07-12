import api from "./api"

export const listRooms = async () => {
  const response = await api.get("/rooms")
  return response.data.data
}

export const createRoom = async (payload) => {
  const response = await api.post("/rooms", payload)
  return response.data.data
}

export const updateRoom = async (id, payload) => {
  const response = await api.put(`/rooms/${id}`, payload)
  return response.data.data
}

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`)
  return response.data
}
