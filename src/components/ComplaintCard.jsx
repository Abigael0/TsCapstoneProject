import { ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const priorityClasses = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ComplaintCard({
  complaint,
  onView,
}) {
  return (
    <article className="complaint-card">
      <div className="complaint-card-header">
        <span className="ticket-number">
          {complaint.ticketNumber || complaint.id}
        </span>

        <StatusBadge status={complaint.status} />
      </div>

      <div className="complaint-card-body">
        <h3>{complaint.subject}</h3>

        <p className="complaint-card-description">
          {complaint.description || "No description provided."}
        </p>

        <div className="complaint-card-meta">
          <div>
            <span>Category</span>
            <strong>{complaint.category || "—"}</strong>
          </div>

          <div>
            <span>Priority</span>
            <strong className={priorityClasses[complaint.priority] || ""}>
              {complaint.priority || "—"}
            </strong>
          </div>

          <div>
            <span>Submitted</span>
            <strong>{formatDate(complaint.createdAt)}</strong>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="complaint-card-action"
        onClick={() => onView?.(complaint)}
      >
        View complaint
        <ArrowRight size={17} />
      </button>
    </article>
  );
}