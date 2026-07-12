import { Modal, Button, Form, Spinner } from "react-bootstrap"

function FormModal({
  show,
  onHide,
  title,
  onSubmit,
  submitLabel = "Guardar",
  submitting = false,
  children,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event)
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{children}</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? <Spinner animation="border" size="sm" /> : submitLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FormModal
