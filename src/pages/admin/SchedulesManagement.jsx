import { useState } from "react";
import { Table, Button, Form, Badge, Spinner, Alert, Row, Col } from "react-bootstrap";
import FormModal from "../../components/FormModal";
import { useFetch } from "../../hooks/useFetch";
import {
  listClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} from "../../services/classScheduleService";
import { listSportRooms } from "../../services/sportRoomService";
import { confirmDelete, notifySuccess, notifyError } from "../../utils/alerts";
import { isRequired } from "../../utils/validators";
import { DAYS_OF_WEEK, dayLabel } from "../../utils/constants";

const EMPTY_FORM = { sport_room_id: "", day_of_week: "1", start_time: "", end_time: "" };

const assignmentLabel = (assignment) =>
  `${assignment.sport?.name ?? "?"} · ${assignment.room?.name ?? "?"} · ${assignment.coach?.full_name ?? "?"}`;

function SchedulesManagement() {
  const {
    data: schedules,
    setData: setSchedules,
    loading,
    error,
  } = useFetch(listClassSchedules, []);

  const { data: assignments } = useFetch(listSportRooms, []);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingSchedule(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setForm({
      sport_room_id: schedule.sport_room_id,
      day_of_week: String(schedule.day_of_week),
      start_time: schedule.start_time?.substring(0, 5) ?? "",
      end_time: schedule.end_time?.substring(0, 5) ?? "",
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
    if (!isRequired(form.sport_room_id)) {
      notifyError("Debe seleccionar una asignación (deporte + sala + coach).");
      return;
    }

    if (!form.start_time || !form.end_time) {
      notifyError("Debe indicar hora de inicio y término.");
      return;
    }

    if (form.start_time >= form.end_time) {
      notifyError("La hora de término debe ser posterior a la hora de inicio.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        sport_room_id: Number(form.sport_room_id),
        day_of_week: Number(form.day_of_week),
        start_time: `${form.start_time}:00`,
        end_time: `${form.end_time}:00`,
      };

      if (editingSchedule) {
        const updated = await updateClassSchedule(editingSchedule.id, payload);
        setSchedules((prev) =>
          prev.map((item) => (item.id === editingSchedule.id ? updated : item))
        );
        notifySuccess("Horario actualizado correctamente.");
      } else {
        const created = await createClassSchedule(payload);
        setSchedules((prev) => [...prev, created]);
        notifySuccess("Horario creado correctamente.");
      }

      setShowModal(false);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (schedule) => {
    const confirmed = await confirmDelete(
      `el horario del ${dayLabel(schedule.day_of_week)} ${schedule.start_time?.substring(0, 5)}`
    );
    if (!confirmed) return;

    try {
      await deleteClassSchedule(schedule.id);
      notifySuccess("Horario eliminado correctamente.");
      setSchedules((prev) => prev.filter((item) => item.id !== schedule.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0"><i className="bi bi-calendar-week-fill me-2 text-primary" />Gestión de Horarios</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nuevo horario
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
                <th>Asignación</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(schedules ?? []).map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.sportRoom ? assignmentLabel(schedule.sportRoom) : "—"}</td>
                  <td>{dayLabel(schedule.day_of_week)}</td>
                  <td>{schedule.start_time?.substring(0, 5)}</td>
                  <td>{schedule.end_time?.substring(0, 5)}</td>
                  <td>
                    <Badge bg={schedule.status ? "success" : "secondary"}>
                      {schedule.status ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(schedule)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(schedule)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {(schedules ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No hay horarios registrados.
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
        title={editingSchedule ? "Editar horario" : "Nuevo horario"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingSchedule ? "Guardar cambios" : "Crear horario"}
      >
        <Form.Group className="mb-3">
          <Form.Label>Asignación (Deporte · Sala · Coach)</Form.Label>
          <Form.Select value={form.sport_room_id} onChange={handleChange("sport_room_id")} required>
            <option value="">Seleccione una asignación</option>
            {(assignments ?? []).map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignmentLabel(assignment)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Día de la semana</Form.Label>
          <Form.Select value={form.day_of_week} onChange={handleChange("day_of_week")}>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label>Hora inicio</Form.Label>
            <Form.Control
              type="time"
              value={form.start_time}
              onChange={handleChange("start_time")}
              required
            />
          </Col>
          <Col>
            <Form.Label>Hora término</Form.Label>
            <Form.Control
              type="time"
              value={form.end_time}
              onChange={handleChange("end_time")}
              required
            />
          </Col>
        </Row>
      </FormModal>
    </div>
  );
}

export default SchedulesManagement;
