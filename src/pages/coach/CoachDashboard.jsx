import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

const SHORTCUTS = [
  { to: "/coach/mis-clases", icon: "bi-trophy-fill", title: "Mis Clases", text: "Deportes y salas que tienes asignados." },
  { to: "/coach/mi-horario", icon: "bi-calendar-week-fill", title: "Mi Horario", text: "Tus bloques de clase por día." },
  { to: "/coach/perfil", icon: "bi-person-circle", title: "Mi Perfil", text: "Actualiza tus datos personales." },
];

function CoachDashboard() {
  return (
    <div>
      <div className="mb-4">
        <span className="sc-eyebrow">Panel de coach</span>
        <h1 className="mt-1 mb-1">Dashboard Coach</h1>
        <p className="mb-0">Mis clases, horarios asignados y perfil.</p>
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

export default CoachDashboard
