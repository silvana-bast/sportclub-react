import { useState, useCallback } from "react";
import { Table, Button, Form, Badge, Spinner, Alert } from "react-bootstrap";
import FormModal from "../../components/FormModal";
import { useFetch } from "../../hooks/useFetch";
import {
  listSportRooms,
  createSportRoom,
  updateSportRoom,
  deleteSportRoom,
} from "../../services/sportRoomService";
import { listSports } from "../../services/sportService";
import { listRooms } from "../../services/roomService";
import { listUsers } from "../../services/userService";
import { confirmDelete, notifySuccess, notifyError } from "../../utils/alerts";
import { isRequired } from "../../utils/validators";

const EMPTY_FORM = { sport_id: "", room_id: "", coach_id: "", observation: "" };

function AssignmentsManagement() {
  const {
    data: assignments,
    setData: setAssignments,
    loading,
    error,
  } = useFetch(listSportRooms, []);

  const loadReferenceData = useCallback(async () => {
    const [sports, rooms, users] = await Promise.all([listSports(), listRooms(), listUsers()]);
    return { sports, rooms, coaches: users.filter((user) => user.role === "coach") };
  }, []);

  const { data: referenceData } = useFetch(loadReferenceData, [loadReferenceData]);
  const sports = referenceData?.sports ?? [];
  const rooms = referenceData?.rooms ?? [];
  const coaches = referenceData?.coaches ?? [];

  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setForm({
      sport_id: assignment.sport_id,
      room_id: assignment.room_id,
      coach_id: assignment.coach_id,
      observation: assignment.observation ?? "",
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
    if (!isRequired(form.sport_id) || !isRequired(form.room_id) || !isRequired(form.coach_id)) {
      notifyError("Debe seleccionar deporte, sala y coach.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        sport_id: Number(form.sport_id),
        room_id: Number(form.room_id),
        coach_id: Number(form.coach_id),
        observation: form.observation,
      };

      if (editingAssignment) {
        const updated = await updateSportRoom(editingAssignment.id, payload);
        setAssignments((prev) =>
          prev.map((item) => (item.id === editingAssignment.id ? updated : item))
        );
        notifySuccess("Asignación actualizada correctamente.");
      } else {
        const created = await createSportRoom(payload);
        setAssignments((prev) => [...prev, created]);
        notifySuccess("Asignación creada correctamente.");
      }

      setShowModal(false);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assignment) => {
    const label = `${assignment.sport?.name ?? "deporte"} / ${assignment.room?.name ?? "sala"}`;
    const confirmed = await confirmDelete(`la asignación "${label}"`);
    if (!confirmed) return;

    try {
      await deleteSportRoom(assignment.id);
      notifySuccess("Asignación eliminada correctamente.");
      setAssignments((prev) => prev.filter((item) => item.id !== assignment.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0"><i className="bi bi-diagram-3-fill me-2 text-primary" />Gestión de Asignaciones</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nueva asignación
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
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(assignments ?? []).map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.sport?.name}</td>
                  <td>{assignment.room?.name}</td>
                  <td>{assignment.coach?.full_name}</td>
                  <td>
                    <Badge bg={assignment.status ? "success" : "secondary"}>
                      {assignment.status ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(assignment)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(assignment)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {(assignments ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay asignaciones registradas.
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
        title={editingAssignment ? "Editar asignación" : "Nueva asignación"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingAssignment ? "Guardar cambios" : "Crear asignación"}
      >
        <Form.Group className="mb-3">
          <Form.Label>Deporte</Form.Label>
          <Form.Select value={form.sport_id} onChange={handleChange("sport_id")} required>
            <option value="">Seleccione un deporte</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sala</Form.Label>
          <Form.Select value={form.room_id} onChange={handleChange("room_id")} required>
            <option value="">Seleccione una sala</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Coach</Form.Label>
          <Form.Select value={form.coach_id} onChange={handleChange("coach_id")} required>
            <option value="">Seleccione un coach</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.full_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Observación</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.observation}
            onChange={handleChange("observation")}
          />
        </Form.Group>
      </FormModal>
    </div>
  );
}

export default AssignmentsManagement;
