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
      setError(err?.message || "সার্ভার থেকে প্রোফাইল বিবরণ আনতে অক্ষম।");
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
      <div className="flex min-h-screen items-center justify-center bg-[#173528]">
        <div className="flex flex-col items-center gap-3.5 rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 shadow-[8px_8px_0_rgba(12,34,24,0.3)] text-[#173528]">
          <Loader2 className="h-8 w-8 animate-spin text-[#2d684d]" />
          <p className="text-sm font-black text-[#173528] animate-pulse">নাগরিক প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#173528] text-[#f7f0d0] py-12 relative isolate overflow-hidden border-b-[3px] border-[#0c2218]">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-1.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] uppercase tracking-wider">
              <span className="h-2.5 w-2.5 rounded-full bg-[#b8d85a] animate-pulse" />
              <span>পালিতপুরকানেক্ট</span>
              <span className="text-[#b07820]">•</span>
              <span>নাগরিক ড্যাশবোর্ড</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#f7f0d0] sm:text-4xl">
              আমার প্রোফাইল 🏛️
            </h1>
          </div>

          <button
            type="button"
            onClick={loadProfile}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-5 py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:bg-[#e6ad45]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#173528]" />
            বিবরণ রিফ্রেশ করুন
          </button>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-[24px] border-[3px] border-[#0c2218] bg-red-100 p-4 text-xs font-bold text-red-900 shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-700" />
            <p>{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
          {/* Top Banner */}
          <div className="relative overflow-hidden border-b-[3px] border-[#0c2218] bg-[#2d684d] p-8 text-[#f7f0d0]">
            <div className="flex items-center gap-5 relative z-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                <UserRound className="h-8 w-8" strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-[#f7f0d0]">
                  {profile?.name || profile?.fullName || "পালিতপুরের বাসিন্দা"}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#173528] px-3.5 py-1 text-xs font-black text-[#b8d85a] border-2 border-[#0c2218] shadow-[3px_3px_0_#0c2218] uppercase tracking-wider">
                    <Shield size={12} strokeWidth={2.5} /> {profile?.role || profile?.accountType || "নাগরিক অ্যাকাউন্ট"}
                  </span>
                  <span className="text-xs font-bold text-[#dfe8c4]">• যাচাইকৃত বাসিন্দা</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 p-8 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-2xl border-[2px] border-[#0c2218] bg-white p-4 shadow-[4px_4px_0_#0c2218]">
              <div className="rounded-xl border border-[#173528] bg-[#b8d85a] p-2.5 text-[#173528]">
                <Phone className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#58705e]">মোবাইল নম্বর</p>
                <p className="mt-1 font-mono text-sm font-black text-[#173528]">
                  {profile?.mobile || profile?.phone || "উপলব্ধ নেই"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border-[2px] border-[#0c2218] bg-white p-4 shadow-[4px_4px_0_#0c2218]">
              <div className="rounded-xl border border-[#173528] bg-[#b8d85a] p-2.5 text-[#173528]">
                <Mail className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#58705e]">ইমেল ঠিকানা</p>
                <p className="mt-1 text-sm font-black text-[#173528] break-all">
                  {profile?.email || "প্রদান করা হয়নি"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border-[2px] border-[#0c2218] bg-white p-4 shadow-[4px_4px_0_#0c2218]">
              <div className="rounded-xl border border-[#173528] bg-[#b8d85a] p-2.5 text-[#173528]">
                <MapPin className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#58705e]">গ্রামের অবস্থান</p>
                <p className="mt-1 text-sm font-black text-[#173528]">
                  {profile?.location || profile?.address || "পালিতপুর, বীরভূম, পশ্চিমবঙ্গ"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border-[2px] border-[#0c2218] bg-white p-4 shadow-[4px_4px_0_#0c2218]">
              <div className="rounded-xl border border-[#173528] bg-[#b8d85a] p-2.5 text-[#173528]">
                <Calendar className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#58705e]">সদস্য হয়েছেন</p>
                <p className="mt-1 text-sm font-black text-[#173528]">
                  {profile?.created_at || profile?.createdAt ? new Date(profile.created_at || profile.createdAt).toLocaleDateString("bn-IN", { month: "short", year: "numeric" }) : "সক্রিয় বাসিন্দা"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}