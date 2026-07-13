import { useState } from "react";
import { Table, Button, Form, Badge, Alert } from "react-bootstrap";
import FormModal from "../../components/FormModal";
import PageSpinner from "../../components/PageSpinner";
import { useFetch } from "../../hooks/useFetch";
import { listUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import { confirmDelete, notifySuccess, notifyError } from "../../utils/alerts";
import { isRequired, isValidEmail, isValidPassword } from "../../utils/validators";

const ROLE_LABEL = {
  admin: "Administrador",
  coach: "Coach",
  user: "Usuario",
};

const ROLE_VARIANT = {
  admin: "danger",
  coach: "warning",
  user: "primary",
};

const EMPTY_FORM = {
  full_name: "",
  email: "",
  password: "",
  role: "user",
  birth_date: "",
};

function UsersManagement() {
  const { data: users, setData: setUsers, loading, error } = useFetch(listUsers, []);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
      birth_date: user.birth_date ? user.birth_date.substring(0, 10) : "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (!isRequired(form.full_name)) {
      notifyError("El nombre completo es obligatorio.");
      return;
    }

    if (!isValidEmail(form.email)) {
      notifyError("Ingrese un correo electrónico válido.");
      return;
    }

    if (!editingUser && !isValidPassword(form.password)) {
      notifyError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        birth_date: form.birth_date || null,
      };

      if (!editingUser) {
        payload.password = form.password;
      }

      if (editingUser) {
        const updated = await updateUser(editingUser.id, payload);
        setUsers((prev) => prev.map((item) => (item.id === editingUser.id ? updated : item)));
        notifySuccess("Usuario actualizado correctamente.");
      } else {
        const created = await createUser(payload);
        setUsers((prev) => [...prev, created]);
        notifySuccess("Usuario creado correctamente.");
      }

      setShowModal(false);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = await confirmDelete(`al usuario "${user.full_name}"`);
    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      notifySuccess("Usuario eliminado correctamente.");
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0"><i className="bi bi-people-fill me-2 text-primary" />Gestión de Usuarios</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nuevo usuario
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={ROLE_VARIANT[user.role] ?? "secondary"}>
                      {ROLE_LABEL[user.role] ?? user.role}
                    </Badge>
                  </td>
                  <td>{user.birth_date ? user.birth_date.substring(0, 10) : "—"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <FormModal
        show={showModal}
        onHide={closeModal}
        title={editingUser ? "Editar usuario" : "Nuevo usuario"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingUser ? "Guardar cambios" : "Crear usuario"}
      >
        <Form.Group className="mb-3" controlId="userFullName">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control value={form.full_name} onChange={handleChange("full_name")} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="userEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
        </Form.Group>

        {!editingUser && (
          <Form.Group className="mb-3" controlId="userPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="userRole">
          <Form.Label>Rol</Form.Label>
          <Form.Select value={form.role} onChange={handleChange("role")}>
            <option value="user">Usuario</option>
            <option value="coach">Coach</option>
            <option value="admin">Administrador</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="userBirthDate">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            type="date"
            value={form.birth_date}
            onChange={handleChange("birth_date")}
          />
        </Form.Group>
      </FormModal>
    </div>
  );
}

export default UsersManagement;
