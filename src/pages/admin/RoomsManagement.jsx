import { useState } from "react";
import { Table, Button, Form, Badge, Spinner, Alert, Row, Col } from "react-bootstrap";
import FormModal from "../../components/FormModal";
import { useFetch } from "../../hooks/useFetch";
import { listRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService";
import { confirmDelete, confirmAction, notifySuccess, notifyError } from "../../utils/alerts";
import { isRequired, isPositiveInteger } from "../../utils/validators";

const EMPTY_FORM = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  observation: "",
};

function RoomsManagement() {
  const { data: rooms, setData: setRooms, loading, error } = useFetch(listRooms, []);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingRoom(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description ?? "",
      capacity: room.capacity,
      location: room.location ?? "",
      observation: room.observation ?? "",
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
    if (!isRequired(form.name)) {
      notifyError("El nombre de la sala es obligatorio.");
      return;
    }

    if (!isPositiveInteger(form.capacity)) {
      notifyError("La capacidad debe ser un número entero mayor a 0.");
      return;
    }

    if (!isRequired(form.description) || form.description.trim().length < 5) {
      notifyError("La descripción debe tener al menos 5 caracteres.");
      return;
    }

    if (!isRequired(form.location) || form.location.trim().length < 5) {
      notifyError("La ubicación debe tener al menos 5 caracteres.");
      return;
    }

    if (!isRequired(form.observation) || form.observation.trim().length < 5) {
      notifyError("La observación debe tener al menos 5 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        capacity: Number(form.capacity),
        location: form.location,
        observation: form.observation,
      };

      if (editingRoom) {
        const updated = await updateRoom(editingRoom.id, payload);
        setRooms((prev) => prev.map((item) => (item.id === editingRoom.id ? updated : item)));
        notifySuccess("Sala actualizada correctamente.");
      } else {
        const created = await createRoom(payload);
        setRooms((prev) => [...prev, created]);
        notifySuccess("Sala creada correctamente.");
      }

      setShowModal(false);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (room) => {
    const action = room.status ? "desactivar" : "activar";
    const confirmed = await confirmAction(
      `¿${action.charAt(0).toUpperCase() + action.slice(1)} sala?`,
      `Se va a ${action} "${room.name}".`
    );
    if (!confirmed) return;

    try {
      const updated = await updateRoom(room.id, { ...room, status: !room.status });
      setRooms((prev) => prev.map((item) => (item.id === room.id ? updated : item)));
      notifySuccess(`Sala ${room.status ? "desactivada" : "activada"} correctamente.`);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleDelete = async (room) => {
    const confirmed = await confirmDelete(`la sala "${room.name}"`);
    if (!confirmed) return;

    try {
      await deleteRoom(room.id);
      notifySuccess("Sala eliminada correctamente.");
      setRooms((prev) => prev.filter((item) => item.id !== room.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0"><i className="bi bi-building-fill me-2 text-primary" />Gestión de Salas</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nueva sala
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(rooms ?? []).map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.location || "—"}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <Badge
                      bg={room.status ? "success" : "secondary"}
                      role="button"
                      onClick={() => handleToggleStatus(room)}
                    >
                      {room.status ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(room)}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(room)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {(rooms ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay salas registradas.
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
        title={editingRoom ? "Editar sala" : "Nueva sala"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingRoom ? "Guardar cambios" : "Crear sala"}
      >
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control value={form.name} onChange={handleChange("name")} required />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.capacity}
              onChange={handleChange("capacity")}
              required
            />
          </Col>
          <Col>
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              value={form.location}
              onChange={handleChange("location")}
              minLength={5}
              required
            />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.description}
            onChange={handleChange("description")}
            minLength={5}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Observación</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.observation}
            onChange={handleChange("observation")}
            minLength={5}
            required
          />
        </Form.Group>
      </FormModal>
    </div>
  );
}

export default RoomsManagement;
