import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { login } from "../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Ingrese un correo electrónico válido.\nEjemplo: usuario@demo.cl");
            return;
        }

        // Validar contraseña
        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {

            const respuesta = await login(email, password);

            console.log(respuesta);

            if (respuesta.ok) {

                // Guardar token
                localStorage.setItem(
                    "token",
                    respuesta.data.token
                );

                // Guardar usuario
                localStorage.setItem(
                    "user",
                    JSON.stringify(respuesta.data.user)
                );

                alert(
                    "Bienvenido " +
                    respuesta.data.user.full_name
                );

                const rol = respuesta.data.user.role;

                if (rol === "admin") {

                    navigate("/admin/dashboard");

                } else if (rol === "coach") {

                    navigate("/coach/dashboard");

                } else {

                    navigate("/user/dashboard");

                }

            } else {

                alert(respuesta.message);

            }

        } catch (error) {

            console.error(error);

            alert("No fue posible conectar con el servidor.");

        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">

            <Card style={{ width: "420px" }}>

                <Card.Body>

                    <h2 className="text-center mb-4">
                        Login SportClub
                    </h2>

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

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Contraseña
                            </Form.Label>

                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                minLength={8}
                                required
                            />

                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                        >
                            Iniciar sesión
                        </Button>

                    </Form>

                </Card.Body>

            </Card>

        </Container>
    );
}

export default Login;