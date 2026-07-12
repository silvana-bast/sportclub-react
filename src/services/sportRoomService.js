import api from "./api"

export const listSportRooms = async () => {
  const response = await api.get("/sport-rooms")
  return response.data.data
}

export const createSportRoom = async (payload) => {
  const response = await api.post("/sport-rooms", payload)
  return response.data.data
}

export const updateSportRoom = async (id, payload) => {
  const response = await api.put(`/sport-rooms/${id}`, payload)
  return response.data.data
}

export const deleteSportRoom = async (id) => {
  const response = await api.delete(`/sport-rooms/${id}`)
  return response.data
}
