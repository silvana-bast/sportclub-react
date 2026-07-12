import { Table, Spinner, Alert } from "react-bootstrap";
import { useFetch } from "../../hooks/useFetch";
import { getMySchedules } from "../../services/coachService";
import { dayLabel } from "../../utils/constants";

function MySchedule() {
  const { data: schedules, loading, error } = useFetch(getMySchedules, []);

  const sortedSchedules = [...(schedules ?? [])].sort(
    (a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time)
  );

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-calendar-week-fill me-2 text-primary" />Mi Horario</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : sortedSchedules.length === 0 ? (
        <Alert variant="info">No tienes horarios asignados todavía.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Día</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Deporte</th>
                <th>Sala</th>
              </tr>
            </thead>
            <tbody>
              {sortedSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{dayLabel(schedule.day_of_week)}</td>
                  <td>{schedule.start_time?.substring(0, 5)}</td>
                  <td>{schedule.end_time?.substring(0, 5)}</td>
                  <td>{schedule.sportRoom?.sport?.name}</td>
                  <td>{schedule.sportRoom?.room?.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MySchedule;
