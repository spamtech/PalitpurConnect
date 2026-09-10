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
  email: "",
  mobile: "",
  category: "",
  description: "",
};

/* =========================================================
   CATEGORIES
========================================================= */
const categories = [
  { value: "street-light", label: "💡 রাস্তার লাইটের সমস্যা" },
  { value: "water-supply", label: "🚰 জল সরবরাহ / পাইপলাইন" },
  { value: "road-maintenance", label: "🛣️ রাস্তা এবং নিকাশী রক্ষণাবেক্ষণ" },
  { value: "general-inquiry", label: "📋 সাধারণ নাগরিক অনুসন্ধান" },
];

/* =========================================================
   VALIDATION
========================================================= */
function validateForm(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const mobile = form.mobile.trim();
  const description = form.description.trim();

  if (!name) {
    errors.name = "দয়া করে আপনার নাম লিখুন।";
  } else if (name.length < 2) {
    errors.name = "নামে অন্তত ২টি অক্ষর থাকতে হবে।";
  } else if (name.length > 150) {
    errors.name = "নাম ১৫০ অক্ষরের বেশি হতে পারবে না।";
  }

  if (!email) {
    errors.email = "দয়া করে আপনার ইমেল ঠিকানা লিখুন।";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "একটি সঠিক ইমেল ঠিকানা লিখুন।";
  }

  if (!mobile) {
    errors.mobile = "দয়া করে আপনার মোবাইল নম্বর লিখুন।";
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = "একটি সঠিক ১০-সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।";
  }

  if (!form.category) {
    errors.category = "দয়া করে একটি সমস্যার বিভাগ নির্বাচন করুন।";
  }

  if (!description) {
    errors.description = "দয়া করে সমস্যাটি বর্ণনা করুন।";
  } else if (description.length < 10) {
    errors.description = "বর্ণনায় অন্তত ১০টি অক্ষর থাকতে হবে।";
  } else if (description.length > 500) {
    errors.description = "বর্ণনা ৫০০ অক্ষরের বেশি হতে পারবে না।";
  }

  return errors;
}

