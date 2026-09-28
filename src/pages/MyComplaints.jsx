import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import ComplaintCard from "../components/ComplaintCard";
import StatusBadge from "../components/StatusBadge";

const statuses = [
  "All",
  "Pending",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyComplaints({
  user,
  complaints = [],
  onViewComplaint,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const userComplaints = useMemo(
    () =>
      complaints.filter(
        (complaint) =>
          complaint.submittedBy === user?.email?.toLowerCase()
      ),
    [complaints, user?.email]
  );

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return userComplaints.filter((complaint) => {
      const matchesStatus =
        status === "All" || complaint.status === status;

      const matchesSearch =
        !query ||
        complaint.subject?.toLowerCase().includes(query) ||
        complaint.ticketNumber?.toLowerCase().includes(query) ||
        complaint.category?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [userComplaints, search, status]);

  return (
    <section className="complaints-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">History</p>
          <h1>My Complaints</h1>
          <p>
            View and track all complaints submitted from your account.
          </p>
        </div>
      </div>

      <div className="complaints-toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search complaints..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="status-filter">
          <SlidersHorizontal size={17} />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <h2>
            {userComplaints.length === 0
              ? "No complaints yet"
              : "No matching complaints"}
          </h2>

          <p>
            {userComplaints.length === 0
              ? "Your submitted complaints will appear here."
              : "Try changing your search or status filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="complaint-card-list">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={onViewComplaint}
              />
            ))}
          </div>

          <div className="complaints-desktop-table">
            <div className="table-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>
                        <span className="ticket-number">
                          {complaint.ticketNumber || complaint.id}
                        </span>
                      </td>

                      <td>
                        <span className="complaint-subject">
                          {complaint.subject}
                        </span>
                      </td>

                      <td>{complaint.category || "—"}</td>

                      <td
                        className={`priority-${complaint.priority?.toLowerCase()}`}
                      >
                        {complaint.priority || "—"}
                      </td>

                      <td>
                        <StatusBadge status={complaint.status} />
                      </td>

                      <td>
                        <span className="submitted-date">
                          {formatDate(complaint.createdAt)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="view-button"
                          onClick={() => onViewComplaint?.(complaint)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}