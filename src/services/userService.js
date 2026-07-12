import api from "./api"

export const listUsers = async () => {
  const response = await api.get("/users")
  return response.data.data
}

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data.data
}

export const createUser = async (payload) => {
  const response = await api.post("/users", payload)
  return response.data.data
}

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload)
  return response.data.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}
