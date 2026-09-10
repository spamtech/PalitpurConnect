import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("দয়া করে আপনার ইমেল এবং পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const response = await api.login({
        email: trimmedEmail,
        password,
      });

      const authData = response.data || response;

      login(authData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.message ||
          "লগইন করতে ব্যর্থ হয়েছে। আপনার শংসাপত্রগুলি যাচাই করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  return (
    <div className="min-h-screen bg-[#173528] text-[#f7f0d0] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="grid min-h-screen lg:grid-cols-12">
        {/* =====================================================
            LEFT BRANDING PANEL (5 cols)
        ====================================================== */}
        <div className="relative hidden overflow-hidden lg:col-span-5 lg:flex border-r-[3px] border-[#0c2218] bg-[#10281e]">
          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-xs font-black text-[#173528] transition hover:bg-[#e6ad45] w-fit rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 shadow-[4px_4px_0_#0c2218]"
            >
              <ArrowLeft className="h-4 w-4" />
              পালিতপুর কানেক্ট-এ ফিরে যান
            </Link>

            <div className="max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#0c2218] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#f7f0d0] xl:text-5xl leading-[1.1]">
                স্বাগতম ফিরে আসায়
                <span className="block text-[#b8d85a] mt-1">
                  পালিতপুর কানেক্ট-এ।
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#dfe8c4]">
                একটিমাত্র ডিজিটাল প্ল্যাটফর্ম থেকে গ্রামের ঘোষণা, স্থানীয় পরিষেবা, জরুরি হটলাইন এবং তাৎক্ষণিক অভিযোগের স্থিতি ট্র্যাক করুন।
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  সুরক্ষিত এনক্রিপ্টেড নাগরিক লগইন সেশন
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  সক্রিয় কমিউনিটি টিকেটগুলিতে তাত্ক্ষণিক অ্যাক্সেস
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  গ্রাম যাচাইকৃত প্রশাসক নিরাপত্তা
                </div>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e6ad45]">
              পালিতপুর • বীরভূম • পশ্চিমবঙ্গ
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT LOGIN PANEL (7 cols)
        ====================================================== */}
        <div className="flex items-center justify-center bg-[#173528] px-6 py-12 sm:px-12 lg:col-span-7">
          <div className="w-full max-w-xl rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 sm:p-10 text-[#173528] shadow-[10px_10px_0_rgba(12,34,24,0.3)]">
            {/* Mobile back */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-xs font-black text-[#173528] transition hover:bg-[#e6ad45] rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 shadow-[4px_4px_0_#0c2218] lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              হোমে ফিরে যান
            </Link>

            <div className="mb-8">
              <span className="inline-flex rounded-xl bg-[#2d684d] px-3.5 py-1 text-xs font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] tracking-widest uppercase">
                সুরক্ষিত অ্যাক্সেস
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#173528] sm:text-4xl">
                নাগরিক লগইন 🔑
              </h2>

              <p className="mt-2 text-sm font-medium leading-relaxed text-[#42604e]">
                আপনার অনুরোধগুলি পরিচালনা করতে আপনার পালিতপুর কানেক্ট অ্যাকাউন্টে সাইন ইন করুন।
              </p>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mb-6 flex items-center justify-center gap-3 rounded-2xl border-[2px] border-[#0c2218] bg-white py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-[5px_5px_0_#0c2218]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google দিয়ে সাইন ইন করুন
            </button>

            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#173528]/20" />
              </div>
              <span className="relative bg-[#f7f0d0] px-4 text-xs font-bold uppercase tracking-wider text-[#42604e]">
                অথবা ইমেল দিয়ে
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <Input
                label="ইমেল ঠিকানা *"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                icon={Mail}
                autoComplete="email"
                required
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="পাসওয়ার্ড *"
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="আপনার অ্যাকাউন্ট পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  icon={LockKeyhole}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-[38px] rounded-xl border-2 border-[#173528] bg-[#b8d85a] p-1.5 text-[#173528] shadow-[2px_2px_0_#173528] transition hover:bg-[#e6ad45]"
                  aria-label={
                    showPassword
                      ? "পাসওয়ার্ড লুকান"
                      : "পাসওয়ার্ড দেখান"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm font-bold text-[#2d684d] hover:text-[#b07820] transition-colors"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border-2 border-[#0c2218] bg-red-100 px-4 py-3 text-xs font-bold text-red-800 shadow-[4px_4px_0_#0c2218]">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
                loading={loading}
                disabled={loading}
              >
                পোর্টালে সাইন ইন করুন
                {!loading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </form>

            {/* Register */}
            <div className="mt-8 border-t-2 border-[#173528]/15 pt-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-[#42604e]">
                কোনো নাগরিক অ্যাকাউন্ট নেই?{" "}
                <Link
                  to="/register"
                  className="font-black text-[#2d684d] hover:text-[#b07820] transition-colors"
                >
                  একটি অ্যাকাউন্ট তৈরি করুন
                </Link>
              </p>
            </div>

            {/* Admin */}
            <div className="mt-4 text-center">
              <p className="text-xs font-semibold text-[#58705e]">
                আপনি কি একজন প্রশাসক?{" "}
                <Link
                  to="/admin/login"
                  className="font-black text-[#173528] hover:text-[#2d684d] transition-colors underline underline-offset-4"
                >
                  অ্যাডমিন লগইন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}