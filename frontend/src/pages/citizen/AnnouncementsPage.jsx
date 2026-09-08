import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Loader2,
  Megaphone,
  RefreshCw,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { api } from "../../services/api";
import { Badge, Button, Card } from "../../components/ui";

const CATEGORY_STYLES = {
  general: "bg-slate-100 text-slate-700 border-slate-200",
  panchayat: "bg-emerald-50 text-emerald-800 border-emerald-300",
  health: "bg-rose-50 text-rose-800 border-rose-300",
  education: "bg-sky-50 text-sky-800 border-sky-300",
  agriculture: "bg-lime-50 text-lime-800 border-lime-300",
  water: "bg-cyan-50 text-cyan-800 border-cyan-300",
  electricity: "bg-amber-50 text-amber-800 border-amber-300",
  event: "bg-violet-50 text-violet-800 border-violet-300",
  emergency: "bg-red-50 text-red-800 border-red-300 animate-pulse",
};

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getCategoryStyle(category) {
  return (
    CATEGORY_STYLES[
      String(category || "general").toLowerCase()
    ] || CATEGORY_STYLES.general
  );
}

function getCategoryLabel(category) {
  if (!category) {
    return "General";
  }

  return String(category)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState(null);

  const loadAnnouncements = async ({
    isRefresh = false,
  } = {}) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.getAnnouncements();

      const items =
        response?.data?.announcements || [];

      setAnnouncements(items);
    } catch (err) {
      console.error(
        "Failed to load announcements:",
        err
      );

      setError(
        err.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 relative isolate overflow-hidden">
      {/* Ambient Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-200/40 via-emerald-200/50 to-transparent blur-3xl animate-pulse" />
        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-teal-200/50 via-emerald-100/60 to-amber-100/30 blur-3xl" />
      </div>

      {/* Grid Background Pattern */}
      <div
        aria-hidden="true"
        className="radial-grid pointer-events-none absolute inset-0 -z-10 opacity-70"
      />

      {/* ======================================================
          HERO / BANNER SECTION
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-amber-200/60 bg-white/80 backdrop-blur-md shadow-xs py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Left Column: Heading & Mission */}
            <div className="max-w-3xl">
              <Badge variant="success" className="mb-4 px-3.5 py-1.5 shadow-sm border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-amber-50">
                <span className="mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-amber-500 shadow-sm" />
                <span className="font-bold text-emerald-900">PalitpurConnect</span>
                <span className="mx-1 text-amber-600">•</span>
                <span className="text-slate-700 font-medium">Official Village Notices</span>
              </Badge>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-[1.1]">
                Stay Informed,
                <span className="block bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 bg-clip-text text-transparent mt-1">
                  Connected to Every Notice.
                </span>
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                PalitpurConnect brings real-time Panchayat announcements, public circulars, village programs, and crucial administrative updates directly to every resident under community harmony and shared prosperity.
              </p>

              {/* Trust Points */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">✓</span>
                  Panchayat verified
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">✓</span>
                  Citizen-first updates
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                  Simple digital access
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">✓</span>
                  Available 24/7
                </div>
              </div>
            </div>

            {/* Right Column: Mini Metric Cards & Refresh */}
            <div className="flex flex-col gap-3 shrink-0 w-full lg:w-72">
              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 to-emerald-50/30 p-3.5 shadow-sm backdrop-blur-md">
                <p className="text-xl font-black text-emerald-900">24/7</p>
                <p className="text-xs font-bold text-slate-800">Notice Accessibility</p>
                <p className="text-[11px] text-slate-500">Read updates anytime</p>
              </div>

              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 to-emerald-50/30 p-3.5 shadow-sm backdrop-blur-md">
                <p className="text-xl font-black text-emerald-900">100%</p>
                <p className="text-xs font-bold text-slate-800">Transparent Records</p>
                <p className="text-[11px] text-slate-500">Official village registry</p>
              </div>

              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 to-emerald-50/30 p-3.5 shadow-sm backdrop-blur-md">
                <p className="text-xl font-black text-amber-700">&lt;24h</p>
                <p className="text-xs font-bold text-slate-800">Broadcast Speed</p>
                <p className="text-[11px] text-slate-500">Immediate local alerts</p>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  loadAnnouncements({
                    isRefresh: true,
                  })
                }
                disabled={loading || refreshing}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-amber-600 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  aria-hidden="true"
                />
                Refresh Notices
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 p-8 shadow-md border border-amber-200/60 backdrop-blur-md">
              <Loader2
                className="h-8 w-8 animate-spin text-emerald-600"
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-slate-700 animate-pulse">
                Fetching latest announcements...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 p-6 shadow-md backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 rounded-full bg-red-100 p-2.5 shadow-sm">
                <Bell
                  className="h-5 w-5 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-red-900 text-base">
                  Unable to load announcements
                </h2>
                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
                <Button
                  type="button"
                  onClick={() => loadAnnouncements()}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          announcements.length === 0 && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-amber-300 bg-white/90 px-6 py-12 text-center shadow-md backdrop-blur-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30">
                <Megaphone className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                No announcements yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-600">
                New notices published by the Palitpur administration will appear here as soon as they are released.
              </p>
            </div>
          )}

        {/* Announcement List (Attracting Cards) */}
        {!loading &&
          !error &&
          announcements.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-b from-white via-white to-emerald-50/20 p-0 shadow-lg shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl cursor-pointer"
                >
                  {/* Top glowing accent bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-500 transition-all duration-300 group-hover:scale-x-105" />

                  {/* Image Header or Gradient Placeholder */}
                  {announcement.image_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute bottom-3 left-3 z-20">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold border backdrop-blur-md shadow-md ${getCategoryStyle(announcement.category)}`}>
                          {getCategoryLabel(announcement.category)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
                      <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <Megaphone className="h-7 w-7" aria-hidden="true" />
                        </div>
                        <span className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold border backdrop-blur-md shadow-sm ${getCategoryStyle(announcement.category)}`}>
                          {getCategoryLabel(announcement.category)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      {announcement.image_url && (
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border shadow-xs ${getCategoryStyle(announcement.category)}`}>
                            {getCategoryLabel(announcement.category)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-2">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(announcement.published_at || announcement.created_at)}
                      </div>

                      <h2 className="text-base font-black tracking-tight text-slate-950 group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {announcement.title}
                      </h2>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {announcement.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-emerald-700 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                        Read full announcement
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>

      {/* ======================================================
          DETAILS MODAL (Extremely Attractive Design)
      ====================================================== */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAnnouncement(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl border border-amber-200/80 animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header Banner */}
            <div className="relative bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 p-6 sm:p-8 text-white">
              <div className="absolute top-0 right-0 p-6">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 shadow-lg border border-white/20"
                  aria-label="Close announcement"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="pr-12">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold border shadow-sm ${getCategoryStyle(selectedAnnouncement.category)}`}>
                  {getCategoryLabel(selectedAnnouncement.category)}
                </span>

                <h2 id="announcement-modal-title" className="mt-4 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                  {selectedAnnouncement.title}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-300">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Published on {formatDate(selectedAnnouncement.published_at || selectedAnnouncement.created_at)}
                </div>
              </div>
            </div>

            {/* Modal Image (if available) */}
            {selectedAnnouncement.image_url && (
              <div className="relative aspect-[21/9] overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={selectedAnnouncement.image_url}
                  alt={selectedAnnouncement.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-emerald-50/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Official Panchayat Circular</span>
              </div>

              <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-slate-700 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-inner">
                {selectedAnnouncement.description}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Sparkles size={14} className="text-amber-500" />
                  Palitpur Gram Panchayat Digital Bulletin
                </div>

                <Button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold px-8 py-3 text-sm shadow-xl shadow-emerald-700/25"
                >
                  Close Notice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}