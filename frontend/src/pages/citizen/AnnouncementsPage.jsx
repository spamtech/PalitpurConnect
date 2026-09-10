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
  general: "bg-[#173528] text-[#f7f0d0] border-[#0c2218]",
  panchayat: "bg-[#2d684d] text-[#f7f0d0] border-[#0c2218]",
  health: "bg-[#b07820] text-[#173528] border-[#0c2218]",
  education: "bg-[#2d684d] text-[#f7f0d0] border-[#0c2218]",
  agriculture: "bg-[#b8d85a] text-[#173528] border-[#0c2218]",
  water: "bg-[#2d684d] text-[#f7f0d0] border-[#0c2218]",
  electricity: "bg-[#e6ad45] text-[#173528] border-[#0c2218]",
  event: "bg-[#b8d85a] text-[#173528] border-[#0c2218]",
  emergency: "bg-red-100 text-red-900 border-[#0c2218] animate-pulse",
};

function formatDate(date) {
  if (!date) {
    return "তারিখ পাওয়া যায়নি";
  }

  return new Intl.DateTimeFormat("bn-IN", {
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
    return "সাধারণ";
  }

  const catMap = {
    general: "সাধারণ",
    panchayat: "পঞ্চায়েত",
    health: "স্বাস্থ্য",
    education: "শিক্ষা",
    agriculture: "কৃষি",
    water: "জল",
    electricity: "বিদ্যুৎ",
    event: "অনুষ্ঠান",
    emergency: "জরুরি",
  };

  const key = String(category).toLowerCase();
  return catMap[key] || String(category).replace(/_/g, " ");
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
          "ঘোষণাগুলি লোড করা যাচ্ছে না।"
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
    <div className="min-h-screen bg-[#173528] text-[#f7f0d0] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* ======================================================
          HERO / BANNER SECTION
      ====================================================== */}
      <section className="relative overflow-hidden border-b-[3px] border-[#0c2218] bg-[#10281e] py-10 lg:py-14">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Left Column: Heading & Mission */}
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-1.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] uppercase tracking-wider">
                <span className="h-2.5 w-2.5 rounded-full bg-[#b8d85a] animate-pulse" />
                <span>পালিতপুর কানেক্ট</span>
                <span className="text-[#b07820]">•</span>
                <span>অফিসিয়াল গ্রামের নোটিশ</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#f7f0d0] sm:text-4xl lg:text-5xl leading-[1.1]">
                অবগত থাকুন,
                <span className="block text-[#b8d85a] mt-1">
                  প্রতিটি নোটিশের সাথে সংযুক্ত থাকুন।
                </span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#dfe8c4] sm:text-lg font-medium">
                পালিতপুর কানেক্ট সাম্প্রদায়িক সম্প্রীতি এবং ভাগ করা সমৃদ্ধির অধীনে প্রতিটি বাসিন্দার কাছে সরাসরি রিয়েল-টাইম পঞ্চায়েত ঘোষণা, জনসার্কুলার, গ্রামের প্রোগ্রাম এবং গুরুত্বপূর্ণ প্রশাসনিক আপডেট নিয়ে আসে।
              </p>

              {/* Trust Points */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  গ্রাম যাচাইকৃত
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  নাগরিক-কেন্দ্রিক আপডেট
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  সহজ ডিজিটাল অ্যাক্সেস
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  ২৪/৭ উপলব্ধ
                </div>
              </div>
            </div>

            {/* Right Column: Mini Metric Cards & Refresh */}
            <div className="flex flex-col gap-3 shrink-0 w-full lg:w-72">
              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                <p className="text-xl font-black text-[#b8d85a]">২৪/৭</p>
                <p className="text-xs font-black text-[#f7f0d0]">নোটিশ অ্যাক্সেসযোগ্যতা</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">যেকোনো সময় আপডেট পড়ুন</p>
              </div>

              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                <p className="text-xl font-black text-[#b8d85a]">১০০%</p>
                <p className="text-xs font-black text-[#f7f0d0]">স্বচ্ছ রেকর্ড</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">অফিসিয়াল গ্রাম রেজিস্ট্রি</p>
              </div>

              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                <p className="text-xl font-black text-[#e6ad45]">&lt;২৪ ঘণ্টা</p>
                <p className="text-xs font-black text-[#f7f0d0]">সম্প্রচার গতি</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">তাৎক্ষণিক স্থানীয় সতর্কতা</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadAnnouncements({
                    isRefresh: true,
                  })
                }
                disabled={loading || refreshing}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:bg-[#e6ad45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#173528] ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  aria-hidden="true"
                />
                নোটিশ রিফ্রেশ করুন
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12 lg:px-16">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-[#173528]">
              <Loader2
                className="h-8 w-8 animate-spin text-[#2d684d]"
                aria-hidden="true"
              />
              <p className="text-sm font-black text-[#173528] animate-pulse">
                সর্বশেষ ঘোষণাগুলি আনা হচ্ছে...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-[24px] border-[3px] border-[#0c2218] bg-red-100 p-6 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-red-900">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 rounded-xl border-2 border-[#173528] bg-red-200 p-2 text-red-900">
                <Bell
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1">
                <h2 className="font-black text-base">
                  ঘোষণাগুলি লোড করা যাচ্ছে না
                </h2>
                <p className="mt-1 text-sm font-semibold">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => loadAnnouncements()}
                  className="mt-4 rounded-xl border-2 border-[#0c2218] bg-red-600 px-4 py-2 text-xs font-black text-white shadow-[3px_3px_0_#0c2218] hover:bg-red-700"
                >
                  다시 시도 (আবার চেষ্টা করুন)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          announcements.length === 0 && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border-[3px] border-dashed border-[#0c2218]/40 bg-[#f7f0d0] px-6 py-12 text-center text-[#173528] shadow-[10px_10px_0_rgba(12,34,24,0.3)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                <Megaphone className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="mt-4 text-xl font-black">
                এখনো কোনো ঘোষণা নেই
              </h2>

              <p className="mt-2 max-w-md text-sm font-medium text-[#42604e]">
                পালিতপুর প্রশাসন কর্তৃক প্রকাশিত নতুন নোটিশগুলি প্রকাশিত হওয়ার সাথে সাথেই এখানে প্রদর্শিত হবে।
              </p>
            </div>
          )}

        {/* Announcement List */}
        {!loading &&
          !error &&
          announcements.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] p-0 shadow-[8px_8px_0_rgba(12,34,24,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff9e6] cursor-pointer"
                >
                  {/* Top glowing accent bar */}
                  <div className="h-2 w-full bg-[#0c2218]" />

                  {/* Image Header or Gradient Placeholder */}
                  {announcement.image_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-[#173528] relative border-b-[3px] border-[#0c2218]">
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
                        <span className={`rounded-xl px-3 py-1 text-[10px] font-black border-2 border-[#0c2218] shadow-[3px_3px_0_#0c2218] uppercase tracking-wider ${getCategoryStyle(announcement.category)}`}>
                          {getCategoryLabel(announcement.category)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-[#2d684d] text-[#f7f0d0] relative overflow-hidden border-b-[3px] border-[#0c2218]">
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218] transition-transform duration-300 group-hover:scale-110">
                          <Megaphone className="h-7 w-7" aria-hidden="true" />
                        </div>
                        <span className={`rounded-xl px-3 py-1 text-[10px] font-black border-2 border-[#0c2218] shadow-[3px_3px_0_#0c2218] uppercase tracking-wider ${getCategoryStyle(announcement.category)}`}>
                          {getCategoryLabel(announcement.category)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#b07820] mb-2">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(announcement.published_at || announcement.created_at)}
                      </div>

                      <h2 className="text-base font-black tracking-tight text-[#173528] group-hover:text-[#2d684d] transition-colors line-clamp-2">
                        {announcement.title}
                      </h2>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#42604e] font-medium line-clamp-3">
                        {announcement.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t-2 border-[#0c2218]/15 pt-4">
                      <span className="text-xs font-black text-[#2d684d] group-hover:text-[#b07820] transition-colors flex items-center gap-1">
                        সম্পূর্ণ ঘোষণা পড়ুন
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218] transition-all">
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>

      {/* ======================================================
          DETAILS MODAL
      ====================================================== */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c2218]/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAnnouncement(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[15px_15px_0_rgba(12,34,24,0.4)] animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header Banner */}
            <div className="relative bg-[#2d684d] p-6 sm:p-8 text-[#f7f0d0] border-b-[3px] border-[#0c2218]">
              <div className="absolute top-0 right-0 p-6">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218] transition-all hover:bg-[#e6ad45]"
                  aria-label="ঘোষণা বন্ধ করুন"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="pr-12">
                <span className={`rounded-xl px-3.5 py-1 text-xs font-black border-2 border-[#0c2218] shadow-[3px_3px_0_#0c2218] uppercase tracking-widest ${getCategoryStyle(selectedAnnouncement.category)}`}>
                  {getCategoryLabel(selectedAnnouncement.category)}
                </span>

                <h2 id="announcement-modal-title" className="mt-4 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#f7f0d0]">
                  {selectedAnnouncement.title}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-xs font-black text-[#e6ad45]">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  প্রকাশিত হয়েছে {formatDate(selectedAnnouncement.published_at || selectedAnnouncement.created_at)}
                </div>
              </div>
            </div>

            {/* Modal Image (if available) */}
            {selectedAnnouncement.image_url && (
              <div className="relative aspect-[21/9] overflow-hidden bg-[#173528] border-b-[3px] border-[#0c2218]">
                <img
                  src={selectedAnnouncement.image_url}
                  alt={selectedAnnouncement.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2d684d] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#58705e]">অফিসিয়াল পঞ্চায়েত সার্কুলার</span>
              </div>

              <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[#173528] bg-white p-6 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218] font-medium">
                {selectedAnnouncement.description}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#58705e]">
                  <Sparkles size={14} className="text-[#b07820]" />
                  পালিতপুর গ্রাম পঞ্চায়েত ডিজিটাল বুলেটিন
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-8 py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:bg-[#e6ad45]"
                >
                  নোটিশ বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}