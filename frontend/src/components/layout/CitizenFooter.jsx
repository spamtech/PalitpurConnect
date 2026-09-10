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
    <footer className="relative overflow-hidden border-t-[3px] border-[#0c2218] bg-[#173528] text-[#f7f0d0] shadow-[0_-8px_0_rgba(12,34,24,0.18)]">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-16 sm:px-12 lg:px-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 items-stretch">
          
          {/* Brand Info */}
          <div className="lg:col-span-3 rounded-[18px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-5 text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.28)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218]">
                  <Sparkles size={20} strokeWidth={2.5} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-base font-black tracking-tight text-[#173528] whitespace-nowrap">
                    পালিতপুর <span className="text-[#2d684d]">কানেক্ট</span> 🌾
                  </p>
                  <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#b07820]">
                    ✦ ডিজিটাল পোর্টাল ✦
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium leading-relaxed text-[#42604e]">
                স্বচ্ছ স্থানীয় শাসন, তাত্ক্ষণিক ঘোষণা এবং জরুরি সহায়তার মাধ্যমে পালিতপুরের বাসিন্দাদের ক্ষমতায়ন করা।
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#173528] bg-[#2d684d] px-3 py-1 text-[11px] font-black text-[#f7f0d0] shadow-[2px_2px_0_#0c2218]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8d85a] animate-pulse shrink-0" />
                গ্রাম যাচাইকৃত পোর্টাল
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-[18px] border-[3px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.28)] lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#e6ad45]">
                দ্রুত লিঙ্ক
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link to="/dashboard/announcements" className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#173528]/35 hover:text-[#b8d85a]">
                    <Megaphone size={14} className="text-[#b8d85a] shrink-0" /> <span className="truncate">ঘোষণা</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/directory" className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#173528]/35 hover:text-[#b8d85a]">
                    <Building2 size={14} className="text-[#b8d85a] shrink-0" /> <span className="truncate">ডিরেক্টরি</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/emergency" className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-[#173528]/35 hover:text-red-400">
                    <ShieldAlert size={14} className="text-red-400 shrink-0" /> <span className="truncate">জরুরি সেবা</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/grievances" className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#e6ad45]/50 hover:bg-[#173528]/35 hover:text-[#e6ad45]">
                    <FileText size={14} className="text-[#e6ad45] shrink-0" /> <span className="truncate">অভিযোগ</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="rounded-[18px] border-[3px] border-[#0c2218] bg-[#10281e] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.28)] lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#e6ad45]">
                জরুরি হটলাইন
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center justify-between rounded-xl border-2 border-[#0c2218] bg-[#173528] px-3.5 py-2.5 shadow-[3px_3px_0_#0c2218]">
                  <span className="font-bold text-[#f7f0d0] truncate mr-2">পুলিশ কন্ট্রোল</span>
                  <a href="tel:100" className="font-mono font-black text-red-400 hover:text-white shrink-0">১০০</a>
                </li>
                <li className="flex items-center justify-between rounded-xl border-2 border-[#0c2218] bg-[#173528] px-3.5 py-2.5 shadow-[3px_3px_0_#0c2218]">
                  <span className="font-bold text-[#f7f0d0] truncate mr-2">দমকল ও উদ্ধার</span>
                  <a href="tel:101" className="font-mono font-black text-red-400 hover:text-white shrink-0">১০১</a>
                </li>
                <li className="flex items-center justify-between rounded-xl border-2 border-[#0c2218] bg-[#173528] px-3.5 py-2.5 shadow-[3px_3px_0_#0c2218]">
                  <span className="font-bold text-[#f7f0d0] truncate mr-2">অ্যাম্বুলেন্স</span>
                  <a href="tel:108" className="font-mono font-black text-red-400 hover:text-white shrink-0">১০৮</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="rounded-[18px] border-[3px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.28)] lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#e6ad45]">
                গ্রামের কার্যালয়
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm font-bold text-[#dfe8c4]">
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#f7f0d0]/20 bg-[#173528]/50 text-[#b8d85a]"><MapPin size={16} /></div>
                  <span className="leading-snug text-xs">পালিতপুর গ্রাম, পোস্ট: নুতনহাট ও ব্লক: নানুর  , বীরভূম, পশ্চিমবঙ্গ - ৭১৩১৪৭</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#f7f0d0]/20 bg-[#173528]/50 text-[#b8d85a]"><Phone size={16} /></div>
                  <a href="tel:+917810828802" className="font-mono transition hover:text-[#b07820] truncate text-xs">+৯১ ৭৮১০৮২৮৮০২</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#f7f0d0]/20 bg-[#173528]/50 text-[#b8d85a]"><Mail size={16} /></div>
                  <a href="mailto:dipnarayanghosh6@gmail.com" className="transition hover:text-[#b07820] break-all text-xs">dipnarayanghosh6@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-6 border-t-2 border-[#b8d85a]/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#dfe8c4]">
              © {currentYear} পালিতপুর কানেক্ট। <span>তৈরি করা হয়েছে</span>
              <Heart size={13} className="animate-pulse fill-[#e6ad45] text-[#e6ad45]" /> <span>পালিতপুরবাসীদের জন্য।</span>
            </p>
            <p className="mt-1 text-xs font-medium text-[#a7b89a]">পালিতপুর গ্রাম প্রশাসন কর্তৃক পরিচালিত।</p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex w-fit items-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
          >
            <span>উপরে যান</span><ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}