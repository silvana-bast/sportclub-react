import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { login as loginRequest } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { isValidEmail, isValidPassword } from "../utils/validators";
import { notifySuccess, notifyError } from "../utils/alerts";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            notifyError("Ingrese un correo electrónico válido. Ejemplo: usuario@demo.cl");
            return;
        }

        if (!isValidPassword(password)) {
            notifyError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setSubmitting(true);

        const respuesta = await loginRequest(email, password);

        setSubmitting(false);

        if (respuesta.ok) {

            login(respuesta.data.token, respuesta.data.user);

            notifySuccess("Bienvenido " + respuesta.data.user.full_name);

            const rol = respuesta.data.user.role;

            if (rol === "admin") {
                navigate("/admin/dashboard");
            } else if (rol === "coach") {
                navigate("/coach/dashboard");
            } else {
                navigate("/user/dashboard");
            }

        } else {

            notifyError(respuesta.message);

        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 sc-hero py-5">

            <Card className="border-0" style={{ width: "420px", borderRadius: "var(--sc-radius-lg)", boxShadow: "var(--sc-shadow-lg)" }}>

                <Card.Body className="p-4 p-md-5">

                    <div className="text-center mb-4">
                        <div className="sc-icon-tile mx-auto mb-3">
                            <i className="bi bi-shield-lock-fill" />
                        </div>
                        <h2 className="mb-1">
                            Bienvenido de vuelta
                        </h2>
                        <p className="mb-0">Inicia sesión en tu cuenta de SportClub</p>
                    </div>

                    <Form onSubmit={handleLogin}>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Correo electrónico
                            </Form.Label>

                            <Form.Control
                                type="email"
                                placeholder="Ingrese su correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </Form.Group>

                        <Form.Group className="mb-4">

                            <Form.Label>
                                Contraseña
                            </Form.Label>

                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />

                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            size="lg"
                            disabled={submitting}
                        >
                            {submitting ? "Ingresando..." : "Iniciar sesión"}
                        </Button>

                        <p className="text-center mt-4 mb-0">
                            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                        </p>

                    </Form>

                </Card.Body>

            </Card>

        </Container>
    );
}

export default Login;