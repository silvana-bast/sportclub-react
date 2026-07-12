import Swal from "sweetalert2"

export const notifySuccess = (message) =>
  Swal.fire({ icon: "success", title: message, timer: 1800, showConfirmButton: false })

export const notifyError = (message) =>
  Swal.fire({ icon: "error", title: "Ocurrió un error", text: message })

export const confirmDelete = async (itemLabel) => {
  const result = await Swal.fire({
    icon: "warning",
    title: `¿Eliminar ${itemLabel}?`,
    text: "Esta acción no se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
  })
  return result.isConfirmed
}

export const confirmAction = async (title, text) => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  })
  return result.isConfirmed
}
