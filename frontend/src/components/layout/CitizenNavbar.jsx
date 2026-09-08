import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  User,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    label: "Announcements",
    to: "/dashboard/announcements",
  },
  {
    label: "Directory",
    to: "/dashboard/directory",
  },
  {
    label: "Emergency",
    to: "/dashboard/emergency",
  },
  {
    label: "Grievances",
    to: "/dashboard/grievances",
  },
];

export default function CitizenNavbar() {
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-900/40 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 backdrop-blur-xl shadow-xl">
      <div className="w-full px-6 sm:px-12 lg:px-16">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Brand */}
          <Link
            to="/dashboard"
            className="group flex shrink-0 items-center gap-3"
            onClick={closeMobile}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 text-slate-950 shadow-md shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
              <Sparkles size={18} className="text-slate-950 animate-pulse" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black tracking-tight text-white">
                Palitpur<span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Connect</span>
              </p>
              <p className="text-[11px] font-semibold text-amber-300/80">
                Citizen Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 rounded-full border border-emerald-800/60 bg-white/10 p-1.5 shadow-inner backdrop-blur-md lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "rounded-full px-4 py-2 text-xs font-bold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                      : "text-slate-200 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">

            {/* Notifications */}
            <button
              type="button"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-emerald-800/60 bg-white/10 text-slate-200 transition hover:bg-white/20 sm:flex shadow-xs backdrop-blur-sm"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-amber-300" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-emerald-950 animate-pulse" />
            </button>

            {/* Profile */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-800/60 bg-white/10 px-3 py-1.5 transition hover:bg-white/20 shadow-xs backdrop-blur-sm"
                aria-expanded={profileOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-emerald-500 text-xs font-black text-slate-950 shadow-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-xs font-bold text-white">
                    {user?.name || "Citizen"}
                  </p>
                  <p className="text-[10px] font-semibold text-amber-300/80">
                    Resident
                  </p>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-emerald-900 bg-slate-900 p-2 shadow-2xl shadow-slate-950/50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-emerald-900/50 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-amber-400" />
                    My Profile
                  </Link>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 bg-white/10 text-slate-200 transition hover:bg-white/20 lg:hidden shadow-xs backdrop-blur-sm"
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
          <div className="absolute inset-x-0 top-full border-b border-emerald-900 bg-slate-950/95 px-6 py-6 shadow-2xl backdrop-blur-xl lg:hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    [
                      "block rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                      isActive
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                        : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-5 border-t border-slate-800 pt-5">
              <Link
                to="/dashboard/profile"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-2xl border border-emerald-800/80 bg-emerald-950/50 px-4 py-3 text-sm font-bold text-amber-300 mb-2"
              >
                <User className="h-4 w-4 text-amber-400" />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm font-bold text-red-300 shadow-xs"
              >
                <LogOut className="h-4 w-4" /> Logout Account
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}