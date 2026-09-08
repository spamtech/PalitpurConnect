import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function CitizenRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);

  // Form Fields mapped to database schema
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [village, setVillage] = useState("Palitpur");
  const [district, setDistrict] = useState("Birbhum");
  const [state, setState] = useState("West Bengal");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, "");

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please create a password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
        phone: cleanPhone || null,
        address: address.trim() || null,
        village: village.trim() || "Palitpur",
        district: district.trim() || "Birbhum",
        state: state.trim() || "West Bengal",
      });

      setEmail(trimmedEmail);
      setStep(2);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.verifyEmail({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      const authData = response.data || response;

      if (authData.accessToken || authData.token || authData.user) {
        login(authData);
        navigate("/dashboard");
        return;
      }

      const loginResponse = await api.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const loginData = loginResponse.data || loginResponse;
      login(loginData);
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(
        error.message || "Verification failed. Please check the OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResending(true);

    try {
      await api.resendVerificationOtp({
        email: email.trim().toLowerCase(),
      });
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setError(error.message || "Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmail = () => {
    setOtp("");
    setError("");
    setStep(1);
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
                Join
                <span className="block bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mt-1">
                  PalitpurConnect.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
                Create your verified citizen account to access village announcements, local directories, emergency hotlines, and instant grievance tracking.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  Panchayat verified secure residency
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  Real-time civic grievance tracking
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  24/7 direct access to village services
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-amber-300/80 tracking-wider">
              Palitpur • Birbhum • West Bengal
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT FORM PANEL (7 cols)
        ====================================================== */}
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12 lg:col-span-7">
          <div className="w-full max-w-xl">
            {/* Mobile back link */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            {/* =================================================
                STEP 1 — CREATE ACCOUNT
            ================================================== */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold border border-emerald-200 text-emerald-700 shadow-xs">
                    CITIZEN REGISTRATION
                  </span>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Create your account 🏛️
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Register as a resident of Palitpur to unlock full portal privileges.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-sm font-black text-white shadow-md">
                    1
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-amber-500" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                    2
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Full name *"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      icon={User}
                      autoComplete="name"
                      required
                    />

                    <Input
                      label="Email address *"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Input
                        label="Password *"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={LockKeyhole}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-[38px] rounded-lg p-1 text-slate-400 hover:text-slate-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm password *"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={LockKeyhole}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-[38px] rounded-lg p-1 text-slate-400 hover:text-slate-700"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      label="Mobile number"
                      type="tel"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      icon={Phone}
                      maxLength={10}
                    />

                    <Input
                      label="Village"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      icon={MapPin}
                    />

                    <Input
                      label="District"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      icon={MapPin}
                    />
                  </div>

                  <Input
                    label="Street Address / Area Landmark"
                    type="text"
                    placeholder="e.g. Near Palitpur Primary School"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    icon={MapPin}
                  />

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-xs">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 font-bold py-3 shadow-lg shadow-emerald-700/20"
                    loading={loading}
                    disabled={loading}
                  >
                    Continue to Verification
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-emerald-700 hover:text-amber-600 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* =================================================
                STEP 2 — VERIFY EMAIL (OTP)
            ================================================== */}
            {step === 2 && (
              <>
                <div className="mb-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
                    <Mail className="h-7 w-7" />
                  </div>

                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold border border-emerald-200 text-emerald-700 shadow-xs">
                    EMAIL VERIFICATION
                  </span>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    Verify your email 📬
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    We've sent a 6-digit verification code to <span className="font-bold text-slate-900 break-all">{email}</span>.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-emerald-200" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white shadow-md">
                    2
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <Input
                    label="Verification code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    autoComplete="one-time-code"
                    className="text-center font-mono text-2xl tracking-[0.5em] font-black"
                  />

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-xs">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 font-bold py-3 shadow-lg shadow-emerald-700/20"
                    loading={loading}
                    disabled={loading}
                  >
                    Verify & Complete Registration
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-6 flex flex-col gap-3 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-amber-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Sending code..." : "Resend verification code"}
                  </button>

                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    Use a different email address
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}