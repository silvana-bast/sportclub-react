import api from "./api"

export const getMyClasses = async () => {
  const response = await api.get("/coach/my-classes")
  return response.data.data
}

export const getMySchedules = async () => {
  const response = await api.get("/coach/my-schedules")
  return response.data.data
}
