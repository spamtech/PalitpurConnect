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
    return "Emergency Service";
  }

  return service;
}

/* =========================================================
   NORMALIZE API DATA
========================================================= */

function normalizeContact(contact) {
  return {
    id: contact.id,
    name: contact.name || "Emergency Service",
    service: contact.service || "Emergency Service",
    number: contact.phone || "",
    alternateNumber: contact.alternate_phone || "",
    description:
      contact.description ||
      "Contact this service for immediate emergency assistance.",
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
      className="group relative overflow-hidden border-rose-200/80 bg-white/90 p-0 shadow-lg shadow-rose-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-400 hover:shadow-2xl"
    >
      {/* Top glowing crimson safety strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse" />

      {/* Decorative background hazard glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-rose-500/10 blur-3xl transition duration-500 group-hover:bg-rose-500/20"
      />

      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md shadow-rose-600/30 transition duration-300 group-hover:scale-110">
            <Icon size={26} />

            <span className="absolute -bottom-1 -right-1 rounded-full border border-rose-200 bg-white px-1 text-sm shadow">
              {contact.emoji}
            </span>
          </div>

          <Badge
            variant="red"
            className="border border-red-200 bg-red-50 font-bold uppercase tracking-wider text-red-700 shadow-xs"
          >
            Critical 🚨
          </Badge>
        </div>

        {/* Name */}
        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-red-700">
          {contact.name}
        </h3>

        {/* Service */}
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-600">
          {contact.label}
        </p>

        {/* Description */}
        <p className="mt-3 flex-1 text-sm font-normal leading-6 text-slate-600">
          {contact.description}
        </p>

        {/* Phone number */}
        <div className="mt-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-amber-50/30 p-4 shadow-inner">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-700">
            <Phone size={12} className="text-red-600" />
            Direct Emergency Hotline
          </p>

          <p className="mt-1 font-mono text-2xl font-black tracking-tight text-slate-900 drop-shadow-xs">
            {contact.number || "Not available"}
          </p>

          {contact.alternateNumber && (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Alternate:{" "}
              <span className="font-mono text-slate-700 font-bold">
                {contact.alternateNumber}
              </span>
            </p>
          )}
        </div>

        {/* Call button */}
        {phoneNumber ? (
          <a
            href={`tel:${phoneNumber}`}
            className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-rose-600/30 transition-all duration-300 hover:scale-[1.02] hover:from-red-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            <Phone size={18} className="animate-bounce" />
            Call Now 📞
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3.5 text-center text-sm font-bold text-slate-400">
            Phone number unavailable
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
            "Invalid emergency contacts response from server."
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
          "Failed to load emergency contacts:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load emergency contacts."
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
      className="relative w-full overflow-hidden border-y border-amber-200/60 bg-gradient-to-b from-slate-50 via-white to-rose-50/30 px-6 py-20 text-slate-900 sm:px-12 sm:py-24 lg:px-16"
    >
      {/* Background ambient hazard glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] animate-pulse rounded-full bg-red-200/40 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-amber-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        {/* Section heading */}
        <div className="max-w-3xl">
          <Badge
            variant="red"
            className="border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-1.5 text-red-700 shadow-sm"
          >
            <ShieldAlert
              size={14}
              className="mr-1.5 text-red-600"
            />

            <span className="font-bold">
              Palitpur Emergency Response 🚨
            </span>
          </Badge>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Help when you
            <span className="mt-1 block bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              need it most 🛡️.
            </span>
          </h2>

          <p className="mt-5 text-base font-normal leading-7 text-slate-600 sm:text-lg">
            Keep these important emergency numbers instantly
            accessible. For life-threatening situations or
            crises, contact the appropriate emergency service
            right away.
          </p>
        </div>

        {/* Warning banner */}
        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-rose-200 bg-gradient-to-r from-red-50/80 via-white to-amber-50/80 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 ring-1 ring-red-200 shadow-inner">
              <Siren size={24} className="animate-pulse" />
            </div>

            <div>
              <p className="flex items-center gap-2 text-base font-black text-slate-900">
                Emergency Situation Protocol ⚠️
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                Stay calm, clearly state your exact location in
                Palitpur, and follow instructions given by
                emergency dispatchers.
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
                className="h-[360px] animate-pulse rounded-3xl border border-rose-200 bg-white/70 shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <ShieldAlert
              size={36}
              className="mx-auto text-red-600"
            />

            <h3 className="mt-3 text-lg font-black text-slate-900">
              Emergency contacts unavailable
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && contacts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-amber-300 bg-white/90 p-10 text-center shadow-sm">
            <Sparkles
              size={36}
              className="mx-auto text-amber-500"
            />

            <h3 className="mt-3 text-lg font-black text-slate-900">
              No emergency contacts available
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              The local administration has not published any
              emergency contacts yet.
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
        <div className="mt-12 border-t border-amber-200/60 pt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HeartPulse
                  size={16}
                  className="text-red-600"
                />

                PalitpurConnect Emergency Directory & Safety Hub
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Emergency numbers are maintained by the local
                Gram Panchayat administration.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document
                  .getElementById("grievance")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="border-amber-300 font-bold text-slate-700 bg-white hover:bg-amber-50 hover:text-slate-900"
            >
              Report a non-emergency issue 📝

              <ArrowUpRight
                size={16}
                className="ml-1"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}