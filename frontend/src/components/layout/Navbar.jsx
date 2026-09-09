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

const navItems = [
  { label: "হোম", href: "/" },
  { label: "পাড়াসমূহ", href: "#villages" },
  { label: "সংস্কৃতি ও ঐতিহ্য", href: "#culture" },
  { label: "পালিতপুর মানচিত্র", href: "#map" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
      } else {
        // Scrolling up -> show navbar
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================
          DESKTOP / MAIN NAVBAR
      ========================= */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 w-full border-b-[3px] border-[#0c2218] bg-[#173528]/95 py-3 shadow-[0_8px_0_rgba(12,34,24,0.18)] backdrop-blur-xl",
          "transition-transform duration-300 ease-in-out",
          showNavbar ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
      >
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between">

            {/* Brand */}
            <a
              href="/"
              onClick={closeMobileMenu}
              className="group flex items-center gap-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d85a]"
              aria-label="পালিতপুর কানেক্ট হোম"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#173528] transition-transform duration-300 group-hover:-translate-y-1">
                <Sprout size={24} strokeWidth={2.5} />
              </div>

              <div>
                <div className="text-lg font-black tracking-tight text-[#f7f0d0]">
                  পালিতপুর <span className="text-[#b8d85a]">কানেক্ট</span> 🌾
                </div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b07820]">
                  ✦ ডিজিটাল গ্রাম পোর্টাল ✦
                </div>
              </div>
            </a>

            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-1.5 rounded-2xl border-[3px] border-[#0c2218] bg-[#2d684d] p-1.5 shadow-[4px_4px_0_rgba(12,34,24,0.22)] lg:flex"
              aria-label="প্রাথমিক নেভিগেশন"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-[#f7f0d0]/10 px-4 py-2 text-xs font-bold text-[#dfe8c4] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#173528]/35 hover:text-[#b8d85a]"
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
                className="group inline-flex items-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-2 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#b8d85a] hover:shadow-[5px_5px_0_#0c2218] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d85a]"
              >
                <LogIn size={15} />
                নাগরিক লগইন
              </a>

              {/* Register */}
              <a
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d85a]"
              >
                <UserPlus size={15} />
                নিবন্ধন
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              className="rounded-xl border-[2px] border-[#0c2218] bg-[#2d684d] p-2.5 text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] transition hover:bg-[#173528] lg:hidden"
            >
              {mobileOpen ? (
                <X size={22} className="text-[#e6ad45]" />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          MOBILE NAVIGATION
      ========================= */}
      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "transition-all duration-300 ease-in-out",
          mobileOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        ].join(" ")}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="নেভিগেশন মেনু বন্ধ করুন"
          onClick={closeMobileMenu}
          className={[
            "absolute inset-0 w-full bg-[#0c2218]/80 backdrop-blur-md",
            "transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Drawer */}
        <aside
          className={[
            "absolute right-0 top-0 h-full w-[min(92vw,400px)]",
            "border-l-[3px] border-[#0c2218] bg-[#173528] text-[#f7f0d0] shadow-[-18px_0_50px_rgba(12,34,24,0.45)]",
            "transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          aria-label="মোবাইল নেভিগেশন"
        >
          {/* Retro ambient background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
            <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#e6ad45]/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
          </div>

          <div className="relative flex h-full flex-col overflow-hidden">
            {/* Drawer header */}
            <div className="relative flex h-24 items-center justify-between border-b-[3px] border-[#0c2218] bg-[#f7f0d0] px-6 text-[#173528] shadow-[0_5px_0_rgba(12,34,24,0.18)]">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b07820]">✦ ডিজিটাল গ্রাম পোর্টাল ✦</div>
                <div className="text-lg font-black tracking-tight">
                  পালিতপুর <span className="text-[#2d684d]">কানেক্ট</span> 🌾
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="মেনু বন্ধ করুন"
                className="rounded-xl border-2 border-[#173528] bg-[#b8d85a] p-2 text-[#173528] shadow-[3px_3px_0_#173528] transition hover:bg-[#e6ad45]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="relative flex-1 overflow-y-auto px-6 py-6"
              aria-label="মোবাইল নেভিগেশন"
            >
              <div className="space-y-3">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#e6ad45] flex items-center gap-2">
                  <Sparkles size={14} /> পালিতপুর ঘুরে দেখুন
                </p>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl border-[2px] border-[#0c2218] bg-[#2d684d] px-4 py-3 text-sm font-bold text-[#f7f0d0] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#173528]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#b8d85a] transition-transform group-hover:scale-125" />
                      {item.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-[#e6ad45] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                ))}
              </div>

              {/* Portal status */}
              <div className="mt-8 rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] p-4 text-[#173528] shadow-[4px_4px_0_#0c2218]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8d85a] text-[#173528]">
                    <Sparkles size={16} className="animate-pulse" />
                  </span>
                  <div>
                    <p className="text-xs font-black">পোর্টাল অনলাইন</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#58705e]">২৪/৭ ডিজিটাল পরিষেবা উপলব্ধ</p>
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile actions */}
            <div className="relative space-y-3 border-t-[3px] border-[#0c2218] bg-[#10281e] p-6 shadow-[0_-6px_0_rgba(12,34,24,0.12)]">
              {/* Login */}
              <a
                href="/login"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition hover:bg-[#b8d85a]"
              >
                <LogIn size={16} />
                নাগরিক লগইন
              </a>

              {/* Register */}
              <a
                href="/register"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition hover:bg-[#e6ad45]"
              >
                <UserPlus size={16} />
                নিবন্ধন
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}