import api from "./api"

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  } catch (error) {
    return { ok: false, message: error.message }
  }
}

export const register = async (payload) => {
  try {
    const response = await api.post("/auth/register", payload)
    return response.data
  } catch (error) {
    return { ok: false, message: error.message }
  }
}

export const getMe = async () => {
  try {
    const response = await api.get("/auth/me")
    return response.data
  } catch (error) {
    return { ok: false, message: error.message }
  }
}
