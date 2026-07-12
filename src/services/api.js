import axios from "axios"

export const TOKEN_KEY = "token"
export const USER_KEY = "user"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    const message =
      error.response?.data?.message ||
      "No fue posible conectar con el servidor."

    return Promise.reject(new Error(message))
  }
)

export default api
