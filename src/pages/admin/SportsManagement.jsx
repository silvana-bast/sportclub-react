import { useState } from "react";
import { Table, Button, Form, Badge, Alert } from "react-bootstrap";
import PageSpinner from "../../components/PageSpinner";
import FormModal from "../../components/FormModal";
import { useFetch } from "../../hooks/useFetch";
import { listSports, createSport, updateSport, deleteSport } from "../../services/sportService";
import { confirmDelete, confirmAction, notifySuccess, notifyError } from "../../utils/alerts";
import { isRequired, isPositiveInteger } from "../../utils/validators";

const EMPTY_FORM = { name: "", objective: "", duration: "" };

function SportsManagement() {
  const { data: sports, setData: setSports, loading, error } = useFetch(listSports, []);

  const [showModal, setShowModal] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingSport(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (sport) => {
    setEditingSport(sport);
    setForm({ name: sport.name, objective: sport.objective, duration: sport.duration });
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
    if (!isRequired(form.name) || form.name.trim().length < 3) {
      notifyError("El nombre del deporte debe tener al menos 3 caracteres.");
      return;
    }

    if (!isRequired(form.objective) || form.objective.trim().length < 5) {
      notifyError("El objetivo debe tener al menos 5 caracteres.");
      return;
    }

    if (!isPositiveInteger(form.duration)) {
      notifyError("La duración debe ser un número entero mayor a 0.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        objective: form.objective,
        duration: Number(form.duration),
      };

      if (editingSport) {
        const updated = await updateSport(editingSport.id, payload);
        setSports((prev) => prev.map((item) => (item.id === editingSport.id ? updated : item)));
        notifySuccess("Deporte actualizado correctamente.");
      } else {
        const created = await createSport(payload);
        setSports((prev) => [...prev, created]);
        notifySuccess("Deporte creado correctamente.");
      }

      setShowModal(false);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (sport) => {
    const action = sport.status ? "desactivar" : "activar";
    const confirmed = await confirmAction(
      `¿${action.charAt(0).toUpperCase() + action.slice(1)} deporte?`,
      `Se va a ${action} "${sport.name}".`
    );
    if (!confirmed) return;

    try {
      const updated = await updateSport(sport.id, { ...sport, status: !sport.status });
      setSports((prev) => prev.map((item) => (item.id === sport.id ? updated : item)));
      notifySuccess(`Deporte ${sport.status ? "desactivado" : "activado"} correctamente.`);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleDelete = async (sport) => {
    const confirmed = await confirmDelete(`el deporte "${sport.name}"`);
    if (!confirmed) return;

    try {
      await deleteSport(sport.id);
      notifySuccess("Deporte eliminado correctamente.");
      setSports((prev) => prev.filter((item) => item.id !== sport.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0"><i className="bi bi-trophy-fill me-2 text-primary" />Gestión de Deportes</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nuevo deporte
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
                <th>Objetivo</th>
                <th>Duración (min)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(sports ?? []).map((sport) => (
                <tr key={sport.id}>
                  <td>{sport.name}</td>
                  <td>{sport.objective}</td>
                  <td>{sport.duration}</td>
                  <td>
                    <Badge
                      bg={sport.status ? "success" : "secondary"}
                      role="button"
                      onClick={() => handleToggleStatus(sport)}
                    >
                      {sport.status ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(sport)}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sport)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {(sports ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay deportes registrados.
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
        title={editingSport ? "Editar deporte" : "Nuevo deporte"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingSport ? "Guardar cambios" : "Crear deporte"}
      >
        <Form.Group className="mb-3" controlId="sportName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control value={form.name} onChange={handleChange("name")} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="sportObjective">
          <Form.Label>Objetivo</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.objective}
            onChange={handleChange("objective")}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="sportDuration">
          <Form.Label>Duración (minutos)</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={form.duration}
            onChange={handleChange("duration")}
            required
          />
        </Form.Group>
      </FormModal>
    </div>
  );
}

export default SportsManagement;
