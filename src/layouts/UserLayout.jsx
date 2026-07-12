import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function UserLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark sc-navbar">
          <div className="container-fluid container">
            <Link className="navbar-brand fw-bold" to="/">
              <i className="bi bi-person-fill me-2" />
              SportClub
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user/dashboard">
                    <i className="bi bi-house-door-fill me-1" /> Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user/clases-disponibles">
                    <i className="bi bi-calendar2-check-fill me-1" /> Clases Disponibles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user/mis-reservas">
                    <i className="bi bi-bookmark-check-fill me-1" /> Mis Reservas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user/perfil">
                    <i className="bi bi-person-circle me-1" /> Mi Perfil
                  </Link>
                </li>
                <li className="nav-item d-flex align-items-center ms-lg-2 mt-2 mt-lg-0">
                  <span className="text-white-50 me-2 small">{user?.full_name}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1" /> Salir
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserLayout
