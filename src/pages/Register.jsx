import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { register } from "../services/authService";
import { isValidEmail, isValidPassword, isRequired } from "../utils/validators";
import { notifySuccess, notifyError } from "../utils/alerts";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!isRequired(fullName)) {
      notifyError("El nombre completo es obligatorio.");
      return;
    }

    if (!isValidEmail(email)) {
      notifyError("Ingrese un correo electrónico válido.");
      return;
    }

    if (!isValidPassword(password)) {
      notifyError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      notifyError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    const respuesta = await register({
      full_name: fullName,
      email,
      password,
      birth_date: birthDate || null,
    });

    setSubmitting(false);

    if (respuesta.ok) {
      notifySuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      navigate("/login");
    } else {
      notifyError(respuesta.message);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 sc-hero py-5">
      <Card className="border-0" style={{ width: "460px", borderRadius: "var(--sc-radius-lg)", boxShadow: "var(--sc-shadow-lg)" }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="sc-icon-tile mx-auto mb-3">
              <i className="bi bi-person-plus-fill" />
            </div>
            <h2 className="mb-1">Crea tu cuenta</h2>
            <p className="mb-0">Únete a SportClub en un par de pasos</p>
          </div>

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="registerFullName">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerBirthDate">
              <Form.Label>Fecha de nacimiento (opcional)</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerConfirmPassword">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" size="lg" disabled={submitting}>
              {submitting ? "Creando cuenta..." : "Registrarme"}
            </Button>

            <p className="text-center mt-4 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;
