import api from "./api"

export const getAvailableClasses = async () => {
  const response = await api.get("/member/classes")
  return response.data.data
}
