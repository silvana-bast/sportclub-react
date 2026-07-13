import { useCallback, useState } from "react";
import { Table, Button, Alert, Badge } from "react-bootstrap";
import PageSpinner from "../../components/PageSpinner";
import { useFetch } from "../../hooks/useFetch";
import { getAvailableClasses } from "../../services/memberService";
import { getMyReservations, createReservation } from "../../services/reservationService";
import { dayLabel } from "../../utils/constants";
import { confirmAction, notifySuccess, notifyError } from "../../utils/alerts";

function AvailableClasses() {
  const [reservingId, setReservingId] = useState(null);

  const loadData = useCallback(async () => {
    const [assignments, reservations] = await Promise.all([
      getAvailableClasses(),
      getMyReservations(),
    ]);
    return { assignments, reservations };
  }, []);

  const { data, setData, loading, error } = useFetch(loadData, [loadData]);

  const scheduleRows = (data?.assignments ?? [])
    .filter((assignment) => assignment.status)
    .flatMap((assignment) =>
      (assignment.schedules ?? [])
        .filter((schedule) => schedule.status)
        .map((schedule) => ({ ...schedule, sportRoom: assignment }))
    );

  const activeReservedScheduleIds = new Set(
    (data?.reservations ?? [])
      .filter((reservation) => reservation.status === "active")
      .map((reservation) => reservation.class_schedule_id)
  );

  const handleReserve = async (schedule) => {
    const sportName = schedule.sportRoom?.sport?.name ?? "esta clase";
    const confirmed = await confirmAction(
      "¿Confirmar reserva?",
      `Vas a reservar ${sportName} el ${dayLabel(schedule.day_of_week)} a las ${schedule.start_time?.substring(0, 5)}.`
    );
    if (!confirmed) return;

    setReservingId(schedule.id);

    try {
      const reservation = await createReservation(schedule.id);
      setData((prev) => ({ ...prev, reservations: [...prev.reservations, reservation] }));
      notifySuccess("Reserva creada correctamente.");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setReservingId(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-calendar2-check-fill me-2 text-primary" />Clases Disponibles</h2>

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
                <th>Coach</th>
                <th>Día</th>
                <th>Horario</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((schedule) => {
                const alreadyReserved = activeReservedScheduleIds.has(schedule.id);
                return (
                  <tr key={schedule.id}>
                    <td>{schedule.sportRoom?.sport?.name}</td>
                    <td>{schedule.sportRoom?.room?.name}</td>
                    <td>{schedule.sportRoom?.coach?.full_name ?? schedule.sportRoom?.coach?.email}</td>
                    <td>{dayLabel(schedule.day_of_week)}</td>
                    <td>
                      {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                    </td>
                    <td>
                      {alreadyReserved ? (
                        <Badge bg="secondary">Ya reservada</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={reservingId === schedule.id}
                          onClick={() => handleReserve(schedule)}
                        >
                          {reservingId === schedule.id ? "Reservando..." : "Reservar"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {scheduleRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No hay clases disponibles por el momento.
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

export default AvailableClasses;
