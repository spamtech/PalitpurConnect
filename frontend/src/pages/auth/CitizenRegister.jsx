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
  const [village, setVillage] = useState("পালিতপুর");
  const [district, setDistrict] = useState("বীরভূম");
  const [state, setState] = useState("পশ্চিমবঙ্গ");
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
      setError("দয়া করে আপনার পুরো নাম লিখুন।");
      return;
    }
    if (trimmedName.length < 2) {
      setError("দয়া করে একটি সঠিক পুরো নাম লিখুন।");
      return;
    }
    if (!trimmedEmail) {
      setError("দয়া করে আপনার ইমেল ঠিকানা লিখুন।");
      return;
    }
    if (!password) {
      setError("দয়া করে একটি পাসওয়ার্ড তৈরি করুন।");
      return;
    }
    if (password.length < 8) {
      setError("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }
    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("একটি সঠিক ১০-সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।");
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
        village: village.trim() || "পালিতপুর",
        district: district.trim() || "বীরভূম",
        state: state.trim() || "পশ্চিমবঙ্গ",
      });

      setEmail(trimmedEmail);
      setStep(2);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.message || "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
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
      setError("দয়া করে ৬-সংখ্যার যাচাইকরণ কোডটি লিখুন।");
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
        error.message || "যাচাইকরণ ব্যর্থ হয়েছে। ওটিপি (OTP) পরীক্ষা করে আবার চেষ্টা করুন।"
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
      setError(error.message || "ওটিপি (OTP) পুনরায় পাঠানো যাচ্ছে না। আবার চেষ্টা করুন।");
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
                যুক্ত হোন
                <span className="block text-[#b8d85a] mt-1">
                  পালিতপুর কানেক্ট-এ।
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#dfe8c4]">
                গ্রামের ঘোষণা, স্থানীয় ডিরেক্টরি, জরুরি হটলাইন এবং তাত্ক্ষণিক অভিযোগ ট্র্যাক করার সুবিধা পেতে আপনার যাচাইকৃত নাগরিক অ্যাকাউন্ট তৈরি করুন।
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  গ্রাম যাচাইকৃত নিরাপদ বাসস্থান
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  রিয়েল-টাইম নাগরিক অভিযোগ ট্র্যাকিং
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <CheckCircle2 className="h-5 w-5 text-[#b8d85a] shrink-0" />
                  গ্রামের পরিষেবাগুলিতে ২৪/৭ সরাসরি অ্যাক্সেস
                </div>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e6ad45]">
              পালিতপুর • বীরভূম • পশ্চিমবঙ্গ
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT FORM PANEL (7 cols)
        ====================================================== */}
        <div className="flex items-center justify-center bg-[#173528] px-6 py-12 sm:px-12 lg:col-span-7">
          <div className="w-full max-w-xl rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 sm:p-10 text-[#173528] shadow-[10px_10px_0_rgba(12,34,24,0.3)]">
            {/* Mobile back link */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-xs font-black text-[#173528] transition hover:bg-[#e6ad45] rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 shadow-[4px_4px_0_#0c2218] lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              হোমে ফিরে যান
            </Link>

            {/* =================================================
                STEP 1 — CREATE ACCOUNT
            ================================================== */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <span className="inline-flex rounded-xl bg-[#2d684d] px-3.5 py-1 text-xs font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] tracking-widest uppercase">
                    নাগরিক নিবন্ধন
                  </span>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-[#173528] sm:text-4xl">
                    আপনার অ্যাকাউন্ট তৈরি করুন 🏛️
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#42604e]">
                    পোর্টালের সমস্ত সুযোগ-সুবিধা পেতে পালিতপুরের বাসিন্দা হিসেবে নিবন্ধন করুন।
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-xs font-black text-[#173528] shadow-[3px_3px_0_#0c2218]">
                    ১
                  </div>
                  <div className="h-2 flex-1 rounded-full border-2 border-[#173528] bg-[#173528]/10 overflow-hidden">
                    <div className="h-full w-1/2 bg-[#b8d85a]" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#173528]/10 text-xs font-bold text-[#173528]/50">
                    ২
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="পুরো নাম(Full Name) *"
                      type="text"
                      placeholder="আপনার পুরো নাম লিখুন"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      icon={User}
                      autoComplete="name"
                      required
                    />

                    <Input
                      label="ইমেল ঠিকানা *"
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
                        label="পাসওয়ার্ড *"
                        type={showPassword ? "text" : "password"}
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={LockKeyhole}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-[38px] rounded-xl border-2 border-[#173528] bg-[#b8d85a] p-1.5 text-[#173528] shadow-[2px_2px_0_#173528] transition hover:bg-[#e6ad45]"
                        aria-label="পাসওয়ার্ড দৃশ্যমানতা পরিবর্তন করুন"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="পাসওয়ার্ড নিশ্চিত করুন *"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="পাসওয়ার্ড আবার লিখুন"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={LockKeyhole}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-[38px] rounded-xl border-2 border-[#173528] bg-[#b8d85a] p-1.5 text-[#173528] shadow-[2px_2px_0_#173528] transition hover:bg-[#e6ad45]"
                        aria-label="কনফার্ম পাসওয়ার্ড দৃশ্যমানতা পরিবর্তন করুন"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      label="মোবাইল নম্বর"
                      type="tel"
                      placeholder="১০-সংখ্যার নম্বর"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      icon={Phone}
                      maxLength={10}
                    />

                    <Input
                      label="গ্রাম"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      icon={MapPin}
                    />

                    <Input
                      label="জেলা"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      icon={MapPin}
                    />
                  </div>

                  <Input
                    label="রাস্তার ঠিকানা / এলাকার ল্যান্ডমার্ক"
                    type="text"
                    placeholder="যেমন: পালিতপুর প্রাথমিক বিদ্যালয়ের কাছে"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    icon={MapPin}
                  />

                  {error && (
                    <div className="rounded-2xl border-2 border-[#0c2218] bg-red-100 px-4 py-3 text-xs font-bold text-red-800 shadow-[4px_4px_0_#0c2218]">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
                    loading={loading}
                    disabled={loading}
                  >
                    যাচাইকরণে এগিয়ে যান
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-8 border-t-2 border-[#173528]/15 pt-6 text-center">
                  <p className="text-xs sm:text-sm font-semibold text-[#42604e]">
                    ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{" "}
                    <Link
                      to="/login"
                      className="font-black text-[#2d684d] hover:text-[#b07820] transition-colors"
                    >
                      এখানে সাইন ইন করুন
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
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                    <Mail className="h-7 w-7" />
                  </div>

                  <span className="inline-flex rounded-xl bg-[#2d684d] px-3.5 py-1 text-xs font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] tracking-widest uppercase">
                    ইমেল যাচাইকরণ
                  </span>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-[#173528]">
                    আপনার ইমেল যাচাই করুন 📬
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#42604e]">
                    আমরা <span className="font-bold text-[#173528] break-all">{email}</span> ঠিকানায় একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠিয়েছি।
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#2d684d] text-xs font-bold text-[#f7f0d0] shadow-[3px_3px_0_#0c2218]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="h-2 flex-1 rounded-full border-2 border-[#173528] bg-[#2d684d]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-xs font-black text-[#173528] shadow-[3px_3px_0_#0c2218]">
                    ২
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <Input
                    label="যাচাইকরণ কোড"
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
                    <div className="rounded-2xl border-2 border-[#0c2218] bg-red-100 px-4 py-3 text-xs font-bold text-red-800 shadow-[4px_4px_0_#0c2218]">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
                    loading={loading}
                    disabled={loading}
                  >
                    যাচাই করুন এবং নিবন্ধন সম্পূর্ণ করুন
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-6 flex flex-col gap-3 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#2d684d] hover:text-[#b07820] disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "কোড পাঠানো হচ্ছে..." : "যাচাইকরণ কোড পুনরায় পাঠান"}
                  </button>

                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs sm:text-sm font-semibold text-[#58705e] hover:text-[#173528]"
                  >
                    অন্য একটি ইমেল ঠিকানা ব্যবহার করুন
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