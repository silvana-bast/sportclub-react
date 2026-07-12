import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const FEATURES = [
  {
    icon: "bi-trophy-fill",
    title: "Deportes",
    description: "Explora la variedad de disciplinas disponibles en el club, cada una con su objetivo y duración.",
  },
  {
    icon: "bi-calendar-week-fill",
    title: "Horarios",
    description: "Consulta días y bloques horarios de cada clase para organizar tu semana sin cruces.",
  },
  {
    icon: "bi-building-fill",
    title: "Salas",
    description: "Conoce las instalaciones disponibles: capacidad, ubicación y equipamiento de cada espacio.",
  },
];

function Home() {
  return (
    <div className="flex-grow-1 sc-hero">
      <Container className="py-5">
        <Row className="align-items-center py-5">
          <Col lg={7} className="text-center text-lg-start">
            <span className="sc-eyebrow">Gestión deportiva simplificada</span>
            <h1 className="mt-2 mb-3">
              Bienvenido a <span style={{ color: "var(--sc-blue-600)" }}>SportClub</span>
            </h1>
            <p className="fs-5 mb-4">
              La plataforma para administrar deportes, salas, horarios y reservas de tu club,
              todo en un solo lugar.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Button as={Link} to="/login" variant="primary" size="lg">
                Iniciar sesión
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg">
                Registrarse
              </Button>
            </div>
          </Col>

          <Col lg={5} className="text-center mt-5 mt-lg-0">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto"
              style={{
                width: 220,
                height: 220,
                background: "var(--sc-gradient-brand)",
                boxShadow: "var(--sc-shadow-lg)",
              }}
            >
              <i className="bi bi-person-workspace text-white" style={{ fontSize: "6rem" }} />
            </div>
          </Col>
        </Row>

        <Row className="g-4 pb-5 mt-2">
          {FEATURES.map((feature) => (
            <Col md={4} key={feature.title}>
              <Card className="h-100 sc-hover-lift border-0">
                <Card.Body className="text-center p-4">
                  <div className="sc-icon-tile mb-3">
                    <i className={`bi ${feature.icon}`} />
                  </div>
                  <Card.Title as="h3">{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
