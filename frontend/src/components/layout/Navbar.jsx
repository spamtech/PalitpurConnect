
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Menu,
  Sprout,
  X,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";

import Button from "../ui/Button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Villages", href: "#villages" },
  { label: "Culture", href: "#culture" },
  { label: "Map", href: "#map" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================
          DESKTOP / MAIN NAVBAR
      ========================== */}
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#b8d85a]/20 bg-[#173528]/95 py-3 shadow-[0_10px_0_rgba(12,34,24,0.25)] backdrop-blur-xl">
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between">

            {/* Brand */}
            <a
              href="#home"
              onClick={closeMobileMenu}
              className="group flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="PalitpurConnect home"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-[#f7f0d0] shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-500/30 transition-transform duration-300 group-hover:scale-105">
                <Sprout
                  size={24}
                  strokeWidth={2}
                  className="text-[#d6ee87] transition-transform duration-300 group-hover:-rotate-6"
                />

                {/* Live status */}
                <span
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#173528] bg-[#b8d85a]"
                  aria-label="Portal online"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                </span>
              </div>

              <div>
                <div className="text-base font-black tracking-tight text-[#f7f0d0]">
                  Palitpur
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Connect
                  </span>{" "}
                  🌾
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e6ad45]/90">
                  ✦ Digital Village Portal ✦
                </div>
              </div>
            </a>

            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-1 rounded-xl border-2 border-[#b8d85a]/20 bg-[#10281e] p-1.5 shadow-inner lg:flex"
              aria-label="Primary navigation"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-[#e9e2c5] transition-all duration-300 hover:bg-[#b8d85a]/15 hover:text-[#c8e76a] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 lg:flex">

              {/* Citizen Login */}
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#b8d85a]/25 bg-[#214636] px-4 py-2.5 text-xs font-bold text-[#f4efda] transition-all duration-300 hover:border-[#b8d85a]/60 hover:bg-[#b8d85a]/10 hover:text-[#d1ef72] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <LogIn size={16} />
                Citizen Login
              </a>

              {/* Register */}
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#e6ad45] via-[#c98d35] to-[#8f6528] px-4 py-2.5 text-xs font-bold text-[#f7f0d0] shadow-lg shadow-[#173528]/40 transition-all duration-300 hover:scale-[1.02] hover:from-[#f0bd5b] hover:to-[#b97825] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <UserPlus size={16} />
                Register
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="rounded-xl border border-[#b8d85a]/25 bg-[#214636]/70 p-2.5 text-[#e9e2c5] transition hover:bg-[#2d684d] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
            >
              {mobileOpen ? (
                <X size={23} className="text-[#e6ad45]" />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "transition-all duration-500 ease-in-out",
          mobileOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        ].join(" ")}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className={[
            "absolute inset-0 w-full bg-[#10281e]/85 backdrop-blur-md",
            "transition-opacity duration-500",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Drawer */}
        <aside
          className={[
            "absolute right-0 top-0 h-full w-[min(92vw,400px)]",
            "border-l-2 border-[#b8d85a]/30 bg-gradient-to-b from-[#173528] via-[#1b3d2c] to-[#10281e] text-[#f7f0d0] shadow-[-18px_0_50px_rgba(10,28,19,0.45)]",
            "transition-transform duration-500 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          aria-label="Mobile navigation"
        >
          <div className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(247,240,208,0.10)_1px,transparent_1.5px)] [background-size:18px_18px]">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#b8d85a]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#e6ad45]/10 blur-3xl" />

            {/* Drawer header */}
            <div className="relative flex h-24 items-center justify-between border-b border-[#b8d85a]/20 bg-[#173528]/95 px-6 shadow-[0_5px_0_rgba(12,34,24,0.22)]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e6ad45]">Digital Village Portal</div>
                <div className="font-black text-lg text-[#f7f0d0]">
                Palitpur
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Connect
                </span>{" "}
                🌾
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="rounded-xl border border-[#b8d85a]/15 p-2 text-[#c8c1a5] hover:bg-[#214636] hover:text-[#fff6d2] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <X size={21} className="text-[#e6ad45]" />
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="relative flex-1 overflow-y-auto px-5 py-7"
              aria-label="Mobile navigation"
            >
              <div className="space-y-3">
                <p className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8c1a5]">Explore Palitpur</p>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-2xl border-2 border-[#b8d85a]/15 bg-[#f7f0d0]/[0.055] px-4 py-4 text-base font-bold text-[#e9e2c5] shadow-[5px_5px_0_rgba(12,34,24,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8d85a]/45 hover:bg-[#2d684d]/90 hover:text-[#f7f0d0] hover:shadow-[6px_6px_0_rgba(12,34,24,0.28)]"
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      size={17}
                      className="text-[#e6ad45] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                ))}
              </div>

              {/* Portal status */}
              <div className="mt-8 rounded-3xl border-2 border-[#b8d85a]/20 bg-gradient-to-br from-[#2d684d] via-[#214636] to-[#173528] p-5 shadow-[7px_7px_0_rgba(12,34,24,0.22)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#b8d85a]/15 text-[#c8e76a] ring-1 ring-[#b8d85a]/35">
                    <Sparkles size={18} className="animate-pulse" />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#f7f0d0]">
                      Portal Online 🌟
                    </p>

                    <p className="text-xs text-[#c8c1a5]">
                      Civic services available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile actions */}
            <div className="relative space-y-3 border-t-2 border-[#b8d85a]/15 bg-[#10281e]/95 p-6 shadow-[0_-6px_0_rgba(12,34,24,0.12)]">

              {/* Login */}
              <a
                href="/login"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#b8d85a]/25 bg-[#214636] py-3 font-bold text-[#f4efda] transition hover:border-[#b8d85a]/60 hover:bg-[#2d684d] hover:text-[#d6ee87]"
              >
                <LogIn size={17} />
                Citizen Login
              </a>

              {/* Register */}
              <a
                href="/register"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e6ad45] via-[#c98d35] to-[#8f6528] py-3 font-bold text-[#f7f0d0] shadow-[6px_6px_0_rgba(12,34,24,0.28)] transition hover:from-[#f0bd5b] hover:to-[#b97825]"
              >
                <UserPlus size={17} />
                Register
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

