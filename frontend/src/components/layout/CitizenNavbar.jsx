import { useEffect, useState } from "react";
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
    label: "ড্যাশবোর্ড",
    to: "/dashboard",
  },
  {
    label: "ঘোষণা",
    to: "/dashboard/announcements",
  },
  {
    label: "ডিরেক্টরি",
    to: "/dashboard/directory",
  },
  {
    label: "জরুরি সেবা",
    to: "/dashboard/emergency",
  },
  {
    label: "অভিযোগ",
    to: "/dashboard/grievances",
  },
];

export default function CitizenNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Scroll listener to hide navbar on scroll down and show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        setShowNavbar(false);
        setProfileOpen(false); // Close dropdown on scroll
      } else {
        // Scrolling up -> show navbar
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b-[3px] border-[#0c2218] bg-[#173528]/95 py-3 shadow-[0_8px_0_rgba(12,34,24,0.18)] backdrop-blur-xl",
        "transition-transform duration-300 ease-in-out",
        showNavbar ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="w-full px-6 sm:px-12 lg:px-16">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6">

          {/* Brand */}
          <Link
            to="/dashboard"
            className="group flex shrink-0 items-center gap-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d85a]"
            onClick={closeMobile}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#173528] transition-transform duration-300 group-hover:-translate-y-1">
              <Sparkles size={22} strokeWidth={2.5} />
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-black tracking-tight text-[#f7f0d0]">
                পালিতপুর <span className="text-[#b8d85a]">কানেক্ট</span> 🌾
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b07820]">
                ✦ নাগরিক পোর্টাল ✦
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 rounded-2xl border-[3px] border-[#0c2218] bg-[#2d684d] p-1.5 shadow-[4px_4px_0_rgba(12,34,24,0.22)] lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "rounded-xl border border-[#f7f0d0]/10 px-4 py-2 text-xs font-bold transition-all duration-300",
                    isActive
                      ? "bg-[#b8d85a] text-[#173528] border-2 border-[#0c2218] font-black shadow-[3px_3px_0_#0c2218] -translate-y-0.5"
                      : "text-[#dfe8c4] hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#173528]/35 hover:text-[#b8d85a]",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              type="button"
              className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] transition hover:bg-[#173528] sm:flex"
              aria-label="বিজ্ঞপ্তি"
            >
              <Bell className="h-4 w-4 text-[#e6ad45]" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#b8d85a] ring-2 ring-[#0c2218] animate-pulse" />
            </button>

            {/* Profile */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2.5 rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] px-3.5 py-2 text-[#f7f0d0] shadow-[4px_4px_0_#0c2218] transition hover:bg-[#173528]"
                aria-expanded={profileOpen}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-xs font-black text-[#173528]">
                  {user?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-xs font-black text-[#f7f0d0]">
                    {user?.name || "নাগরিক"}
                  </p>
                  <p className="text-[10px] font-bold text-[#e6ad45]">
                    বাসিন্দা
                  </p>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-[#e6ad45]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border-[3px] border-[#0c2218] bg-[#173528] p-2 shadow-[8px_8px_0_rgba(12,34,24,0.4)] animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#f7f0d0] hover:bg-[#2d684d] hover:text-[#b8d85a] transition-colors"
                  >
                    <User className="h-4 w-4 text-[#e6ad45]" />
                    আমার প্রোফাইল
                  </Link>

                  <div className="my-1 border-t-2 border-[#0c2218]/30" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] transition hover:bg-[#173528] lg:hidden"
              aria-label={
                mobileOpen
                  ? "নেভিগেশন বন্ধ করুন"
                  : "নেভিগেশন খুলুন"
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-[#e6ad45]" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="absolute inset-x-0 top-full border-b-[3px] border-[#0c2218] bg-[#173528] px-6 py-6 shadow-[0_15px_30px_rgba(12,34,24,0.5)] backdrop-blur-xl lg:hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    [
                      "block rounded-2xl border-[2px] border-[#0c2218] px-4 py-3 text-sm font-bold transition-all shadow-[4px_4px_0_#0c2218]",
                      isActive
                        ? "bg-[#b8d85a] text-[#173528] font-black"
                        : "bg-[#2d684d] text-[#f7f0d0] hover:bg-[#173528]",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-5 border-t-[3px] border-[#0c2218] pt-5 space-y-3">
              <Link
                to="/dashboard/profile"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] px-4 py-3 text-sm font-black text-[#f7f0d0] shadow-[4px_4px_0_#0c2218]"
              >
                <User className="h-4 w-4 text-[#e6ad45]" />
                আমার প্রোফাইল
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-red-600 px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0_#0c2218]"
              >
                <LogOut className="h-4 w-4" /> অ্যাকাউন্ট লগআউট করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}