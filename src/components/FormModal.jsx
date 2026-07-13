import PropTypes from "prop-types"
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
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" aria-hidden="true" />
                <span className="visually-hidden">Guardando...</span>
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

FormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  submitting: PropTypes.bool,
  children: PropTypes.node,
}

export default FormModal
