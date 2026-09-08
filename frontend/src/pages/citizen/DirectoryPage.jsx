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
          "Unable to load the village directory. Please try again."
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 relative isolate overflow-hidden">
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
                <span className="text-slate-700 font-medium">Services Directory</span>
              </Badge>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-[1.1]">
                Find Local Services,
                <span className="block bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 bg-clip-text text-transparent mt-1">
                  Connected to Everyone.
                </span>
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                PalitpurConnect brings local government offices, public services, essential facilities, and community contacts together in one vibrant digital platform.
              </p>

              {/* Trust Points */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">✓</span>
                  Panchayat verified
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">✓</span>
                  Citizen-first listings
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
                <p className="text-xs font-bold text-slate-800">Directory Access</p>
                <p className="text-[11px] text-slate-500">Contacts available anytime</p>
              </div>

              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 to-emerald-50/30 p-3.5 shadow-sm backdrop-blur-md">
                <p className="text-xl font-black text-emerald-900">100%</p>
                <p className="text-xs font-bold text-slate-800">Citizen Focused</p>
                <p className="text-[11px] text-slate-500">Designed around local needs</p>
              </div>

              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 to-emerald-50/30 p-3.5 shadow-sm backdrop-blur-md">
                <p className="text-xl font-black text-amber-700">&lt;24h</p>
                <p className="text-xs font-bold text-slate-800">Directory Updates</p>
                <p className="text-[11px] text-slate-500">Accurate administration records</p>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={loadDirectory}
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-amber-600 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Directory
              </Button>
            </div>

          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search + Filter Container */}
        <div className="mb-8 rounded-2xl border border-amber-200/60 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
          <div className="grid gap-3.5 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services, offices, contacts..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 cursor-pointer"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All Categories" : item.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/90 p-6 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 rounded-full bg-red-100 p-2.5 shadow-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              </div>

              <div>
                <h2 className="font-bold text-red-900 text-base">
                  Unable to load directory
                </h2>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={loadDirectory}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3.5 rounded-2xl bg-white/90 p-8 shadow-sm border border-amber-200/60 backdrop-blur-md">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-bold text-slate-700 animate-pulse">
                Loading village directory...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredEntries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-white/90 px-6 py-14 text-center shadow-sm backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30">
              <Building2 className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No directory entries found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-slate-600">
              Try modifying your search keywords or switching category filters.
            </p>
          </div>
        )}

        {/* Directory Cards Grid */}
        {!loading && filteredEntries.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing{" "}
                <span className="font-bold text-emerald-800">
                  {filteredEntries.length}
                </span>{" "}
                {filteredEntries.length === 1 ? "listing" : "listings"}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border-amber-200/60 bg-white/90 p-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md">
      {/* Image or Clean Gradient Header - Sleeker Aspect Ratio */}
      {image_url ? (
        <div className="aspect-[24/9] overflow-hidden bg-slate-100 relative">
          <div className="absolute inset-0 bg-slate-950/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none" />
          <img
            src={image_url}
            alt={name || "Directory entry"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="flex aspect-[24/9] items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
          <Building2 className="h-7 w-7 text-emerald-700 transition-transform duration-300 group-hover:scale-110" />
        </div>
      )}

      {/* Content - Compact padding */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category Badge */}
          {category && (
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-200 text-emerald-700 shadow-xs">
              {category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}

          {/* Name */}
          <h2 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
            {name || "Unnamed Service"}
          </h2>

          {/* Description */}
          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>

        {/* Contact information */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3.5">
          {address && (
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span className="leading-snug">{address}</span>
            </div>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{phone}</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 break-all text-xs font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-teal-600" />
              <span>{email}</span>
            </a>
          )}

          {website_url && (
            <a
              href={website_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 break-all text-xs font-bold text-emerald-700 transition hover:text-amber-700 pt-0.5"
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span>Visit official website</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}