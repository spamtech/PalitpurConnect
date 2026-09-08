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
      setError("Please enter your email and password.");
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
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 relative isolate overflow-hidden">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/20 via-emerald-500/20 to-transparent blur-3xl animate-pulse" />
        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-teal-500/20 via-emerald-500/10 to-amber-500/20 blur-3xl" />
      </div>

      <div className="grid min-h-screen lg:grid-cols-12">
        {/* =====================================================
            LEFT BRANDING PANEL (5 cols)
        ====================================================== */}
        <div className="relative hidden overflow-hidden lg:col-span-5 lg:flex border-r border-emerald-900/40 bg-slate-950/40 backdrop-blur-md">
          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-xs font-bold text-amber-300 transition hover:text-white w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to PalitpurConnect
            </Link>

            <div className="max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-slate-950 shadow-lg shadow-amber-500/20">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white xl:text-5xl leading-[1.1]">
                Welcome back to
                <span className="block bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mt-1">
                  PalitpurConnect.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
                Access village announcements, local services, emergency hotlines, and instant grievance status tracking from one unified digital platform.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  Secure encrypted citizen login session
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  Instant access to active community tickets
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  Panchayat verified administrator security
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-amber-300/80 tracking-wider">
              Palitpur • Birbhum • West Bengal
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT LOGIN PANEL (7 cols)
        ====================================================== */}
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12 lg:col-span-7">
          <div className="w-full max-w-xl">
            {/* Mobile back */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div className="mb-8">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold border border-emerald-200 text-emerald-700 shadow-xs">
                SECURE ACCESS
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Citizen Login 🔑
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sign in to your PalitpurConnect account to manage your requests.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <Input
                label="Email address *"
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
                  label="Password *"
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your account password"
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
                  className="absolute right-3 top-[38px] rounded-lg p-1 text-slate-400 transition hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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
                  className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-amber-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-xs">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 font-bold py-3 shadow-lg shadow-emerald-700/20"
                loading={loading}
                disabled={loading}
              >
                Sign in to Portal
                {!loading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </form>

            {/* Register */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                Don't have a citizen account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-emerald-700 hover:text-amber-600 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Admin */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Are you a Panchayat administrator?{" "}
                <Link
                  to="/admin/login"
                  className="font-bold text-slate-700 hover:text-emerald-700 transition-colors underline underline-offset-4"
                >
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}