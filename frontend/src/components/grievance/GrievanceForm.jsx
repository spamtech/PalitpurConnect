"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Star,
  Zap,
} from "lucide-react";
import { Badge, Button, Input, Spinner, Textarea } from "../ui";
import { api } from "../../services/api";

/* =========================================================
   INITIAL FORM
========================================================= */
const initialForm = {
  name: "",
  mobile: "",
  category: "",
  description: "",
};

/* =========================================================
   CATEGORIES
========================================================= */
const categories = [
  { value: "street-light", label: "💡 Street Light Issue" },
  { value: "water-supply", label: "🚰 Water Supply / Pipeline" },
  { value: "road-maintenance", label: "🛣️ Road & Drainage Maintenance" },
  { value: "general-inquiry", label: "📋 General Civic Inquiry" },
];

/* =========================================================
   VALIDATION
========================================================= */
function validateForm(form) {
  const errors = {};
  const name = form.name.trim();
  const mobile = form.mobile.trim();
  const description = form.description.trim();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must contain at least 2 characters.";
  } else if (name.length > 150) {
    errors.name = "Name cannot exceed 150 characters.";
  }

  if (!mobile) {
    errors.mobile = "Please enter your mobile number.";
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!form.category) {
    errors.category = "Please select an issue category.";
  }

  if (!description) {
    errors.description = "Please describe the issue.";
  } else if (description.length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  } else if (description.length > 500) {
    errors.description = "Description cannot exceed 500 characters.";
  }

  return errors;
}

