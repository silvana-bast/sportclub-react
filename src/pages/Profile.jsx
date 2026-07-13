import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/useAuth";
import { updateUser } from "../services/userService";
import { isRequired } from "../utils/validators";
import { notifySuccess, notifyError } from "../utils/alerts";

const ROLE_LABEL = {
  admin: "Administrador",
  coach: "Coach",
  user: "Usuario",
};

function Profile() {
  const { user, updateUser: updateAuthUser } = useAuth();

  const [fullName, setFullName] = useState(user.full_name);
  const [birthDate, setBirthDate] = useState(
    user.birth_date ? user.birth_date.substring(0, 10) : ""
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isRequired(fullName)) {
      notifyError("El nombre completo es obligatorio.");
      return;
    }

    setSubmitting(true);

    try {
      const updated = await updateUser(user.id, {
        full_name: fullName,
        email: user.email,
        role: user.role,
        birth_date: birthDate || null,
      });

      updateAuthUser({ ...user, ...updated });
      notifySuccess("Perfil actualizado correctamente.");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-person-circle me-2 text-primary" />Mi Perfil</h2>

      <Card style={{ maxWidth: "560px" }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col as={Form.Group} controlId="profileEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control value={user.email} disabled />
              </Col>
              <Col as={Form.Group} controlId="profileRole">
                <Form.Label>Rol</Form.Label>
                <Form.Control value={ROLE_LABEL[user.role] ?? user.role} disabled />
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="profileFullName">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileBirthDate">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
