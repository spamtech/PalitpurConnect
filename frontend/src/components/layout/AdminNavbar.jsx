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
  Sparkles,
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
    label: "Users",
    to: "/admin/users",
    icon: Users,
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

export default function AdminSidebar() {
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

  const displayRole = roleLabel[user?.role] || "Administrator";

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b-[3px] border-[#221208] bg-[#361a0d] px-6 text-[#faebd7] shadow-[0_4px_0_rgba(34,18,8,0.2)] lg:hidden">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208]">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-[#faebd7]">Palitpur <span className="text-[#e68a45]">Admin</span></p>
            <p className="text-[9px] font-bold text-[#d4a373] uppercase tracking-wider">Control Panel</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#4a2512] text-[#faebd7] shadow-[3px_3px_0_#221208]"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} className="text-[#e68a45]" /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r-[3px] border-[#221208] bg-[#361a0d] p-6 text-[#faebd7] shadow-[8px_0_0_rgba(34,18,8,0.25)] transition-transform duration-300 overflow-y-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Brand & Navigation */}
        <div>
          {/* Brand Logo */}
          <Link
            to="/admin"
            onClick={closeMobile}
            className="group flex items-center gap-3.5 rounded-2xl border-2 border-[#221208] bg-[#4a2512] p-3.5 shadow-[4px_4px_0_#221208] transition-all hover:bg-[#361a0d]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208] transition-transform group-hover:scale-105">
              <Sparkles size={22} strokeWidth={2.5} className="animate-pulse" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-black tracking-tight text-[#faebd7] truncate">
                Palitpur <span className="text-[#e68a45]">Admin</span> 🛡️
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a373]">
                ✦ Control Panel ✦
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-2.5">
            <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a373]">
              Main Menu
            </p>
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
                      "flex items-center gap-3 rounded-2xl border-[2px] border-[#221208] px-4 py-3 text-xs font-black transition-all duration-200",
                      isActive
                        ? "bg-[#e68a45] text-[#221208] shadow-[4px_4px_0_#221208] -translate-y-0.5"
                        : "bg-[#4a2512] text-[#eddcd2] shadow-[3px_3px_0_#221208] hover:-translate-y-0.5 hover:bg-[#592c15] hover:text-[#e68a45]",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="space-y-4 border-t-2 border-[#221208]/50 pt-5 mt-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-2xl border-[2px] border-[#221208] bg-[#4a2512] p-3 text-left text-[#faebd7] shadow-[4px_4px_0_#221208] transition hover:bg-[#592c15]"
              aria-expanded={profileOpen}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#221208] bg-[#e68a45] text-xs font-black text-[#221208]">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-[#faebd7]">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="truncate text-[10px] font-bold text-[#e68a45]">
                    {displayRole}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#e6ad45]" />
            </button>

            {profileOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-2xl border-[3px] border-[#221208] bg-[#361a0d] p-2 shadow-[8px_8px_0_rgba(34,18,8,0.4)] animate-in fade-in zoom-in-95 duration-150">
                <div className="rounded-xl border border-[#faebd7]/10 bg-[#4a2512] px-3 py-2 text-[#faebd7]">
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#e68a45]">Online As</p>
                  <p className="truncate text-xs font-black">{user?.name || "Administrator"}</p>
                </div>
                <div className="my-1.5 border-t-2 border-[#221208]/30" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout Session
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#221208] bg-[#221208]/40 px-3 py-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#d4a373]">
              <span className="h-2 w-2 rounded-full bg-[#e68a45] animate-pulse" /> System Online
            </span>
            <span className="font-mono text-[10px] font-bold text-[#faebd7]">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}