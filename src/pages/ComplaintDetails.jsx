import {
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ComplaintDetails({
  complaints = [],
  user,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const complaint = complaints.find(
    (item) => String(item.id) === String(id)
  );

  if (!complaint) {
    return (
      <section className="details-page">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="not-found-card">
          <h1>Complaint not found</h1>
          <p>
            The complaint may have been removed or is not available
            to your account.
          </p>

          <Button onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </section>
    );
  }

  const isOwner =
    user?.role === "admin" ||
    complaint.submittedBy === user?.id;

  if (!isOwner) {
    return (
      <section className="details-page">
        <div className="not-found-card">
          <h1>Access denied</h1>
          <p>
            You do not have permission to view this complaint.
          </p>

          <Button onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="details-page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="details-header">
        <div>
          <span className="ticket-number">
            {complaint.ticketNumber || complaint.id}
          </span>

          <h1>{complaint.subject}</h1>

          <p>
            Submitted {formatDate(complaint.createdAt)}
          </p>
        </div>

        <StatusBadge status={complaint.status} />
      </div>

      <div className="details-layout">
        <main className="details-main">
          <section className="details-card">
            <div className="details-card-header">
              <MessageSquare size={19} />
              <h2>Complaint description</h2>
            </div>

            <p className="details-description">
              {complaint.description}
            </p>
          </section>

          {complaint.feedback && (
            <section className="details-card">
              <div className="details-card-header">
                <MessageSquare size={19} />
                <h2>Response</h2>
              </div>

              <p className="details-description">
                {complaint.feedback}
              </p>
            </section>
          )}
        </main>

        <aside className="details-sidebar">
          <section className="details-card">
            <h2>Complaint information</h2>

            <div className="details-info-list">
              <div>
                <span>Category</span>
                <strong>{complaint.category || "—"}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{complaint.priority || "—"}</strong>
              </div>

              <div>
                <span>Status</span>
                <StatusBadge status={complaint.status} />
              </div>

              <div>
                <span>
                  <User size={15} />
                  User ID
                </span>
                <strong>{complaint.submittedBy || "—"}</strong>
              </div>

              <div>
                <span>
                  <CalendarDays size={15} />
                  Submitted
                </span>
                <strong>{formatDate(complaint.createdAt)}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}