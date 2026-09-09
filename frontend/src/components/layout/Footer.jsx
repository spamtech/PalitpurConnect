import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  Sprout,
  Sparkles,
  Heart,
  ShieldCheck,
  LogIn,
} from "lucide-react";

const footerLinks = [
  { label: "হোম", href: "/" },
  { label: "পাড়াসমূহ", href: "#villages" },
  { label: "সংস্কৃতি ও ঐতিহ্য", href: "#culture" },
  { label: "পালিতপুর মানচিত্র", href: "#map" },
];

const serviceLinks = [
  { label: "নাগরিক লগইন", href: "/login" },
  { label: "অভিযোগ জানান", href: "#grievance" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="relative w-full overflow-hidden border-t-[3px] border-[#0c2218] bg-[#173528] text-[#f7f0d0] shadow-[0_-8px_0_rgba(12,34,24,0.18)]">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="relative w-full px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2 rounded-[18px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 text-[#173528] shadow-[8px_8px_0_rgba(12,34,24,0.28)]">
              <div className="group flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#173528] transition-transform duration-300 group-hover:-translate-y-1">
                  <Sprout size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight">
                    পালিতপুর <span className="text-[#2d684d]">কানেক্ট</span> 🌾
                  </div>
                  <div className="mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#b07820]">
                    ✦ ডিজিটাল গ্রাম পোর্টাল ✦
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-[#42604e]">
                পালিতপুরের জনগণকে স্থানীয় তথ্য, কমিউনিটি সম্পদ, নাগরিক পরিষেবা, গুরুত্বপূর্ণ বিজ্ঞপ্তি এবং স্বচ্ছ অভিযোগ সহায়তার সাথে সংযুক্ত করার জন্য একটি আধুনিক ডিজিটাল প্ল্যাটফর্ম।
              </p>

              <div className="mt-6 space-y-3.5 text-sm">
                <div className="flex items-center gap-3 font-bold text-[#315442]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#2d684d]/20 bg-[#2d684d]/10 text-[#2d684d]"><MapPin size={16} /></div>
                  <span>পালিতপুর, বীরভূম, পশ্চিমবঙ্গ</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#315442]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#2d684d]/20 bg-[#2d684d]/10 text-[#2d684d]"><Phone size={16} /></div>
                  <a href="tel:+917810828802" className="font-mono transition hover:text-[#b07820]">গ্রাম হেল্পডেস্ক: +৯১ ৭‌৮‌১০৮‌২৮৮‌০২</a>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#315442]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#2d684d]/20 bg-[#2d684d]/10 text-[#2d684d]"><Mail size={16} /></div>
                  <a href="mailto:dipnarayanghosh6@gmail.com" className="transition hover:text-[#b07820]">dipnarayanghosh6@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Explore */}
            <div className="rounded-[18px] border-[3px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.28)]">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"><Sparkles size={14} className="text-[#e6ad45]" /> অন্বেষণ করুন</h3>
              <ul className="mt-5 space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#173528]/35 hover:text-[#b8d85a]">
                      <span className="h-2 w-2 rounded-full bg-[#b8d85a] transition-transform group-hover:scale-125" />{link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="rounded-[18px] border-[3px] border-[#0c2218] bg-[#173528] p-6 text-[#f7f0d0] shadow-[8px_8px_0_rgba(12,34,24,0.28)] ring-1 ring-[#b8d85a]/20">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"><ShieldCheck size={14} className="text-[#b8d85a]" /> নাগরিক পরিষেবা</h3>
              <ul className="mt-5 space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("#") ? (
                      <button type="button" onClick={() => scrollToSection(link.href.replace("#", ""))} className="group flex w-full items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-left text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#e6ad45]/50 hover:bg-[#2d684d]/50 hover:text-[#e6ad45]">
                        <span className="h-2 w-2 rounded-full bg-[#e6ad45] transition-transform group-hover:scale-125" />{link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="group flex items-center gap-3 rounded-xl border border-[#f7f0d0]/10 px-3 py-2 text-sm font-bold text-[#dfe8c4] transition hover:-translate-y-0.5 hover:border-[#b8d85a]/50 hover:bg-[#2d684d]/50 hover:text-[#b8d85a]">
                        <LogIn size={14} className="text-[#b8d85a] transition group-hover:translate-x-0.5" />{link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] p-4 text-[#173528] shadow-[4px_4px_0_#0c2218]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8d85a] text-[#173528]"><Sparkles size={16} className="animate-pulse" /></span>
                  <div>
                    <p className="text-xs font-black">পোর্টাল অনলাইন</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#58705e]">২৪/৭ ডিজিটাল পরিষেবা উপলব্ধ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-6 border-t-2 border-[#b8d85a]/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#dfe8c4]">
                © {new Date().getFullYear()} পালিতপুরকানেক্ট। <span>তৈরি করা হয়েছে</span>
                <Heart size={13} className="animate-pulse fill-[#e6ad45] text-[#e6ad45]" /> <span>পালিতপুরের জন্য।</span>
              </p>
              <p className="mt-1 text-xs font-medium text-[#a7b89a]">প্রযুক্তির মাধ্যমে বাসিন্দা, সম্প্রদায় এবং নাগরিক পরিষেবাকে যুক্ত করা হচ্ছে।</p>
            </div>

            <button type="button" onClick={scrollToTop} className="group inline-flex w-fit items-center gap-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d85a]">
              <span>উপরে যান</span><ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}