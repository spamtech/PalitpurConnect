import {
  AlertTriangle,
  ArrowRight,
  Bell,
  ClipboardList,
  Loader2,
  Users,
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

        // Expected API response:
        //
        // {
        //   success: true,
        //   message: "Dashboard statistics fetched successfully",
        //   data: {
        //     stats: {
        //       announcements: 24,
        //       directory: 48,
        //       openGrievances: 12,
        //       emergencyContacts: 8
        //     }
        //   }
        // }

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
            value: Number(
              dashboardStats.emergencyContacts
            ),
            icon: AlertTriangle,
          },
        ]);
      } catch (err) {
        console.error(
          "Failed to load admin dashboard statistics:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="page-x">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-600">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Panchayat Dashboard
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Monitor and manage Palitpur civic services.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.key}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Management */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Management
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {managementLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <h3 className="font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  Manage
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}