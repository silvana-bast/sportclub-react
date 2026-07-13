import PropTypes from "prop-types"
import { Spinner } from "react-bootstrap"

function PageSpinner({ label = "Cargando..." }) {
  return (
    <div className="text-center py-4" role="status">
      <Spinner animation="border" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}

PageSpinner.propTypes = {
  label: PropTypes.string,
}

export default PageSpinner
