import api from "./api"

export const getMyReservations = async () => {
  const response = await api.get("/reservations/my-reservations")
  return response.data.data
}

export const createReservation = async (classScheduleId) => {
  const response = await api.post("/reservations", { class_schedule_id: classScheduleId })
  return response.data.data
}

export const cancelReservation = async (id) => {
  const response = await api.patch(`/reservations/${id}/cancel`)
  return response.data.data
}
