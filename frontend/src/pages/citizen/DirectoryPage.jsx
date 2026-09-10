import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { api } from "../../services/api";
import { Badge, Button, Card } from "../../components/ui";

export default function DirectoryPage() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDirectory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getDirectory();

      const data = response?.data;

      if (Array.isArray(data)) {
        setEntries(data);
      } else if (Array.isArray(data?.entries)) {
        setEntries(data.entries);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Failed to load directory:", err);
      setError(
        err?.message ||
          "গ্রামের ডিরেক্টরি লোড করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const categories = useMemo(() => {
    const values = entries
      .map((entry) => entry?.category)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory =
        category === "all" ||
        entry?.category?.toLowerCase() === category.toLowerCase();

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        entry?.name,
        entry?.category,
        entry?.description,
        entry?.address,
        entry?.phone,
        entry?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [entries, search, category]);

  const translateCategory = (cat) => {
    if (cat === "all") return "সকল বিভাগ";
    const catMap = {
      general: "সাধারণ",
      panchayat: "পঞ্চায়েত",
      health: "স্বাস্থ্য",
      education: "শিক্ষা",
      agriculture: "কৃষি",
      water: "জল",
      electricity: "বিদ্যুৎ",
      emergency: "জরুরি",
    };
    const key = String(cat).toLowerCase();
    return catMap[key] || String(cat).replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen w-full bg-[#173528] text-[#f7f0d0] relative isolate overflow-hidden">
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
                <span>পরিষেবা ডিরেক্টরি</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#f7f0d0] sm:text-4xl lg:text-5xl leading-[1.1]">
                স্থানীয় পরিষেবা খুঁজুন,
                <span className="block text-[#b8d85a] mt-1">
                  সবার সাথে সংযুক্ত থাকুন।
                </span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#dfe8c4] sm:text-lg font-medium">
                পালিতপুর কানেক্ট স্থানীয় সরকারি অফিস, জনসেবা, প্রয়োজনীয় সুবিধা এবং সম্প্রদায়ের যোগাযোগগুলিকে একটি প্রাণবন্ত ডিজিটাল প্ল্যাটফর্মে একত্রিত করেছে।
              </p>

              {/* Trust Points */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  গ্রাম যাচাইকৃত
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#f7f0d0] bg-[#2d684d] p-3 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#173528] bg-[#b8d85a] text-[#173528] font-black">✓</span>
                  নাগরিক-কেন্দ্রিক তালিকা
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
                <p className="text-xs font-black text-[#f7f0d0]">ডিরেক্টরি অ্যাক্সেস</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">যেকোনো সময় যোগাযোগ উপলব্ধ</p>
              </div>

              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                <p className="text-xl font-black text-[#b8d85a]">১০০%</p>
                <p className="text-xs font-black text-[#f7f0d0]">নাগরিক কেন্দ্রিক</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">স্থানীয় চাহিদার কথা মাথায় রেখে তৈরি</p>
              </div>

              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                <p className="text-xl font-black text-[#e6ad45]">&lt;২৪ ঘণ্টা</p>
                <p className="text-xs font-black text-[#f7f0d0]">ডিরেক্টরি আপডেট</p>
                <p className="text-[11px] font-semibold text-[#dfe8c4]">সঠিক প্রশাসনিক রেকর্ড</p>
              </div>

              <button
                type="button"
                onClick={loadDirectory}
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:bg-[#e6ad45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#173528] ${loading ? "animate-spin" : ""}`}
                />
                ডিরেক্টরি রিফ্রেশ করুন
              </button>
            </div>

          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-12 lg:px-16">
        {/* Search + Filter Container */}
        <div className="mb-8 rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-5 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-[#173528]">
          <div className="grid gap-3.5 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#58705e]" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="সেবা, অফিস, যোগাযোগ খুঁজুন..."
                className="w-full rounded-xl border-2 border-[#173528] bg-white py-3 pl-11 pr-4 text-sm font-semibold text-[#173528] outline-none transition placeholder:text-[#58705e] focus:border-[#2d684d] focus:ring-2 focus:ring-[#b8d85a]"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border-2 border-[#173528] bg-white px-4 py-3 text-sm font-black text-[#173528] outline-none transition focus:border-[#2d684d] focus:ring-2 focus:ring-[#b8d85a] cursor-pointer"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {translateCategory(item)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex flex-col gap-4 rounded-[24px] border-[3px] border-[#0c2218] bg-red-100 p-6 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-red-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 rounded-xl border-2 border-[#173528] bg-red-200 p-2.5 text-red-900">
                <AlertCircle className="h-5 w-5 shrink-0" />
              </div>

              <div>
                <h2 className="font-black text-base">
                  ডিরেক্টরি লোড করা যাচ্ছে না
                </h2>
                <p className="mt-1 text-sm font-semibold">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadDirectory}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0c2218] bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#0c2218] hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3.5 rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-[#173528]">
              <Loader2 className="h-8 w-8 animate-spin text-[#2d684d]" />
              <p className="text-sm font-black text-[#173528] animate-pulse">
                গ্রামের ডিরেক্টরি লোড হচ্ছে...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredEntries.length === 0 && (
          <div className="rounded-[24px] border-[3px] border-dashed border-[#0c2218]/40 bg-[#f7f0d0] px-6 py-14 text-center text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
              <Building2 className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-black">
              কোনো ডিরেক্টরি এন্ট্রি পাওয়া যায়নি
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm font-medium text-[#42604e]">
              আপনার অনুসন্ধանի শব্দ বা বিভাগ ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {/* Directory Cards Grid */}
        {!loading && filteredEntries.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="text-xs sm:text-sm font-black text-[#dfe8c4]">
                মোট{" "}
                <span className="font-black text-[#b8d85a]">
                  {filteredEntries.length}
                </span>{" "}
                টি তালিকা দেখানো হচ্ছে
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry) => (
                <DirectoryCard
                  key={entry.id}
                  entry={entry}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DirectoryCard({ entry }) {
  const {
    name,
    category,
    description,
    phone,
    email,
    address,
    image_url,
    website_url,
  } = entry;

  const translateCategory = (cat) => {
    if (!cat) return "";
    const catMap = {
      general: "সাধারণ",
      panchayat: "পঞ্চায়েত",
      health: "স্বাস্থ্য",
      education: "শিক্ষা",
      agriculture: "কৃষি",
      water: "জল",
      electricity: "বিদ্যুৎ",
      emergency: "জরুরি",
    };
    const key = String(cat).toLowerCase();
    return catMap[key] || String(cat).replace(/_/g, " ");
  };

  return (
    <Card className="group flex flex-col overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-0 text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#fff9e6]">
      <div className="h-2 w-full bg-[#0c2218]" />

      {/* Image or Clean Gradient Header */}
      {image_url ? (
        <div className="aspect-[24/9] overflow-hidden bg-[#173528] relative border-b-[3px] border-[#0c2218]">
          <img
            src={image_url}
            alt={name || "ডিরেক্টরি এন্ট্রি"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="flex aspect-[24/9] items-center justify-center bg-[#2d684d] text-[#f7f0d0] relative overflow-hidden border-b-[3px] border-[#0c2218]">
          <Building2 className="h-7 w-7 text-[#b8d85a] transition-transform duration-300 group-hover:scale-110" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Category Badge */}
          {category && (
            <span className="inline-flex rounded-xl bg-[#2d684d] px-3 py-1 text-[10px] font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] uppercase tracking-wider">
              {translateCategory(category)}
            </span>
          )}

          {/* Name */}
          <h2 className="mt-3 text-base font-black text-[#173528] group-hover:text-[#2d684d] transition-colors">
            {name || "নামহীন সেবা"}
          </h2>

          {/* Description */}
          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-medium text-[#42604e]">
              {description}
            </p>
          )}
        </div>

        {/* Contact information */}
        <div className="mt-5 space-y-2.5 border-t-2 border-[#0c2218]/15 pt-4">
          {address && (
            <div className="flex items-start gap-2 text-xs font-semibold text-[#42604e]">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b07820]" />
              <span className="leading-snug">{address}</span>
            </div>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-xs font-bold text-[#173528] transition hover:text-[#2d684d]"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#2d684d]" />
              <span>{phone}</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 break-all text-xs font-bold text-[#173528] transition hover:text-[#2d684d]"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#2d684d]" />
              <span>{email}</span>
            </a>
          )}

          {website_url && (
            <a
              href={website_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 break-all text-xs font-black text-[#2d684d] transition hover:text-[#b07820] pt-0.5"
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-[#b07820]" />
              <span>অফিসিয়াল ওয়েবসাইট দেখুন</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}