
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "../../components/ui";
import { api } from "../../services/api";

const STATUS_OPTIONS = [
  "submitted",
  "acknowledged",
  "in_progress",
  "resolved",
  "rejected",
  "closed",
];

const PRIORITY_OPTIONS = [
  "low",
  "medium",
  "high",
  "urgent",
];

const STATUS_LABELS = {
  submitted: "Submitted",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  closed: "Closed",
};

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

function formatPriority(priority) {
  return PRIORITY_LABELS[priority] || priority;
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "submitted":
      return "bg-slate-100 text-slate-700";

    case "acknowledged":
      return "bg-blue-100 text-blue-700";

    case "in_progress":
      return "bg-amber-100 text-amber-700";

    case "resolved":
      return "bg-emerald-100 text-emerald-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "closed":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case "low":
      return "bg-slate-100 text-slate-700";

    case "medium":
      return "bg-blue-100 text-blue-700";

    case "high":
      return "bg-orange-100 text-orange-700";

    case "urgent":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClass(
        priority
      )}`}
    >
      {formatPriority(priority)}
    </span>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />

      <h2 className="mt-4 font-semibold text-slate-900">
        {hasFilters
          ? "No matching grievances"
          : "No grievances found"}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {hasFilters
          ? "Try changing the search or filter options."
          : "Citizen grievances will appear here once submitted."}
      </p>
    </div>
  );
}

export default function GrievancesAdmin() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [selectedGrievance, setSelectedGrievance] =
    useState(null);

  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  const loadGrievances = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminGrievances();

      const entries =
        response.data?.grievances || [];

      setGrievances(entries);
    } catch (err) {
      console.error("Failed to load grievances:", err);

      setError(
        err.message ||
          "Unable to load grievances. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const filteredGrievances = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return grievances.filter((grievance) => {
      const matchesSearch =
        !normalizedSearch ||
        grievance.ticket_number
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        grievance.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        grievance.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        grievance.category
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        grievance.subject
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        grievance.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        grievance.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    grievances,
    search,
    statusFilter,
    priorityFilter,
  ]);

  const openDetails = (grievance) => {
    setSelectedGrievance(grievance);

    setEditStatus(grievance.status || "submitted");
    setEditPriority(grievance.priority || "medium");
    setEditAssignedTo(
      grievance.assigned_to || ""
    );
  };

  const closeDetails = () => {
    if (savingId) return;

    setSelectedGrievance(null);
    setEditStatus("");
    setEditPriority("");
    setEditAssignedTo("");
  };

  const saveChanges = async () => {
    if (!selectedGrievance) return;

    try {
      setSavingId(selectedGrievance.id);
      setError("");

      const payload = {
        status: editStatus,
        priority: editPriority,
        assigned_to:
          editAssignedTo.trim() || null,
      };

      const response =
        await api.updateAdminGrievance(
          selectedGrievance.id,
          payload
        );

      const updatedGrievance =
        response.data?.grievance;

      if (updatedGrievance) {
        setGrievances((current) =>
          current.map((item) =>
            item.id === updatedGrievance.id
              ? updatedGrievance
              : item
          )
        );

        setSelectedGrievance(updatedGrievance);
      } else {
        await loadGrievances();
      }
    } catch (err) {
      console.error(
        "Failed to update grievance:",
        err
      );

      setError(
        err.message ||
          "Unable to update grievance."
      );
    } finally {
      setSavingId(null);
    }
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    priorityFilter !== "all";

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="page-x">
        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Grievances
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review, assign and manage citizen grievances.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={loadGrievances}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ================= FILTERS ================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search ticket, citizen, subject..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">
                All statuses
              </option>

              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">
                All priorities
              </option>

              {PRIORITY_OPTIONS.map((priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {formatPriority(priority)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Total
              </p>

              <ClipboardList className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {grievances.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Open
              </p>

              <Clock3 className="h-5 w-5 text-amber-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                grievances.filter(
                  (item) =>
                    item.status !== "resolved" &&
                    item.status !== "rejected" &&
                    item.status !== "closed"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Urgent
              </p>

              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                grievances.filter(
                  (item) =>
                    item.priority === "urgent"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Resolved
              </p>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                grievances.filter(
                  (item) =>
                    item.status === "resolved" ||
                    item.status === "closed"
                ).length
              }
            </p>
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading grievances...
              </div>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <div className="p-5">
              <EmptyState
                hasFilters={hasFilters}
              />
            </div>
          ) : (
            <>
              {/* Desktop */}

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Ticket
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Citizen
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Grievance
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredGrievances.map(
                      (grievance) => (
                        <tr
                          key={grievance.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 align-top">
                            <p className="font-semibold text-slate-900">
                              {grievance.ticket_number}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(
                                grievance.submitted_at
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="font-medium text-slate-800">
                              {grievance.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {grievance.mobile ||
                                grievance.email ||
                                "No contact"}
                            </p>
                          </td>

                          <td className="max-w-xs px-5 py-4 align-top">
                            <p className="font-medium text-slate-800">
                              {grievance.subject ||
                                grievance.category}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {grievance.description}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <PriorityBadge
                              priority={
                                grievance.priority
                              }
                            />
                          </td>

                          <td className="px-5 py-4 align-top">
                            <StatusBadge
                              status={
                                grievance.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-right align-top">
                            <button
                              type="button"
                              onClick={() =>
                                openDetails(
                                  grievance
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredGrievances.map(
                  (grievance) => (
                    <div
                      key={grievance.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {grievance.ticket_number}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(
                              grievance.submitted_at
                            )}
                          </p>
                        </div>

                        <PriorityBadge
                          priority={
                            grievance.priority
                          }
                        />
                      </div>

                      <div className="mt-4">
                        <p className="font-medium text-slate-800">
                          {grievance.subject ||
                            grievance.category}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {grievance.name}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {grievance.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <StatusBadge
                          status={
                            grievance.status
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            openDetails(
                              grievance
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= DETAILS MODAL ================= */}

        {selectedGrievance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Grievance
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedGrievance.ticket_number}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDetails}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close grievance details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-5">
                {/* Citizen */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-slate-500" />

                    <h3 className="font-semibold text-slate-900">
                      Citizen information
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">
                        Name
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {selectedGrievance.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Mobile
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {selectedGrievance.mobile ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {selectedGrievance.email ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Submitted
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {formatDate(
                          selectedGrievance.submitted_at
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grievance */}

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {selectedGrievance.subject ||
                        selectedGrievance.category}
                    </h3>

                    <PriorityBadge
                      priority={
                        selectedGrievance.priority
                      }
                    />

                    <StatusBadge
                      status={
                        selectedGrievance.status
                      }
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Category:{" "}
                    <span className="font-medium text-slate-700">
                      {selectedGrievance.category}
                    </span>
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {selectedGrievance.description}
                    </p>
                  </div>

                  {selectedGrievance.location && (
                    <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                      <span>
                        {selectedGrievance.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Management */}

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <h3 className="font-semibold text-slate-900">
                    Manage grievance
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        Status
                      </span>

                      <select
                        value={editStatus}
                        onChange={(event) =>
                          setEditStatus(
                            event.target.value
                          )
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        {STATUS_OPTIONS.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(status)}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        Priority
                      </span>

                      <select
                        value={editPriority}
                        onChange={(event) =>
                          setEditPriority(
                            event.target.value
                          )
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        {PRIORITY_OPTIONS.map(
                          (priority) => (
                            <option
                              key={priority}
                              value={priority}
                            >
                              {formatPriority(
                                priority
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-medium text-slate-700">
                      Assigned staff user ID
                    </span>

                    <input
                      type="text"
                      value={editAssignedTo}
                      onChange={(event) =>
                        setEditAssignedTo(
                          event.target.value
                        )
                      }
                      placeholder="UUID of assigned admin/staff user"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <p className="mt-1 text-xs text-slate-500">
                      Leave blank to remove the current assignment.
                    </p>
                  </label>
                </div>

                {/* Existing timestamps */}

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Acknowledged
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(
                        selectedGrievance.acknowledged_at
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Resolved
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(
                        selectedGrievance.resolved_at
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Closed
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(
                        selectedGrievance.closed_at
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal footer */}

              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDetails}
                  disabled={Boolean(savingId)}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={saveChanges}
                  disabled={Boolean(savingId)}
                >
                  {savingId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
