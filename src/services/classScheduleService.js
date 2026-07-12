import api from "./api"

export const listClassSchedules = async () => {
  const response = await api.get("/class-schedules")
  return response.data.data
}

export const createClassSchedule = async (payload) => {
  const response = await api.post("/class-schedules", payload)
  return response.data.data
}

export const updateClassSchedule = async (id, payload) => {
  const response = await api.put(`/class-schedules/${id}`, payload)
  return response.data.data
}

export const deleteClassSchedule = async (id) => {
  const response = await api.delete(`/class-schedules/${id}`)
  return response.data
}
