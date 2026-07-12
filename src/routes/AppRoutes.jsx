import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Register from "../pages/Register"
import Login from "../pages/Login"
import Profile from "../pages/Profile"
import UserDashboard from "../pages/user/UserDashboard"
import AvailableClasses from "../pages/user/AvailableClasses"
import MyReservations from "../pages/user/MyReservations"
import CoachDashboard from "../pages/coach/CoachDashboard"
import MyClasses from "../pages/coach/MyClasses"
import MySchedule from "../pages/coach/MySchedule"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UsersManagement from "../pages/admin/UsersManagement"
import SportsManagement from "../pages/admin/SportsManagement"
import RoomsManagement from "../pages/admin/RoomsManagement"
import AssignmentsManagement from "../pages/admin/AssignmentsManagement"
import SchedulesManagement from "../pages/admin/SchedulesManagement"
import ProtectedRoute from "./ProtectedRoute";

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="clases-disponibles" element={<AvailableClasses />} />
                    <Route path="mis-reservas" element={<MyReservations />} />
                    <Route path="perfil" element={<Profile />} />
                </Route>

                <Route
                    path="/coach"
                    element={
                        <ProtectedRoute allowedRoles={["coach"]}>
                            <CoachLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<CoachDashboard />} />
                    <Route path="mis-clases" element={<MyClasses />} />
                    <Route path="mi-horario" element={<MySchedule />} />
                    <Route path="perfil" element={<Profile />} />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="usuarios" element={<UsersManagement />} />
                    <Route path="deportes" element={<SportsManagement />} />
                    <Route path="salas" element={<RoomsManagement />} />
                    <Route path="asignaciones" element={<AssignmentsManagement />} />
                    <Route path="horarios" element={<SchedulesManagement />} />
                    <Route path="perfil" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes


