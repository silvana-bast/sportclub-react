import { Table, Button, Alert, Badge } from "react-bootstrap";
import PageSpinner from "../../components/PageSpinner";
import { useFetch } from "../../hooks/useFetch";
import { getMyReservations, cancelReservation } from "../../services/reservationService";
import { dayLabel } from "../../utils/constants";
import { confirmAction, notifySuccess, notifyError } from "../../utils/alerts";

const STATUS_LABEL = {
  active: "Activa",
  cancelled: "Cancelada",
};

const STATUS_VARIANT = {
  active: "success",
  cancelled: "secondary",
};

function MyReservations() {
  const { data: reservations, setData: setReservations, loading, error } = useFetch(
    getMyReservations,
    []
  );

  const handleCancel = async (reservation) => {
    const schedule = reservation.classSchedule;
    const sportName = schedule?.sportRoom?.sport?.name ?? "esta reserva";
    const confirmed = await confirmAction("¿Cancelar reserva?", `Vas a cancelar ${sportName}.`);
    if (!confirmed) return;

    try {
      const updated = await cancelReservation(reservation.id);
      setReservations((prev) =>
        prev.map((item) => (item.id === reservation.id ? updated : item))
      );
      notifySuccess("Reserva cancelada correctamente.");
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-bookmark-check-fill me-2 text-primary" />Mis Reservas</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(reservations ?? []).map((reservation) => {
                const schedule = reservation.classSchedule;
                return (
                  <tr key={reservation.id}>
                    <td>{schedule?.sportRoom?.sport?.name}</td>
                    <td>{schedule?.sportRoom?.room?.name}</td>
                    <td>{dayLabel(schedule?.day_of_week)}</td>
                    <td>
                      {schedule?.start_time?.substring(0, 5)} -{" "}
                      {schedule?.end_time?.substring(0, 5)}
                    </td>
                    <td>
                      <Badge bg={STATUS_VARIANT[reservation.status] ?? "secondary"}>
                        {STATUS_LABEL[reservation.status] ?? reservation.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={reservation.status !== "active"}
                        onClick={() => handleCancel(reservation)}
                      >
                        Cancelar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {(reservations ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Aún no tienes reservas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MyReservations;
