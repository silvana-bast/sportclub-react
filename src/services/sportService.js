import api from "./api"

export const listSports = async () => {
  const response = await api.get("/sports")
  return response.data.data
}

export const createSport = async (payload) => {
  const response = await api.post("/sports", payload)
  return response.data.data
}

export const updateSport = async (id, payload) => {
  const response = await api.put(`/sports/${id}`, payload)
  return response.data.data
}

export const deleteSport = async (id) => {
  const response = await api.delete(`/sports/${id}`)
  return response.data
}
