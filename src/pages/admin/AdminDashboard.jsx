import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

const SHORTCUTS = [
  { to: "/admin/usuarios", icon: "bi-people-fill", title: "Usuarios", text: "Gestiona cuentas y roles." },
  { to: "/admin/deportes", icon: "bi-trophy-fill", title: "Deportes", text: "Administra la oferta deportiva." },
  { to: "/admin/salas", icon: "bi-building-fill", title: "Salas", text: "Controla espacios e instalaciones." },
  { to: "/admin/asignaciones", icon: "bi-diagram-3-fill", title: "Asignaciones", text: "Deporte, sala y coach." },
  { to: "/admin/horarios", icon: "bi-calendar-week-fill", title: "Horarios", text: "Bloques y días de clases." },
];

function AdminDashboard() {
  return (
    <div>
      <div className="mb-4">
        <span className="sc-eyebrow">Panel de administración</span>
        <h1 className="mt-1 mb-1">Dashboard Administrador</h1>
        <p className="mb-0">Gestión de usuarios, deportes, salas, asignaciones y horarios.</p>
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

export default AdminDashboard
