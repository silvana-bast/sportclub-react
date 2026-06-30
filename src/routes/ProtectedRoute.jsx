import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    // Obtener el token guardado en localStorage
    const token = localStorage.getItem("token");

    // Si no existe token, redirigir al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si existe token, permitir acceder a la ruta
    return children;
}

export default ProtectedRoute;