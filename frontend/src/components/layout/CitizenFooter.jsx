import { Link } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  Building2,
  ShieldAlert,
  FileText,
  ArrowUpRight,
} from "lucide-react";

export default function CitizenFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-emerald-900/40 bg-gradient-to-b from-slate-950 via-teal-950 to-slate-950 text-slate-300">
      {/* Ambient Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-16 sm:px-12 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 text-slate-950 shadow-lg shadow-amber-500/20">
                <Sparkles size={20} className="text-slate-950 animate-pulse" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">
                  Palitpur<span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Connect</span>
                </p>
                <p className="text-xs font-semibold text-amber-300/80">
                 Village Digital Portal
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering residents of Palitpur with transparent local governance, instant announcements, emergency support, and seamless grievance tracking under community prosperity.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Village Verified Portal
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li>
                <Link to="/dashboard/announcements" className="transition hover:text-amber-400 flex items-center gap-1.5">
                  <Megaphone size={14} className="text-emerald-400" /> Announcements
                </Link>
              </li>
              <li>
                <Link to="/dashboard/directory" className="transition hover:text-amber-400 flex items-center gap-1.5">
                  <Building2 size={14} className="text-emerald-400" /> Directory
                </Link>
              </li>
              <li>
                <Link to="/dashboard/emergency" className="transition hover:text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-rose-400" /> Emergency
                </Link>
              </li>
              <li>
                <Link to="/dashboard/grievances" className="transition hover:text-amber-400 flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-400" /> Grievances
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Emergency Hotlines
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-xl border border-rose-900/50 bg-rose-950/20 px-3 py-2">
                <span className="font-semibold text-slate-300">Police Control</span>
                <a href="tel:100" className="font-mono font-bold text-rose-400 hover:underline">100</a>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-rose-900/50 bg-rose-950/20 px-3 py-2">
                <span className="font-semibold text-slate-300">Fire & Rescue</span>
                <a href="tel:101" className="font-mono font-bold text-rose-400 hover:underline">101</a>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-rose-900/50 bg-rose-950/20 px-3 py-2">
                <span className="font-semibold text-slate-300">Ambulance</span>
                <a href="tel:108" className="font-mono font-bold text-rose-400 hover:underline">108</a>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Village Office
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-1 shrink-0 text-amber-400" />
                <span>Palitpur Village Office, Post & Block: Palitpur, Birbhum, West Bengal - 731201</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-amber-400" />
                <a href="tel:+917810828802" className="hover:text-white transition">+91 7810828802</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-amber-400" />
                <a href="mailto:dipnarayanghosh6@gmail.com" className="hover:text-white transition break-all">dipnarayanghosh6@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-emerald-900/60 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {currentYear} PalitpurConnect. All rights reserved. Maintained by Palitpur Village Administration.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              Made with <Heart size={13} className="text-rose-500 fill-rose-500" /> for Palitpur Residents
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 rounded-xl border border-emerald-800/80 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Top <ArrowUpRight size={13} className="text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}