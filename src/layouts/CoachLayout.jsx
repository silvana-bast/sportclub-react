import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function CoachLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="navbar navbar-expand-lg navbar-dark sc-navbar">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-person-badge-fill me-2" />
            SportClub Coach
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#coachNav"
            aria-controls="coachNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="coachNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/coach/dashboard">
                  <i className="bi bi-house-door-fill me-1" /> Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/coach/mis-clases">
                  <i className="bi bi-trophy-fill me-1" /> Mis Clases
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/coach/mi-horario">
                  <i className="bi bi-calendar-week-fill me-1" /> Mi Horario
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/coach/perfil">
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
      </header>

      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default CoachLayout
