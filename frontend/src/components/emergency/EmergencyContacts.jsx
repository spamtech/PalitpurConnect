import { useEffect, useState } from "react";

import {
  Ambulance,
  ArrowUpRight,
  Building2,
  Flame,
  Phone,
  ShieldAlert,
  Zap,
  Sparkles,
  Siren,
  HeartPulse,
} from "lucide-react";

import { Badge, Button, Card } from "../ui";
import { api } from "../../services/api";

/* =========================================================
   ICON + LABEL HELPERS
========================================================= */

function getEmergencyIcon(service = "") {
  const value = service.toLowerCase();

  if (
    value.includes("police") ||
    value.includes("law") ||
    value.includes("security")
  ) {
    return ShieldAlert;
  }

  if (
    value.includes("ambulance") ||
    value.includes("medical") ||
    value.includes("hospital") ||
    value.includes("health")
  ) {
    return Ambulance;
  }

  if (
    value.includes("fire") ||
    value.includes("rescue") ||
    value.includes("disaster")
  ) {
    return Flame;
  }

  if (
    value.includes("electric") ||
    value.includes("power") ||
    value.includes("electricity")
  ) {
    return Zap;
  }

  if (
    value.includes("panchayat") ||
    value.includes("government") ||
    value.includes("administration")
  ) {
    return Building2;
  }

  return Siren;
}

function getEmergencyEmoji(service = "") {
  const value = service.toLowerCase();

  if (
    value.includes("police") ||
    value.includes("law") ||
    value.includes("security")
  ) {
    return "🚨";
  }

  if (
    value.includes("ambulance") ||
    value.includes("medical") ||
    value.includes("hospital") ||
    value.includes("health")
  ) {
    return "🚑";
  }

  if (
    value.includes("fire") ||
    value.includes("rescue") ||
    value.includes("disaster")
  ) {
    return "🚒";
  }

  if (
    value.includes("electric") ||
    value.includes("power") ||
    value.includes("electricity")
  ) {
    return "⚡";
  }

  if (
    value.includes("panchayat") ||
    value.includes("government") ||
    value.includes("administration")
  ) {
    return "🏛️";
  }

  return "🆘";
}

function getEmergencyLabel(service = "") {
  if (!service) {
    return "জরুরি পরিষেবা";
  }

  const serviceMap = {
    police: "পুলিশ",
    ambulance: "অ্যাম্বুলেন্স",
    medical: "চিকিৎসা",
    hospital: "হাসপাতাল",
    health: "স্বাস্থ্য",
    fire: "দমকল",
    rescue: "উদ্ধার",
    electric: "বিদ্যুৎ",
    power: "বিদ্যুৎ",
    electricity: "বিদ্যুৎ",
    panchayat: "পঞ্চায়েত",
    government: "সরকার",
    administration: "প্রশাসন",
  };

  const key = String(service).toLowerCase();
  return serviceMap[key] || service;
}

/* =========================================================
   NORMALIZE API DATA
========================================================= */

function normalizeContact(contact) {
  return {
    id: contact.id,
    name: contact.name || "জরুরি পরিষেবা",
    service: contact.service || "জরুরি পরিষেবা",
    number: contact.phone || "",
    alternateNumber: contact.alternate_phone || "",
    description:
      contact.description ||
      "তাত্ক্ষণিক জরুরি সহায়তার জন্য এই পরিষেবার সাথে যোগাযোগ করুন।",
    label: getEmergencyLabel(contact.service),
    emoji: getEmergencyEmoji(contact.service),
    icon: getEmergencyIcon(contact.service),
    isActive: contact.is_active !== false,
    displayOrder: Number(contact.display_order) || 0,
  };
}

/* =========================================================
   EMERGENCY CARD
========================================================= */

