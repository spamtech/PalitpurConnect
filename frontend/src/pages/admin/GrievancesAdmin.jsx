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
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-xl px-3 py-1 text-[10px] font-black border-2 border-[#221208] shadow-[2px_2px_0_#221208] uppercase tracking-wider ${
        status === "submitted"
          ? "bg-[#faebd7] text-[#221208]"
          : status === "acknowledged"
          ? "bg-blue-200 text-blue-900"
          : status === "in_progress"
          ? "bg-[#e68a45] text-[#221208]"
          : status === "resolved"
          ? "bg-[#b8d85a] text-[#221208]"
          : status === "rejected"
          ? "bg-red-200 text-red-900"
          : "bg-purple-200 text-purple-900"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex rounded-xl px-3 py-1 text-[10px] font-black border-2 border-[#221208] shadow-[2px_2px_0_#221208] uppercase tracking-wider ${
        priority === "low"
          ? "bg-[#faebd7] text-[#221208]"
          : priority === "medium"
          ? "bg-blue-200 text-blue-900"
          : priority === "high"
          ? "bg-orange-200 text-orange-900"
          : "bg-red-200 text-red-900"
      }`}
    >
      {formatPriority(priority)}
    </span>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="rounded-[24px] border-[3px] border-[#221208] bg-white p-12 text-center text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.2)]">
      <ClipboardList className="mx-auto h-10 w-10 text-[#4a2512]" />

      <h2 className="mt-4 text-base font-black text-[#221208]">
        {hasFilters
          ? "No matching grievances"
          : "No grievances found"}
      </h2>

      <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
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
      const entries = response.data?.grievances || [];

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
    const normalizedSearch = search.trim().toLowerCase();

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
    setEditAssignedTo(grievance.assigned_to || "");
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
        assigned_to: editAssignedTo.trim() || null,
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
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-12 space-y-10">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-6 rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[10px_10px_0_rgba(34,18,8,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-[#e68a45]" />
              <span>Grievances Control 📋</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#faebd7] sm:text-4xl">
              Grievances Management
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-[#eddcd2]">
              Review, assign and manage citizen grievances efficiently.
            </p>
          </div>

          <button
            type="button"
            onClick={loadGrievances}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#221208] bg-[#e68a45] px-6 py-3.5 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition-all hover:-translate-y-0.5 hover:bg-[#f4a261] disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
              strokeWidth={2.5}
            />
            Refresh
          </button>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="rounded-[24px] border-[3px] border-[#221208] bg-red-100 p-6 text-red-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black">Error</p>
            <p className="mt-1 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* ================= FILTERS ================= */}
        <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a2512]" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search ticket, citizen, subject..."
                className="h-11 w-full rounded-xl border-2 border-[#221208] bg-white pl-11 pr-4 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border-2 border-[#221208] bg-white px-4 text-sm font-black text-[#221208] outline-none focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="h-11 rounded-xl border-2 border-[#221208] bg-white px-4 text-sm font-black text-[#221208] outline-none focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer"
            >
              <option value="all">All priorities</option>
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {formatPriority(priority)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5a321a]">
                Total
              </p>
              <ClipboardList className="h-5 w-5 text-[#4a2512]" />
            </div>
            <p className="mt-3 text-3xl font-black text-[#221208]">
              {grievances.length}
            </p>
          </div>

          <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5a321a]">
                Open
              </p>
              <Clock3 className="h-5 w-5 text-amber-700" />
            </div>
            <p className="mt-3 text-3xl font-black text-[#221208]">
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

          <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5a321a]">
                Urgent
              </p>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="mt-3 text-3xl font-black text-[#221208]">
              {
                grievances.filter(
                  (item) => item.priority === "urgent"
                ).length
              }
            </p>
          </div>

          <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5a321a]">
                Resolved
              </p>
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <p className="mt-3 text-3xl font-black text-[#221208]">
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
        <div className="rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-black text-[#221208]">
                <Loader2 className="h-6 w-6 animate-spin text-[#4a2512]" />
                Loading grievances...
              </div>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="border-b-2 border-[#221208]/20 bg-[#4a2512] text-[#faebd7]">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider">
                        Citizen
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider">
                        Grievance
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y-2 divide-[#221208]/15">
                    {filteredGrievances.map((grievance) => (
                      <tr
                        key={grievance.id}
                        className="transition hover:bg-[#fff5eb]"
                      >
                        <td className="px-5 py-4 align-top">
                          <p className="font-black text-[#221208]">
                            {grievance.ticket_number}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#5a321a]">
                            {formatDate(grievance.submitted_at)}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <p className="font-bold text-[#221208]">
                            {grievance.name}
                          </p>
                          <p className="mt-1 text-xs font-medium text-[#5a321a]">
                            {grievance.mobile ||
                              grievance.email ||
                              "No contact"}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4 align-top">
                          <p className="font-bold text-[#221208]">
                            {grievance.subject || grievance.category}
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-[#5a321a]">
                            {grievance.description}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <PriorityBadge priority={grievance.priority} />
                        </td>

                        <td className="px-5 py-4 align-top">
                          <StatusBadge status={grievance.status} />
                        </td>

                        <td className="px-5 py-4 text-right align-top">
                          <button
                            type="button"
                            onClick={() => openDetails(grievance)}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-white px-4 py-2 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45]"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2.5} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="space-y-4 md:hidden">
                {filteredGrievances.map((grievance) => (
                  <div
                    key={grievance.id}
                    className="rounded-[20px] border-2 border-[#221208] bg-white p-5 text-[#221208] shadow-[4px_4px_0_#221208]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[#221208]">
                          {grievance.ticket_number}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#5a321a]">
                          {formatDate(grievance.submitted_at)}
                        </p>
                      </div>
                      <PriorityBadge priority={grievance.priority} />
                    </div>

                    <div className="mt-4">
                      <p className="font-bold text-[#221208]">
                        {grievance.subject || grievance.category}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#5a321a]">
                        {grievance.name}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs font-medium text-[#5a321a]">
                        {grievance.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t-2 border-slate-100">
                      <StatusBadge status={grievance.status} />
                      <button
                        type="button"
                        onClick={() => openDetails(grievance)}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#221208] bg-[#faebd7] px-3.5 py-2 text-xs font-black text-[#221208] shadow-[2px_2px_0_#221208]"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= DETAILS MODAL ================= */}
        {selectedGrievance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] text-[#221208] shadow-[15px_15px_0_rgba(34,18,8,0.4)]">
              <div className="sticky top-0 flex items-start justify-between border-b-2 border-[#221208]/20 bg-[#4a2512] px-6 py-5 text-[#faebd7]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#e68a45]">
                    Grievance Ticket
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#faebd7]">
                    {selectedGrievance.ticket_number}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDetails}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#faebd7] text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45]"
                  aria-label="Close grievance details"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* Citizen */}
                <div className="rounded-2xl border-2 border-[#221208] bg-white p-5 shadow-[4px_4px_0_#221208]">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-[#4a2512]" />
                    <h3 className="font-black text-[#221208]">
                      Citizen information
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs sm:text-sm font-medium">
                    <div>
                      <p className="font-black text-[#5a321a]">Name</p>
                      <p className="mt-1 font-bold text-[#221208]">
                        {selectedGrievance.name}
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-[#5a321a]">Mobile</p>
                      <p className="mt-1 flex items-center gap-2 font-bold text-[#221208]">
                        <Phone className="h-4 w-4 text-[#e68a45]" />
                        {selectedGrievance.mobile || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-[#5a321a]">Email</p>
                      <p className="mt-1 font-bold text-[#221208] break-all">
                        {selectedGrievance.email || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-[#5a321a]">Submitted</p>
                      <p className="mt-1 font-bold text-[#221208]">
                        {formatDate(selectedGrievance.submitted_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grievance */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black text-[#221208]">
                      {selectedGrievance.subject || selectedGrievance.category}
                    </h3>
                    <PriorityBadge priority={selectedGrievance.priority} />
                    <StatusBadge status={selectedGrievance.status} />
                  </div>

                  <p className="mt-2 text-xs sm:text-sm font-medium text-[#5a321a]">
                    Category: <span className="font-black text-[#221208]">{selectedGrievance.category}</span>
                  </p>

                  <div className="mt-4 rounded-2xl border-2 border-[#221208] bg-white p-5 shadow-[4px_4px_0_#221208]">
                    <p className="whitespace-pre-wrap text-xs sm:text-sm font-medium leading-relaxed text-[#221208]">
                      {selectedGrievance.description}
                    </p>
                  </div>

                  {selectedGrievance.location && (
                    <div className="mt-4 flex items-start gap-2 text-xs sm:text-sm font-bold text-[#5a321a]">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e68a45]" />
                      <span>{selectedGrievance.location}</span>
                    </div>
                  )}
                </div>

                {/* Management */}
                <div className="rounded-2xl border-2 border-[#221208] bg-[#4a2512] p-6 text-[#faebd7] shadow-[6px_6px_0_#221208]">
                  <h3 className="font-black text-base text-[#faebd7]">
                    Manage grievance
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs sm:text-sm font-black text-[#eddcd2]">
                        Status
                      </span>
                      <select
                        value={editStatus}
                        onChange={(event) =>
                          setEditStatus(event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-xl border-2 border-[#221208] bg-white px-3 text-sm font-black text-[#221208] outline-none focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs sm:text-sm font-black text-[#eddcd2]">
                        Priority
                      </span>
                      <select
                        value={editPriority}
                        onChange={(event) =>
                          setEditPriority(event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-xl border-2 border-[#221208] bg-white px-3 text-sm font-black text-[#221208] outline-none focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer"
                      >
                        {PRIORITY_OPTIONS.map((priority) => (
                          <option key={priority} value={priority}>
                            {formatPriority(priority)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-xs sm:text-sm font-black text-[#eddcd2]">
                      Assigned staff user ID
                    </span>
                    <input
                      type="text"
                      value={editAssignedTo}
                      onChange={(event) =>
                        setEditAssignedTo(event.target.value)
                      }
                      placeholder="UUID of assigned admin/staff user"
                      className="mt-2 h-11 w-full rounded-xl border-2 border-[#221208] bg-white px-3 text-sm font-semibold text-[#221208] outline-none focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                    />
                    <p className="mt-1 text-xs font-medium text-[#d4a373]">
                      Leave blank to remove the current assignment.
                    </p>
                  </label>
                </div>

                {/* Existing timestamps */}
                <div className="grid gap-3 text-xs sm:text-sm sm:grid-cols-3">
                  <div className="rounded-xl border-2 border-[#221208] bg-white p-3.5 shadow-[3px_3px_0_#221208]">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#5a321a]">
                      Acknowledged
                    </p>
                    <p className="mt-1 font-bold text-[#221208]">
                      {formatDate(selectedGrievance.acknowledged_at)}
                    </p>
                  </div>

                  <div className="rounded-xl border-2 border-[#221208] bg-white p-3.5 shadow-[3px_3px_0_#221208]">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#5a321a]">
                      Resolved
                    </p>
                    <p className="mt-1 font-bold text-[#221208]">
                      {formatDate(selectedGrievance.resolved_at)}
                    </p>
                  </div>

                  <div className="rounded-xl border-2 border-[#221208] bg-white p-3.5 shadow-[3px_3px_0_#221208]">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#5a321a]">
                      Closed
                    </p>
                    <p className="mt-1 font-bold text-[#221208]">
                      {formatDate(selectedGrievance.closed_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t-2 border-[#221208]/20 bg-[#faebd7] px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDetails}
                  disabled={Boolean(savingId)}
                  className="rounded-xl border-2 border-[#221208] bg-white px-6 py-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-slate-100 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={Boolean(savingId)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-[#e68a45] px-8 py-3 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition hover:bg-[#f4a261] disabled:opacity-60"
                >
                  {savingId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}