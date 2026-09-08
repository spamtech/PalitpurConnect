import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Landing Page",
    to: "/admin/landing",
    icon: Globe,
  },
  {
    label: "History",
    to: "/admin/landing/history",
    icon: History,
  },
  {
    label: "Announcements",
    to: "/admin/announcements",
    icon: Bell,
  },
  {
    label: "Directory",
    to: "/admin/directory",
    icon: Users,
  },
  {
    label: "Emergency",
    to: "/admin/emergency",
    icon: ShieldCheck,
  },
  {
    label: "Grievances",
    to: "/admin/grievances",
    icon: Settings,
  },
];

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const roleLabel = {
    PANCHAYAT_STAFF: "Panchayat Staff",
    PANCHAYAT_ADMIN: "Panchayat Admin",
    SUPER_ADMIN: "Super Admin",
  };

  const displayRole =
    roleLabel[user?.role] || "Administrator";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="w-full px-6 sm:px-12 lg:px-16">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Brand */}
          <Link
            to="/admin"
            onClick={closeMobile}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
              PC
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-slate-900">
                PalitpurConnect
              </p>

              <p className="text-[11px] text-slate-500">
                Administration
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Admin Status */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 xl:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">
                System Online
              </span>
            </div>

            {/* Profile */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
                aria-expanded={profileOpen}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-slate-900">
                    {user?.name || "Administrator"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {displayRole}
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">

                  <div className="rounded-xl bg-slate-50 px-3 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Signed in as
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                      {user?.name || "Administrator"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {displayRole}
                    </p>
                  </div>

                  <div className="my-2 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Administrator"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {displayRole}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}