function EmergencyCard({ contact }) {
  const Icon = contact.icon;

  const phoneNumber = contact.number.replace(/[^\d+]/g, "");

  return (
    <Card
      hover
      className="group relative overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-0 text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff9e6]"
    >
      {/* Top red/amber warning strip */}
      <div className="h-2 w-full bg-red-600 animate-pulse" />

      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#173528] bg-red-600 text-white shadow-[4px_4px_0_#0c2218] transition duration-300 group-hover:scale-110">
            <Icon size={26} strokeWidth={2.5} />

            <span className="absolute -bottom-1 -right-1 rounded-xl border-2 border-[#173528] bg-[#f7f0d0] px-1.5 text-xs shadow-[2px_2px_0_#0c2218]">
              {contact.emoji}
            </span>
          </div>

          <span className="rounded-xl bg-red-100 px-3 py-1 text-[10px] font-black border-2 border-[#0c2218] text-red-900 shadow-[3px_3px_0_#0c2218] uppercase tracking-wider animate-pulse">
            জরুরি 🚨
          </span>
        </div>

        {/* Name */}
        <h3 className="mt-5 text-xl font-black tracking-tight text-[#173528] transition-colors group-hover:text-red-700">
          {contact.name}
        </h3>

        {/* Service */}
        <p className="mt-1 text-xs font-black uppercase tracking-widest text-red-700">
          {contact.label}
        </p>

        {/* Description */}
        <p className="mt-3 flex-1 text-xs sm:text-sm font-medium leading-relaxed text-[#42604e]">
          {contact.description}
        </p>

        {/* Phone number */}
        <div className="mt-6 rounded-2xl border-2 border-[#0c2218] bg-[#2d684d] p-4 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#e6ad45]">
            <Phone size={12} className="text-[#b8d85a]" />
            সরাসরি জরুরি হটলাইন
          </p>

          <p className="mt-1 font-mono text-2xl font-black tracking-tight text-[#f7f0d0]">
            {contact.number || "উপলব্ধ নেই"}
          </p>

          {contact.alternateNumber && (
            <p className="mt-2 text-xs font-semibold text-[#dfe8c4]">
              বিকল্প:{" "}
              <span className="font-mono text-[#f7f0d0] font-bold">
                {contact.alternateNumber}
              </span>
            </p>
          )}
        </div>

        {/* Call button */}
        {phoneNumber ? (
          <a
            href={`tel:${phoneNumber}`}
            className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-2xl border-[2px] border-[#0c2218] bg-red-600 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[5px_5px_0_#0c2218]"
          >
            <Phone size={16} className="animate-bounce" />
            এখনই কল করুন 📞
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-[#0c2218] bg-[#173528]/10 px-5 py-3.5 text-center text-xs font-bold text-[#58705e]">
            ফোন নম্বর উপলব্ধ নেই
          </div>
        )}
      </div>
    </Card>
  );
}

/* =========================================================
   MAIN EMERGENCY COMPONENT
========================================================= */

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEmergencyContacts() {
      try {
        setLoading(true);
        setError("");

        const response = await api.getEmergencyContacts();

        const data = response?.data?.contacts;

        if (!Array.isArray(data)) {
          throw new Error(
            "সার্ভার থেকে জরুরি যোগাযোগের ভুল ডেটা এসেছে।"
          );
        }

        if (!mounted) {
          return;
        }

        const normalizedContacts = data
          .map(normalizeContact)
          .filter((contact) => contact.isActive)
          .sort((a, b) => {
            if (a.displayOrder !== b.displayOrder) {
              return a.displayOrder - b.displayOrder;
            }

            return a.name.localeCompare(b.name);
          });

        setContacts(normalizedContacts);
      } catch (err) {
        console.error(
          "জরুরি যোগাযোগ লোড করতে ব্যর্থ হয়েছে:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "জরুরি যোগাযোগ লোড করা যাচ্ছে না।"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEmergencyContacts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="emergency"
      className="relative w-full overflow-hidden bg-[#173528] text-[#f7f0d0] px-6 py-20 sm:px-12 sm:py-24 lg:px-16 border-b-[3px] border-[#0c2218]"
    >
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        {/* Section heading */}
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-1.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] uppercase tracking-wider">
            <ShieldAlert size={14} className="text-red-600" />
            <span>পালিতপুর জরুরি প্রতিক্রিয়া 🚨</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#f7f0d0] sm:text-4xl lg:text-5xl">
            আপনার যখন সবচেয়ে বেশি
            <span className="mt-1 block text-[#b8d85a]">
              প্রয়োজন 🛡️।
            </span>
          </h2>

          <p className="mt-5 text-base font-medium leading-relaxed text-[#dfe8c4] sm:text-lg">
            এই গুরুত্বপূর্ণ জরুরি নম্বরগুলি সহজেই অ্যাক্সেসযোগ্য রাখুন। জীবন-সংকটপূর্ণ পরিস্থিতি বা সংকটের ক্ষেত্রে, অবিলম্বে উপযুক্ত জরুরি পরিষেবার সাথে যোগাযোগ করুন।
          </p>
        </div>

        {/* Warning banner */}
        <div className="mt-8 flex flex-col gap-4 rounded-[24px] border-[3px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#173528] bg-red-600 text-white shadow-[3px_3px_0_#0c2218]">
              <Siren size={24} className="animate-pulse" />
            </div>

            <div>
              <p className="flex items-center gap-2 text-base font-black text-[#f7f0d0]">
                জরুরি পরিস্থিতি প্রোটোকল ⚠️
              </p>

              <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">
                শান্ত থাকুন, পালিতপুরে আপনার সঠিক অবস্থান স্পষ্টভাবে বলুন এবং জরুরি ডিসপ্যাচারদের নির্দেশাবলী অনুসরণ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[360px] animate-pulse rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0]/50 shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-[24px] border-[3px] border-[#0c2218] bg-red-100 p-6 text-center text-red-900 shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
            <ShieldAlert size={36} className="mx-auto text-red-600" />
            <h3 className="mt-3 text-lg font-black">
              জরুরি যোগাযোগগুলি উপলব্ধ নেই
            </h3>
            <p className="mt-2 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && contacts.length === 0 && (
          <div className="mt-8 rounded-[24px] border-[3px] border-dashed border-[#0c2218]/40 bg-[#f7f0d0] p-10 text-center text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.3)]">
            <Sparkles size={36} className="mx-auto text-[#b07820]" />
            <h3 className="mt-3 text-lg font-black">
              কোনো জরুরি যোগাযোগ উপলব্ধ নেই
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-medium text-[#42604e]">
              স্থানীয় প্রশাসন এখনও কোনো জরুরি যোগাযোগ প্রকাশ করেনি।
            </p>
          </div>
        )}

        {/* Contact cards */}
        {!loading && !error && contacts.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <EmergencyCard
                key={contact.id}
                contact={contact}
              />
            ))}
          </div>
        )}

        {/* Bottom information */}
        <div className="mt-12 border-t-2 border-[#f7f0d0]/15 pt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-[#f7f0d0]">
                <HeartPulse size={16} className="text-red-500" />
                পালিতপুরকানেক্ট জরুরি ডিরেক্টরি এবং সেফটি হাব
              </p>

              <p className="mt-1 text-xs font-semibold text-[#dfe8c4]">
                জরুরি নম্বরগুলি স্থানীয় গ্রাম পঞ্চায়েত প্রশাসন দ্বারা রক্ষণাবেক্ষণ করা হয়।
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("grievance")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-5 py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:bg-[#e6ad45]"
            >
              একটি অ-জরুরি সমস্যা রিপোর্ট করুন 📝
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}