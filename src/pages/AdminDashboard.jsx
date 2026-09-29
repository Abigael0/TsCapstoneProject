import { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  async function fetchComplaints() {
    try {
      setError("");

      const data = await api.getComplaints();

      setComplaints(data);
    } catch (err) {
      setError(err.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  fetchComplaints();
}, []);

  function openComplaint(complaint) {
    setSelectedComplaint(complaint);
    setFeedback(complaint.feedback || "");
  }

  function closeComplaint() {
    setSelectedComplaint(null);
    setFeedback("");
  }

  async function handleResolve() {
    if (!selectedComplaint) return;

    try {
      setResolving(true);
      setError("");

      const updatedComplaint = await api.resolveComplaint(
        selectedComplaint.id,
        feedback.trim()
      );

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.id === updatedComplaint.id
            ? updatedComplaint
            : complaint
        )
      );

      setSelectedComplaint(updatedComplaint);
    } catch (err) {
      setError(err.message || "Unable to resolve complaint.");
    } finally {
      setResolving(false);
    }
  }

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const progressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <section className="page-container">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p>Loading complaints...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container admin-dashboard">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage complaints and respond to submitted requests.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="admin-stat-grid">
        <div className="stat-card">
          <span>Total Complaints</span>
          <strong>{complaints.length}</strong>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <strong>{progressCount}</strong>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Complaints</h2>
            <p>Review complaints submitted by users.</p>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="empty-state">
            <h3>No complaints yet</h3>
            <p>
              Complaints submitted by users will appear here.
            </p>
          </div>
        ) : (
          <div className="complaints-table-wrapper">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Submitted By</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <strong>{complaint.ticketNumber}</strong>
                    </td>

                    <td>{complaint.userId || complaint.submittedBy || "—"}</td>

                    <td>{complaint.subject}</td>
                    <td>{complaint.category}</td>

                    <td>
                      <span
                        className={`priority priority-${String(
                          complaint.priority
                        ).toLowerCase()}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td>
                      {new Date(
                        complaint.createdAt
                      ).toLocaleString()}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => openComplaint(complaint)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={closeComplaint}
        >
          <div
            className="modal complaint-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-ticket">
                  {selectedComplaint.ticketNumber}
                </span>

                <h2>{selectedComplaint.subject}</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeComplaint}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="complaint-meta">
              <div>
                <span>Submitted By</span>
                <strong>
                  {selectedComplaint.userId || selectedComplaint.submittedBy || "—"}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {selectedComplaint.category}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>
                  {selectedComplaint.priority}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <StatusBadge
                  status={selectedComplaint.status}
                />
              </div>
            </div>

            <div className="complaint-description">
              <h3>Description</h3>
              <p>{selectedComplaint.description}</p>
            </div>

            <div className="complaint-date">
              Submitted{" "}
              {new Date(
                selectedComplaint.createdAt
              ).toLocaleString()}
            </div>

            {selectedComplaint.status !== "Resolved" && (
              <div className="feedback-section">
                <label htmlFor="admin-feedback">
                  Feedback to user
                </label>

                <textarea
                  id="admin-feedback"
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(event.target.value)
                  }
                  placeholder="Enter a response or resolution message..."
                  rows={5}
                />

                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleResolve}
                  disabled={resolving}
                >
                  {resolving
                    ? "Resolving..."
                    : "Resolve Complaint"}
                </button>
              </div>
            )}

            {selectedComplaint.status === "Resolved" && (
              <div className="resolved-feedback">
                <h3>Resolution Feedback</h3>
                <p>
                  {selectedComplaint.feedback ||
                    "No feedback was provided."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}