/* =========================================================
   PROCESS STEP
========================================================= */
function ProcessStep({ number, title, description, icon, color }) {
  return (
    <div className="group relative flex gap-4">
      {/* Connector line */}
      <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-slate-200 to-transparent group-last:hidden" />

      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
      >
        {icon}
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-black text-slate-800 shadow-md ring-1 ring-slate-200">
          {number}
        </span>
      </div>

      <div className="pb-6">
        <h4 className="font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
          {title}
        </h4>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   STAT BADGE
========================================================= */
function StatBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
      <div className="text-amber-300">{icon}</div>
      <div>
        <p className="text-xs font-medium text-white/70">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SUCCESS STATE
========================================================= */
function SuccessState({ ticketNumber, onNewReport }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-white shadow-2xl">
      {/* Top gradient bar */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-500" />

      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative px-6 py-14 text-center sm:px-12">
        {/* Confetti dots */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {["top-8 left-12", "top-16 right-16", "top-24 left-1/3", "bottom-16 left-16", "bottom-8 right-12"].map((pos, i) => (
            <div
              key={i}
              className={`absolute h-2 w-2 rounded-full ${["bg-amber-400", "bg-emerald-400", "bg-teal-400", "bg-amber-300", "bg-emerald-300"][i]} opacity-60`}
              style={{ top: pos.split(" ")[0].replace("top-", ""), left: pos.split(" ")[1].replace("left-", "") }}
            />
          ))}
        </div>

        {/* Success icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-emerald-400/20" />
          <div className="relative flex h-24 w-24 animate-bounce items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-700/30">
            <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
          </div>
        </div>

        <Badge
          variant="success"
          className="border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2 text-sm shadow-sm"
        >
          ✨ Report Registered Successfully 🌸
        </Badge>

        <h3 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">
          Your grievance has been received! 🙏
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-500">
          Your civic issue has been securely registered in the Palitpur Panchayat portal.
          Please keep your reference number safe for status tracking.
        </p>

        {/* Ticket number box */}
        <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-emerald-50 shadow-lg">
          <div className="border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 px-6 py-3">
            <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-amber-800">
              <Sparkles size={13} className="text-amber-500" />
              Reference Ticket Number 🎫
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="break-all font-mono text-2xl font-black tracking-wider text-slate-950">
              {ticketNumber}
            </p>
          </div>
        </div>

        {/* Info chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["📧 SMS confirmation sent", "🔔 Updates via mobile", "📋 Track anytime"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
          <Button
            onClick={onNewReport}
            variant="primary"
            className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 font-bold shadow-lg shadow-emerald-700/25 hover:from-emerald-500 hover:to-teal-600"
          >
            Submit another report 📝
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            variant="outline"
            className="border-amber-300 px-8 font-bold text-slate-800 hover:bg-amber-50"
          >
            Back to home 🏠
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function GrievanceForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "", submit: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await api.submitGrievance({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        category: form.category,
        description: form.description.trim(),
      });
      const grievance = response?.data?.grievance || response?.data;
      const serverTicket = grievance?.ticket_number || grievance?.ticketNumber;
      if (!serverTicket) {
        throw new Error("Grievance was submitted, but the server did not return a ticket number.");
      }
      setTicketNumber(serverTicket);
    } catch (error) {
      console.error("Grievance submission failed:", error);
      let message = "Unable to submit your grievance. Please try again.";
      if (error?.message) message = error.message;
      if (error?.response?.data?.message) message = error.response.data.message;
      if (error?.data?.message) message = error.data.message;
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setTicketNumber("");
  }

  /* SUCCESS SCREEN */
  if (ticketNumber) {
    return (
      <section
        id="grievance"
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 px-6 py-24 sm:px-12 lg:px-16"
      >
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="mx-auto max-w-3xl">
            <SuccessState ticketNumber={ticketNumber} onNewReport={handleReset} />
          </div>
        </div>
      </section>
    );
  }

  /* FORM */
  return (
    <section
      id="grievance"
      className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-50 px-6 py-24 sm:px-12 lg:px-16"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1600px]">
        {/* ===== HERO HEADER ===== */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Decorative top badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 via-white to-emerald-50 px-5 py-2 shadow-sm">
            <span className="text-lg font-extrabold text-amber-600">卐</span>
            <span className="h-4 w-px bg-amber-200" />
            <span className="text-sm font-bold text-emerald-900">Citizen Grievance Portal 📝</span>
            <span className="h-4 w-px bg-emerald-200" />
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600">Live</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
            Report a civic issue
            <span className="mt-2 block bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              for quick resolution 🏛️.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-7 text-slate-600 sm:text-lg">
            Help us improve Palitpur village by reporting issues related to roads, water supply,
            street lights, and municipal services under community supervision.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: "✅", label: "Issues Resolved", value: "1,240+" },
              { icon: "⚡", label: "Avg. Response", value: "48 hrs" },
              { icon: "🏘️", label: "Villages Covered", value: "12" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm"
              >
                <span className="text-lg">{stat.icon}</span>
                <div className="text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="text-sm font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ===== FORM CARD ===== */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-amber-200/60 bg-white shadow-2xl shadow-amber-950/5">
              {/* Rainbow top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-500" />

              {/* Form header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-900/5 via-amber-500/5 to-transparent px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/25">
                    <FileText className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Submit a Grievance Report 📋
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Provide precise details below so the Palitpur Village team can investigate and act swiftly.
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-5 flex items-center gap-2">
                  {["Personal Info", "Issue Details", "Submit"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${i === 0 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs font-semibold ${i === 0 ? "text-emerald-700" : "text-slate-400"}`}>{step}</span>
                      {i < 2 && <div className="h-px w-6 bg-slate-200" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 sm:p-8">
                {/* Name + Mobile */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your name"
                    name="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    error={errors.name}
                  />
                  <Input
                    label="Mobile number"
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    error={errors.mobile}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-bold text-slate-800">
                    Issue category <span className="text-red-500">*</span>
                  </label>

                  {/* Visual category cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => !isSubmitting && updateField("category", cat.value)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                          form.category === cat.value
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 shadow-md shadow-emerald-100 ring-2 ring-emerald-300"
                            : errors.category
                            ? "border-red-300 bg-white text-slate-700 hover:border-red-400 hover:bg-red-50/30"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span className="text-base">{cat.label.split(" ")[0]}</span>
                        <span className="leading-tight">{cat.label.split(" ").slice(1).join(" ")}</span>
                      </button>
                    ))}
                  </div>

                  {/* Hidden select for form semantics */}
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <option value="">Select an issue category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div className="relative">
                  <Textarea
                    label="Describe the issue"
                    name="description"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell us what happened and specify exact landmarks in Palitpur..."
                    rows={6}
                    maxLength={500}
                    required
                    error={errors.description}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {form.description.length > 0 && (
                        <span className={form.description.length > 450 ? "text-amber-600 font-semibold" : ""}>
                          {form.description.length}/500 characters
                        </span>
                      )}
                    </p>
                    {form.description.length >= 10 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={12} /> Good detail
                      </span>
                    )}
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-teal-50/40 p-4 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-medium leading-5 text-slate-600">
                    <span className="font-bold text-emerald-800">Your data is safe.</span>{" "}
                    Your information is protected and used strictly for processing this civic request and providing status updates.
                  </p>
                </div>

                {/* API error */}
                {errors.submit && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm font-medium text-red-700 shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold">Submission failed</p>
                      <p className="mt-1 text-red-600">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 font-bold shadow-xl shadow-emerald-700/30 hover:from-emerald-500 hover:to-teal-700 sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" />
                        Submitting report... ⏳
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Submit grievance report 🚀
                      </>
                    )}
                  </Button>
                  <p className="text-xs font-medium text-slate-400">
                    🔒 Encrypted & secure submission
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="space-y-6 lg:col-span-5">
            {/* Workflow card */}
            <div className="overflow-hidden rounded-3xl border border-amber-200/60 shadow-xl">
              {/* Dark header */}
              <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 sm:px-8">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10" />
                <div className="pointer-events-none absolute -bottom-4 left-1/3 h-20 w-20 rounded-full bg-amber-500/10" />

                <div className="relative">
                  <Badge
                    variant="teal"
                    className="border border-amber-500/30 bg-amber-500/20 font-bold text-amber-300"
                  >
                    <Zap size={12} className="text-amber-400" />
                    Workflow Guide ⚡
                  </Badge>

                  <h3 className="mt-3 text-xl font-black text-white">
                    From report to resolution 🎯
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
                    Every submitted issue gets a tracked reference ticket so you remain fully informed.
                  </p>

                  {/* Mini stats */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatBadge icon={<Star size={13} />} label="Satisfaction" value="98%" />
                    <StatBadge icon={<Zap size={13} />} label="Avg. Resolution" value="3 days" />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="bg-white/95 p-6 sm:p-8">
                <ProcessStep
                  number="01"
                  title="Submit Report 📝"
                  description="Describe the problem clearly with local landmarks in Palitpur."
                  icon={<FileText size={18} />}
                  color="bg-gradient-to-tr from-amber-500 to-amber-600"
                />
                <ProcessStep
                  number="02"
                  title="Village Team Review 🔍"
                  description="The appropriate department reviews and categorizes the ticket."
                  icon={<ShieldCheck size={18} />}
                  color="bg-gradient-to-tr from-emerald-500 to-teal-600"
                />
                <ProcessStep
                  number="03"
                  title="On-Site Action 🛠️"
                  description="Local workers are dispatched to handle the repair or service."
                  icon={<Zap size={18} />}
                  color="bg-gradient-to-tr from-teal-500 to-cyan-600"
                />
                <ProcessStep
                  number="04"
                  title="Successful Resolution ✨"
                  description="Once fixed, the grievance is officially marked as resolved."
                  icon={<CheckCircle2 size={18} />}
                  color="bg-gradient-to-tr from-slate-700 to-slate-900"
                />
              </div>
            </div>

            {/* Location tip */}
            <div className="overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 shadow-md">
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-500" />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Include Exact Location 📍</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                      Mention nearby roads, temples, markets, or prominent landmarks for rapid identification.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["🛕 Temple", "🏪 Market", "🏫 School", "🛣️ Road name"].map((tag) => (
                    <span key={tag} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency help */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
              <div className="h-1 w-full bg-gradient-to-r from-slate-700 to-slate-900" />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 text-amber-400 shadow-lg">
                    <Phone className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Need Emergency Help? 🚨</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                      For life-threatening situations or fire/police emergencies, use the dedicated emergency contacts section above.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["🚒 Fire: 101", "🚔 Police: 100", "🚑 Ambulance: 108"].map((contact) => (
                    <span key={contact} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                      {contact}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}