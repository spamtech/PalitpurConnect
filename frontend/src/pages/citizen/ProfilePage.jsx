import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  UserRound,
  Shield,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Badge, Button, Card } from "../../components/ui";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Calling the backend endpoint to get full user profile details
      const response = await api.getProfile ? await api.getProfile() : { data: { user: authUser } };
      
      const userData = response?.data?.user || response?.data || authUser;
      setProfile(userData);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err?.message || "Unable to fetch profile details from the server.");
      // Fallback to auth context user if API fails
      setProfile(authUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <div className="flex flex-col items-center gap-3.5 rounded-3xl bg-white/90 p-8 shadow-md border border-amber-200/60 backdrop-blur-md">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-bold text-slate-700 animate-pulse">Loading citizen profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 py-12 relative isolate overflow-hidden">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-200/40 via-emerald-200/50 to-transparent blur-3xl animate-pulse" />
        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-teal-200/50 via-emerald-100/60 to-amber-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="success" className="mb-3 px-3.5 py-1 shadow-sm border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-amber-50">
              <span className="mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-amber-500 shadow-sm" />
              <span className="font-bold text-emerald-900">PalitpurConnect</span>
              <span className="mx-1 text-amber-600">•</span>
              <span className="text-slate-700 font-medium">Citizen Dashboard</span>
            </Badge>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              My Profile
            </h1>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={loadProfile}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-amber-50"
          >
            <RefreshCw className="h-4 w-4 text-amber-600" />
            Refresh Details
          </Button>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-amber-200/60 bg-white/95 shadow-xl backdrop-blur-xl">
          {/* Top Banner */}
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/30">
                <UserRound className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {profile?.name || profile?.fullName || "Palitpur Resident"}
                </h2>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    <Shield size={12} /> {profile?.role || profile?.accountType || "Citizen Account"}
                  </span>
                  <span className="text-xs text-slate-400">• Verified Resident</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 p-8 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</p>
                <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                  {profile?.mobile || profile?.phone || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
              <div className="rounded-xl bg-teal-100 p-2.5 text-teal-700">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 break-all">
                  {profile?.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Village Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {profile?.location || profile?.address || "Palitpur, Birbhum, West Bengal"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Member Since</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {profile?.created_at || profile?.createdAt ? new Date(profile.created_at || profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Active Resident"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}