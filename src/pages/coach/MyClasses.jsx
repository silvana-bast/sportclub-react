import { Table, Badge, Spinner, Alert, Card } from "react-bootstrap";
import { useFetch } from "../../hooks/useFetch";
import { getMyClasses } from "../../services/coachService";
import { dayLabel } from "../../utils/constants";

function MyClasses() {
  const { data: assignments, loading, error } = useFetch(getMyClasses, []);

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-trophy-fill me-2 text-primary" />Mis Clases</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (assignments ?? []).length === 0 ? (
        <Alert variant="info">Aún no tienes clases asignadas.</Alert>
      ) : (
        <div className="d-flex flex-column gap-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title>{assignment.sport?.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {assignment.room?.name} — {assignment.room?.location}
                    </Card.Subtitle>
                    {assignment.observation && <Card.Text>{assignment.observation}</Card.Text>}
                  </div>
                  <Badge bg={assignment.status ? "success" : "secondary"}>
                    {assignment.status ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <Table size="sm" className="mt-3 mb-0">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Inicio</th>
                      <th>Término</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(assignment.schedules ?? []).map((schedule) => (
                      <tr key={schedule.id}>
                        <td>{dayLabel(schedule.day_of_week)}</td>
                        <td>{schedule.start_time?.substring(0, 5)}</td>
                        <td>{schedule.end_time?.substring(0, 5)}</td>
                      </tr>
                    ))}
                    {(assignment.schedules ?? []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-muted">
                          Sin horarios asignados todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClasses;