/* =========================================================
   PROCESS STEP
========================================================= */
function ProcessStep({ number, title, description, icon }) {
  return (
    <div className="group relative flex gap-4">
      {/* Connector line */}
      <div className="absolute left-5 top-12 h-full w-px bg-[#0c2218]/15 group-last:hidden" />

      <div
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218] transition-all duration-300 group-hover:scale-110"
      >
        {icon}
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-lg border border-[#173528] bg-[#e6ad45] text-[9px] font-black text-[#173528] shadow-sm">
          {number}
        </span>
      </div>

      <div className="pb-6">
        <h4 className="font-black text-[#173528] transition-colors group-hover:text-[#2d684d]">
          {title}
        </h4>
        <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#42604e]">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   STAT BADGE
========================================================= */
function StatBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#173528] bg-[#2d684d] px-4 py-2.5 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
      <div className="text-[#b8d85a]">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-[#e6ad45]">{label}</p>
        <p className="text-sm font-black text-[#f7f0d0]">{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SUCCESS STATE
========================================================= */
function SuccessState({ ticketNumber, onNewReport }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[15px_15px_0_rgba(12,34,24,0.4)] p-0">
      {/* Top bar */}
      <div className="h-2 w-full bg-[#0c2218]" />

      <div className="relative px-6 py-14 text-center sm:px-12">
        {/* Success icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-[#b8d85a]/40" />
          <div className="relative flex h-24 w-24 animate-bounce items-center justify-center rounded-3xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[6px_6px_0_#0c2218]">
            <CheckCircle2 className="h-12 w-12" aria-hidden="true" strokeWidth={2.5} />
          </div>
        </div>

        <span className="inline-flex rounded-xl bg-[#2d684d] px-4 py-1.5 text-xs font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] uppercase tracking-widest">
          ✨ সফলভাবে প্রতিবেদন নিবন্ধিত হয়েছে 🌸
        </span>

        <h3 className="mt-5 text-2xl font-black text-[#173528] sm:text-3xl">
          আপনার অভিযোগ গ্রহণ করা হয়েছে! 🙏
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#42604e]">
          আপনার নাগরিক সমস্যাটি নিরাপদে পালিতপুর পঞ্চায়েত পোর্টালে নিবন্ধিত হয়েছে এবং আপনার ইমেলে টিকেট নম্বর পাঠানো হয়েছে।
          অবস্থা ট্র্যাকিংয়ের জন্য আপনার রেফারেন্স নম্বরটি সুরক্ষিত রাখুন।
        </p>

        {/* Ticket number box */}
        <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl border-2 border-[#0c2218] bg-white text-[#173528] shadow-[6px_6px_0_#0c2218]">
          <div className="border-b-2 border-[#0c2218] bg-[#b8d85a] px-6 py-3">
            <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#173528]">
              <Sparkles size={13} />
              রেফারেন্স টিকেট নম্বর 🎫
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="break-all font-mono text-2xl font-black tracking-wider text-[#173528]">
              {ticketNumber}
            </p>
          </div>
        </div>

        {/* Info chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["📧 ইমেল নিশ্চিতকরণ পাঠানো হয়েছে", "🔔 মোবাইলের মাধ্যমে আপডেট", "📋 যেকোনো সময় ট্র্যাক করুন"].map((item) => (
            <span
              key={item}
              className="rounded-xl border-2 border-[#0c2218] bg-[#2d684d] px-3.5 py-1 text-xs font-black text-[#f7f0d0] shadow-[3px_3px_0_#0c2218]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
          <button
            onClick={onNewReport}
            type="button"
            className="rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-8 py-3.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45]"
          >
            অন্য একটি প্রতিবেদন জমা দিন 📝
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            type="button"
            className="rounded-2xl border-[2px] border-[#0c2218] bg-white px-8 py-3.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#b8d85a]"
          >
            হোমে ফিরে যান 🏠
          </button>
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

  // Tracking states
  const [trackInput, setTrackInput] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [showTracker, setShowTracker] = useState(false);

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
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        category: form.category,
        description: form.description.trim(),
      });
      const grievance = response?.data?.grievance || response?.data;
      const serverTicket = grievance?.ticket_number || grievance?.ticketNumber;
      if (!serverTicket) {
        throw new Error("অভিযোগ জমা দেওয়া হয়েছে, কিন্তু সার্ভার কোনো টিকেট নম্বর ফেরত দেয়নি।");
      }

      // Save to local storage for local tracking capability
      const localRecord = {
        ticketNumber: serverTicket,
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        category: form.category,
        description: form.description.trim(),
        status: "বিবেচনাধীন ⏳",
        created_at: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("palitpur_grievances") || "[]");
      localStorage.setItem("palitpur_grievances", JSON.stringify([localRecord, ...existing]));

      setTicketNumber(serverTicket);
    } catch (error) {
      console.error("Grievance submission failed:", error);
      let message = "আপনার অভিযোগ জমা দেওয়া যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।";
      if (error?.message) message = error.message;
      if (error?.response?.data?.message) message = error.response.data.message;
      if (error?.data?.message) message = error.data.message;
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTrackGrievance(event) {
    event.preventDefault();
    const ticket = trackInput.trim();
    if (!ticket) {
      setTrackError("দয়া করে একটি সঠিক টিকেট নম্বর লিখুন।");
      return;
    }
    setTrackLoading(true);
    setTrackError("");
    setTrackedGrievance(null);

    try {
      const response = await api.trackGrievance(ticket);
      const grievance = response?.data?.grievance || response?.data;

      if (!grievance) {
        throw new Error("এই টিকেট নম্বরের সাথে কোনো অভিযোগ পাওয়া যায়নি।");
      }

      setTrackedGrievance(grievance);
    } catch (error) {
      console.error("Tracking failed:", error);
      let message = "এই টিকেট নম্বর দিয়ে কোনো অভিযোগ খুঁজে পাওয়া যায়নি।";
      if (error?.message) message = error.message;
      setTrackError(message);
    } finally {
      setTrackLoading(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setTicketNumber("");
    setTrackInput("");
    setTrackedGrievance(null);
    setTrackError("");
  }

  /* SUCCESS SCREEN */
  if (ticketNumber) {
    return (
      <section
        id="grievance"
        className="relative w-full overflow-hidden bg-[#173528] text-[#f7f0d0] px-6 py-24 sm:px-12 lg:px-16 border-b-[3px] border-[#0c2218]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
          <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>
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
      className="relative w-full overflow-hidden bg-[#173528] text-[#f7f0d0] px-6 py-24 sm:px-12 lg:px-16 border-b-[3px] border-[#0c2218]"
    >
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        {/* ===== HERO HEADER ===== */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Decorative top badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-1.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] uppercase tracking-wider">
            <span className="text-[#b07820] font-black">卐</span>
            <span className="h-4 w-px bg-[#0c2218]" />
            <span>নাগরিক অভিযোগ পোর্টাল 📝</span>
            <span className="h-4 w-px bg-[#0c2218]" />
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#b8d85a] animate-pulse" />
            <span className="text-[#173528] font-black">লাইভ</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#f7f0d0] sm:text-4xl lg:text-5xl xl:text-6xl">
            দ্রুত সমাধানের জন্য একটি নাগরিক
            <span className="mt-2 block text-[#b8d85a]">
              সমস্যা রিপোর্ট করুন 🏛️।
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#dfe8c4] sm:text-lg">
            সম্প্রদায়ের তত্ত্বাবধানে রাস্তা, জল সরবরাহ, রাস্তার লাইট এবং পৌর পরিষেবা সম্পর্কিত সমস্যাগুলি রিপোর্ট করে পালিতপুর গ্রামকে উন্নত করতে আমাদের সাহায্য করুন।
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: "✅", label: "সমাধানকৃত সমস্যা", value: "১৪০+" },
              { icon: "⚡", label: "গড় প্রতিক্রিয়া", value: "৪৮ ঘণ্টা" },
              { icon: "🏘️", label: "আচ্ছাদিত গ্রাম", value: "১" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] px-4 py-2.5 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]"
              >
                <span className="text-lg">{stat.icon}</span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#e6ad45]">{stat.label}</p>
                  <p className="text-sm font-black text-[#f7f0d0]">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ===== FORM CARD ===== */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
              {/* Top bar */}
              <div className="h-2 w-full bg-[#0c2218]" />

              {/* Form header */}
              <div className="border-b-[3px] border-[#0c2218] bg-[#2d684d] px-6 py-6 sm:px-8 text-[#f7f0d0]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                    <FileText className="h-7 w-7" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#f7f0d0]">
                      একটি অভিযোগ প্রতিবেদন জমা দিন 📋
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#dfe8c4]">
                      নিচে সঠিক বিবরণ দিন যাতে পালিতপুর গ্রাম টিম দ্রুত তদন্ত করতে এবং পদক্ষেপ নিতে পারে।
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-5 flex items-center gap-2">
                  {["ব্যক্তিগত তথ্য", "সমস্যার বিবরণ", "জমা দিন"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-lg border border-[#173528] text-xs font-black ${i === 0 ? "bg-[#b8d85a] text-[#173528]" : "bg-[#173528]/20 text-[#f7f0d0]"}`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs font-black ${i === 0 ? "text-[#f7f0d0]" : "text-[#dfe8c4]/60"}`}>{step}</span>
                      {i < 2 && <div className="h-px w-6 bg-[#0c2218]/30" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 sm:p-8">
                {/* Name + Email + Mobile */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="আপনার নাম"
                    name="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    autoComplete="name"
                    required
                    error={errors.name}
                  />
                  <Input
                    label="ইমেল ঠিকানা"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="ticket@example.com"
                    autoComplete="email"
                    required
                    error={errors.email}
                  />
                </div>

                <div>
                  <Input
                    label="মোবাইল নম্বর"
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="১০-সংখ্যার মোবাইল নম্বর"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    error={errors.mobile}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-black text-[#173528]">
                    সমস্যার বিভাগ <span className="text-red-600">*</span>
                  </label>

                  {/* Visual category cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => !isSubmitting && updateField("category", cat.value)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2.5 rounded-2xl border-[2px] border-[#0c2218] px-4 py-3 text-left text-xs sm:text-sm font-black transition-all duration-200 shadow-[3px_3px_0_#0c2218] ${
                          form.category === cat.value
                            ? "bg-[#b8d85a] text-[#173528]"
                            : errors.category
                            ? "bg-red-100 text-[#173528]"
                            : "bg-white text-[#173528] hover:bg-[#b8d85a]/30"
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
                    <option value="">একটি সমস্যা বিভাগ নির্বাচন করুন</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="mt-1.5 text-xs font-black text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div className="relative">
                  <Textarea
                    label="সমস্যাটি বর্ণনা করুন"
                    name="description"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="কী ঘটেছে তা বলুন এবং পালিতপুরের সঠিক ল্যান্ডমার্ক উল্লেখ করুন..."
                    rows={6}
                    maxLength={500}
                    required
                    error={errors.description}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#58705e]">
                      {form.description.length > 0 && (
                        <span className={form.description.length > 450 ? "text-amber-700 font-black" : ""}>
                          {form.description.length}/৫০০ অক্ষর
                        </span>
                      )}
                    </p>
                    {form.description.length >= 10 && (
                      <span className="flex items-center gap-1 text-xs font-black text-[#2d684d]">
                        <CheckCircle2 size={12} /> যথেষ্ট বিবরণ দেওয়া হয়েছে
                      </span>
                    )}
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="flex items-start gap-3 rounded-2xl border-2 border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-[#173528]">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-[#dfe8c4]">
                    <span className="font-black text-[#f7f0d0]">আপনার তথ্য নিরাপদ।</span>{" "}
                    আপনার তথ্য সুরক্ষিত এবং কঠোরভাবে এই নাগরিক অনুরোধ প্রক্রিয়াকরণ এবং ইমেল স্ট্যাটাস আপডেট প্রদানের জন্য ব্যবহৃত হয়।
                  </p>
                </div>

                {/* API error */}
                {errors.submit && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border-2 border-[#0c2218] bg-red-100 p-4 text-xs font-bold text-red-900 shadow-[4px_4px_0_#0c2218]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-700" />
                    </div>
                    <div>
                      <p className="font-black">জমা দেওয়া ব্যর্থ হয়েছে</p>
                      <p className="mt-1 text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-8 py-4 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218] disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" />
                        প্রতিবেদন জমা দেওয়া হচ্ছে... ⏳
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        অভিযোগ প্রতিবেদন জমা দিন 🚀
                      </>
                    )}
                  </button>
                  <p className="text-xs font-black text-[#58705e]">
                    🔒 এনক্রিপ্ট করা এবং নিরাপদ জমা
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="space-y-6 lg:col-span-5">
            
            {/* ===== IN-PAGE TRACKING CARD ===== */}
            <div className="overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
              <div className="border-b-[3px] border-[#0c2218] bg-[#e6ad45] px-6 py-5 text-[#173528]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <span>🔍</span> অভিযোগের স্থিতি ট্র্যাক করুন
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTracker(!showTracker)}
                    className="rounded-xl border-2 border-[#173528] bg-[#f7f0d0] px-3 py-1 text-xs font-black shadow-[2px_2px_0_#0c2218] hover:bg-[#b8d85a] transition-all"
                  >
                    {showTracker ? "লুকান 🔼" : "খুলুন 🔽"}
                  </button>
                </div>
                <p className="mt-1 text-xs font-medium text-[#173528]/80">
                  ইতিমধ্যে একটি সমস্যা জমা দিয়েছেন? এখনই এর লাইভ অগ্রগতি পরীক্ষা করুন।
                </p>
              </div>

              {showTracker && (
                <div className="p-6 space-y-4 bg-white/50">
                  <form onSubmit={handleTrackGrievance} className="space-y-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[#173528]">
                        রেফারেন্স টিকেট নম্বর 🎫
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackInput}
                          onChange={(e) => setTrackInput(e.target.value)}
                          placeholder="যেমন: TKT-948210"
                          className="w-full rounded-2xl border-2 border-[#0c2218] bg-white px-3.5 py-2.5 text-xs font-mono font-black text-[#173528] shadow-[3px_3px_0_#0c2218] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={trackLoading}
                          className="rounded-2xl border-2 border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 text-xs font-black text-[#173528] shadow-[3px_3px_0_#0c2218] hover:bg-[#e6ad45] disabled:opacity-50 shrink-0"
                        >
                          {trackLoading ? "যাচাই করা হচ্ছে..." : "অনুসন্ধান"}
                        </button>
                      </div>
                    </div>

                    {trackError && (
                      <div className="rounded-xl border-2 border-[#0c2218] bg-red-100 p-2.5 text-xs font-bold text-red-900 shadow-[2px_2px_0_#0c2218]">
                        {trackError}
                      </div>
                    )}
                  </form>

                  {/* Tracked Details Result Box */}
                  {trackedGrievance && (
                    <div className="mt-4 rounded-2xl border-2 border-[#0c2218] bg-white p-4 text-[#173528] shadow-[4px_4px_0_#0c2218] space-y-3">
                      <div className="flex items-center justify-between border-b-2 border-dashed border-[#0c2218] pb-2">
                        <span className="text-[10px] font-black uppercase text-[#58705e]">বর্তমান স্থিতি</span>
                        <span className="rounded-lg bg-[#b8d85a] px-2.5 py-0.5 text-xs font-black border border-[#0c2218] uppercase">
                          {trackedGrievance.status || "বিবেচনাধীন ⏳"}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs font-medium text-[#42604e]">
                        <p><strong className="font-black text-[#173528]">নাম:</strong> {trackedGrievance.name}</p>
                        <p><strong className="font-black text-[#173528]">বিভাগ:</strong> {trackedGrievance.category}</p>
                        <p><strong className="font-black text-[#173528]">বিবরণ:</strong> {trackedGrievance.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Workflow card */}
            <div className="overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
              {/* Dark header */}
              <div className="relative overflow-hidden border-b-[3px] border-[#0c2218] bg-[#2d684d] px-6 py-7 sm:px-8 text-[#f7f0d0]">
                <div className="relative">
                  <span className="inline-flex rounded-xl bg-[#b8d85a] px-3.5 py-1 text-xs font-black border-2 border-[#173528] text-[#173528] shadow-[3px_3px_0_#173528] uppercase tracking-wider">
                    <Zap size={12} className="inline mr-1" /> কার্যপ্রবাহ নির্দেশিকা ⚡
                  </span>

                  <h3 className="mt-3 text-xl font-black text-[#f7f0d0]">
                    প্রতিবেদন থেকে সমাধান পর্যন্ত 🎯
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">
                    প্রতিটি জমা দেওয়া সমস্যার একটি ট্র্যাক করা রেফারেন্স টিকেট থাকে যাতে আপনি সম্পূর্ণ অবহিত থাকেন।
                  </p>

                  {/* Mini stats */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatBadge icon={<Star size={13} />} label="সন্তুষ্টি" value="৯৮%" />
                    <StatBadge icon={<Zap size={13} />} label="গড় সমাধান" value="৩ দিন" />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="bg-[#f7f0d0] p-6 sm:p-8">
                <ProcessStep
                  number="০১"
                  title="প্রতিবেদন জমা দিন 📝"
                  description="পালিতপুরের স্থানীয় ল্যান্ডমার্ক সহ সমস্যাটি পরিষ্কারভাবে বর্ণনা করুন।"
                  icon={<FileText size={18} strokeWidth={2.5} />}
                />
                <ProcessStep
                  number="০২"
                  title="গ্রাম টিম পর্যালোচনা 🔍"
                  description="সংশ্লিষ্ট বিভাগ টিকেট পর্যালোচনা এবং শ্রেণীবদ্ধ করে।"
                  icon={<ShieldCheck size={18} strokeWidth={2.5} />}
                />
                <ProcessStep
                  number="০৩"
                  title="অন-সাইট পদক্ষেপ 🛠️"
                  description="মেরামত বা পরিষেবা পরিচালনা করার জন্য স্থানীয় কর্মীদের পাঠানো হয়।"
                  icon={<Zap size={18} strokeWidth={2.5} />}
                />
                <ProcessStep
                  number="০৪"
                  title="সফল সমাধান ✨"
                  description="একবার ঠিক হয়ে গেলে, অভিযোগটিকে আনুষ্ঠানিকভাবে সমাধান করা হয়েছে বলে চিহ্নিত করা হয়।"
                  icon={<CheckCircle2 size={18} strokeWidth={2.5} />}
                />
              </div>
            </div>

            {/* Location tip */}
            <div className="overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                  <MapPin className="h-6 w-6" aria-hidden="true" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-base">সঠিক অবস্থান অন্তর্ভুক্ত করুন 📍</h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#42604e]">
                    দ্রুত শনাক্তকরণের জন্য কাছাকাছি রাস্তা, মন্দির, বাজার বা বিশিষ্ট ল্যান্ডমার্ক উল্লেখ করুন।
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["🛕 মন্দির", "🏪 বাজার", "🏫 স্কুল", "🛣️ রাস্তার নাম"].map((tag) => (
                  <span key={tag} className="rounded-xl border-2 border-[#0c2218] bg-[#2d684d] px-3 py-1 text-xs font-black text-[#f7f0d0] shadow-[2px_2px_0_#0c2218]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency help */}
            <div className="overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#10281e] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#173528] bg-red-600 text-white shadow-[4px_4px_0_#0c2218]">
                  <Phone className="h-6 w-6" aria-hidden="true" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#f7f0d0]">জরুরি সাহায্যের প্রয়োজন? 🚨</h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">
                    জীবন-সংকটপূর্ণ পরিস্থিতি বা আগুন/পুলিশের জরুরি অবস্থার জন্য, উপরের নিবেদিত জরুরি যোগাযোগ বিভাগটি ব্যবহার করুন।
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["🚒 দমকল: ১০১", "🚔 পুলিশ: ১০০", "🚑 অ্যাম্বুলেন্স: ১০৮"].map((contact) => (
                  <span key={contact} className="rounded-xl border-2 border-[#0c2218] bg-[#2d684d] px-3 py-1 text-xs font-black text-[#f7f0d0] shadow-[2px_2px_0_#0c2218]">
                    {contact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}