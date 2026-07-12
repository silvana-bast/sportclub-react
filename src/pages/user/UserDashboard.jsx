import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

const SHORTCUTS = [
  { to: "/user/clases-disponibles", icon: "bi-calendar2-check-fill", title: "Clases Disponibles", text: "Explora y reserva tu próxima clase." },
  { to: "/user/mis-reservas", icon: "bi-bookmark-check-fill", title: "Mis Reservas", text: "Revisa o cancela tus reservas activas." },
  { to: "/user/perfil", icon: "bi-person-circle", title: "Mi Perfil", text: "Actualiza tus datos personales." },
];

function UserDashboard() {
  return (
    <div>
      <div className="mb-4">
        <span className="sc-eyebrow">Panel de usuario</span>
        <h1 className="mt-1 mb-1">Dashboard Usuario</h1>
        <p className="mb-0">Mis reservas, clases disponibles y perfil.</p>
      </div>

      <Row className="g-4">
        {SHORTCUTS.map((item) => (
          <Col md={6} lg={4} key={item.to}>
            <Card as={Link} to={item.to} className="h-100 sc-hover-lift border-0 text-decoration-none">
              <Card.Body className="d-flex align-items-start gap-3 p-4">
                <div className="sc-icon-tile">
                  <i className={`bi ${item.icon}`} />
                </div>
                <div>
                  <Card.Title as="h3" className="mb-1">{item.title}</Card.Title>
                  <Card.Text className="mb-0">{item.text}</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default UserDashboard
