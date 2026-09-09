import {
  AlertTriangle,
  ArrowRight,
  Bell,
  ClipboardList,
  Loader2,
  Users,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { api } from "../../services/api";

const managementLinks = [
  {
    title: "Manage Announcements",
    description: "Create, edit and publish village notices.",
    href: "/admin/announcements",
  },
  {
    title: "Manage Directory",
    description: "Maintain local services and contact information.",
    href: "/admin/directory",
  },
  {
    title: "Emergency Contacts",
    description: "Update important emergency numbers.",
    href: "/admin/emergency",
  },
  {
    title: "Grievances",
    description: "Review, assign and update citizen complaints.",
    href: "/admin/grievances",
  },
];

const defaultStats = [
  {
    key: "announcements",
    label: "Announcements",
    value: 0,
    icon: Bell,
  },
  {
    key: "directory",
    label: "Directory Entries",
    value: 0,
    icon: Users,
  },
  {
    key: "openGrievances",
    label: "Open Grievances",
    value: 0,
    icon: ClipboardList,
  },
  {
    key: "emergencyContacts",
    label: "Emergency Contacts",
    value: 0,
    icon: AlertTriangle,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getAdminDashboardStats();
        const dashboardStats = response.data.stats;

        setStats([
          {
            key: "announcements",
            label: "Announcements",
            value: Number(dashboardStats.announcements),
            icon: Bell,
          },
          {
            key: "directory",
            label: "Directory Entries",
            value: Number(dashboardStats.directory),
            icon: Users,
          },
          {
            key: "openGrievances",
            label: "Open Grievances",
            value: Number(dashboardStats.openGrievances),
            icon: ClipboardList,
          },
          {
            key: "emergencyContacts",
            label: "Emergency Contacts",
            value: Number(dashboardStats.emergencyContacts),
            icon: AlertTriangle,
          },
        ]);
      } catch (err) {
        console.error("Failed to load admin dashboard statistics:", err);
        setError(err.message || "Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-10 rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[10px_10px_0_rgba(34,18,8,0.3)]">
          <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-[#e68a45]" />
            <span>Administration Portal 🛡️</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#faebd7] sm:text-5xl">
            Panchayat Dashboard
          </h1>

          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-[#eddcd2]">
            Monitor and manage Palitpur civic services, announcements, directory records, and public grievances in real-time.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-[24px] border-[3px] border-[#221208] bg-red-100 p-6 text-red-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black text-base">Unable to load dashboard statistics</p>
            <p className="mt-1 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.key}
                className="group relative overflow-hidden rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff5eb]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>

                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-[#4a2512]" />
                  ) : (
                    <span className="text-3xl font-black text-[#221208]">
                      {stat.value}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-xs sm:text-sm font-black tracking-wider uppercase text-[#5a321a]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Management Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-black tracking-tight text-[#faebd7] mb-6">
            Management Controls ⚡
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {managementLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col justify-between rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff5eb]"
              >
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#221208] group-hover:text-[#4a2512] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-[#5a321a]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t-2 border-[#221208]/15 pt-4">
                  <span className="text-xs font-black text-[#4a2512] group-hover:text-[#e68a45] transition-colors">
                    Open Control Panel
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208] transition-transform group-hover:translate-x-1">
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}