import {
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadComplaint() {
      try {
        setLoading(true);
        setError("");

        const response = await api.getComplaint(id);

        setComplaint(response.complaint);
      } catch (requestError) {
        console.error("GET COMPLAINT ERROR:", requestError);

        setError(
          requestError.message ||
            "Unable to load this complaint. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadComplaint();
    } else {
      setLoading(false);
      setError("Complaint ID is missing.");
    }
  }, [id]);

  if (loading) {
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
          <h1>Loading complaint...</h1>
          <p>Please wait while we retrieve the complaint.</p>
        </div>
      </section>
    );
  }

  if (error || !complaint) {
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
            {error ||
              "The complaint may have been removed or is not available to your account."}
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
            {complaint.complaintId}
          </span>

          <h1>{complaint.title}</h1>

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
                  Submitted By
                </span>

                <strong>
                  {complaint.submittedBy?.firstName &&
                  complaint.submittedBy?.lastName
                    ? `${complaint.submittedBy.firstName} ${complaint.submittedBy.lastName}`
                    : complaint.submittedBy?.email || "—"}
                </strong>
              </div>

              <div>
                <span>
                  <CalendarDays size={15} />
                  Submitted
                </span>

                <strong>
                  {formatDate(complaint.createdAt)}
                </strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
