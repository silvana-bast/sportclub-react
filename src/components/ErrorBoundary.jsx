import { Component } from "react"
import PropTypes from "prop-types"
import { Container, Button } from "react-bootstrap"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error no controlado en la aplicación:", error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container
          role="alert"
          className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100 sc-hero"
        >
          <div className="sc-icon-tile mb-3">
            <i className="bi bi-exclamation-triangle-fill" />
          </div>
          <h1 className="mb-2">Ocurrió un error inesperado</h1>
          <p className="mb-4">
            Algo salió mal al mostrar esta pantalla. Puedes volver al inicio e intentarlo de nuevo.
          </p>
          <Button variant="primary" size="lg" onClick={this.handleReload}>
            Volver al inicio
          </Button>
        </Container>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
