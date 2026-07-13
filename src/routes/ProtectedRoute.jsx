import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, user } = useAuth();

    // Si no hay sesión activa, volver al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar si el rol está permitido
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    // Permitir acceso
    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
