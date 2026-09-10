/**
 * PalitpurConnect — clean landing page supporting up to 10 images per section with auto-rotating Village Gallery.
 */

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Drum,
  ExternalLink,
  Flower2,
  HeartHandshake,
  Home,
  Landmark,
  MapPin,
  Navigation,
  Palette,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Waves,
  Wheat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

/* ------------------------------------------------------------------ helpers */

const cx = (...parts) => parts.filter(Boolean).join(" ");

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // If the path contains full Windows/Linux system paths accidentally saved to DB, extract just the /uploads/ filename part
  if (url.includes("uploads")) {
    const relativePart = url.substring(url.indexOf("uploads") - 1); // captures /uploads/...
    const cleanPath = relativePart.startsWith("/") ? relativePart : `/${relativePart}`;
    return `http://localhost:5000${cleanPath}`;
  }
  
  const formattedPath = url.startsWith("/") ? url : `/${url}`;
  return `http://localhost:5000${formattedPath}`;
};

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-[2px] border-[#0c2218] font-black transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

const BTN_VARIANT = {
  hero: "bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218] hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]",
  harvest:
    "bg-[#e6ad45] text-[#173528] shadow-[4px_4px_0_#0c2218] hover:-translate-y-0.5 hover:bg-[#b8d85a] hover:shadow-[5px_5px_0_#0c2218]",
  glass:
    "border-[2px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] hover:-translate-y-0.5 hover:bg-[#b8d85a]",
  quiet: "border-[2px] border-[#0c2218] bg-[#2d684d] text-[#f7f0d0] shadow-[4px_4px_0_#0c2218] hover:-translate-y-0.5 hover:bg-[#173528]",
};

const BTN_SIZE = {
  default: "h-11 px-5 text-xs",
  lg: "h-12 px-6 text-sm",
  xl: "h-14 px-8 text-sm sm:text-base",
};

function Btn({ variant = "hero", size = "default", className, as: As = "button", ...props }) {
  return (
    <As
      className={cx(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)}
      {...props}
    />
  );
}

const CHIP_VARIANT = {
  leaf: "border-2 border-[#0c2218] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218]",
  harvest: "border-2 border-[#0c2218] bg-[#e6ad45] text-[#173528] shadow-[3px_3px_0_#0c2218]",
  night: "border-2 border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[3px_3px_0_#0c2218]",
};

function Chip({ variant = "leaf", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-black tracking-widest uppercase",
        CHIP_VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

function Tag({ children, tone = "light" }) {
  return (
    <span
      className={cx(
        "rounded-xl px-2.5 py-1 text-[0.7rem] font-black border-2 border-[#0c2218] shadow-[2px_2px_0_#0c2218]",
        tone === "night"
          ? "bg-[#173528] text-[#f7f0d0]"
          : "bg-[#b8d85a] text-[#173528]",
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------- text marquee divider */

function TextMarquee({ textItems = ["পালিতপুর কানেক্ট 🌾", "ডিজিটাল গ্রাম পোর্টাল", "বীরভূম, পশ্চিমবঙ্গ", "গ্রাম যাচাইকৃত", "২৪/৭ নাগরিক পরিষেবা"] }) {
  return (
    <div className="relative w-full overflow-hidden border-y-[3px] border-[#0c2218] bg-[#e6ad45] py-3 text-[#173528] shadow-[inset_0_4px_0_rgba(12,34,24,0.15)]">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {[...textItems, ...textItems, ...textItems, ...textItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]">{item}</span>
            <span className="h-2 w-2 rounded-full bg-[#173528]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- image carousel */

function ImageCarousel({ images, fallbackUrl, alt, aspectRatio = "h-[30rem]" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  let rawList = [];
  [images, fallbackUrl].forEach((item) => {
    if (Array.isArray(item)) {
      rawList.push(...item);
    } else if (typeof item === "string") {
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) rawList.push(...parsed);
        else if (item.includes(",")) rawList.push(...item.split(",").map(s => s.trim()));
        else rawList.push(item);
      } catch {
        if (item.includes(",")) rawList.push(...item.split(",").map(s => s.trim()));
        else rawList.push(item);
      }
    }
  });

  const validImages = rawList.map(getImageUrl).filter(Boolean);
  const uniqueImages = [...new Set(validImages)].slice(0, 10);

  useEffect(() => {
    if (uniqueImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === uniqueImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [uniqueImages.length]);

  if (uniqueImages.length === 0) {
    return (
      <div className={cx("w-full bg-[#2d684d] flex flex-col items-center justify-center p-8 text-center text-[#f7f0d0] rounded-[24px] border-[3px] border-[#0c2218] shadow-[8px_8px_0_rgba(12,34,24,0.3)]", aspectRatio)}>
        <Sparkles className="h-12 w-12 text-[#e6ad45] mb-2 animate-pulse" />
        <p className="font-black text-base">মিডিয়া স্পেস</p>
        <p className="text-xs text-[#dfe8c4] mt-1 font-semibold">অ্যাডমিন ড্যাশবোর্ড থেকে সর্বোচ্চ ১০টি ছবি আপলোড করুন</p>
      </div>
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? uniqueImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === uniqueImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cx("relative overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] shadow-[10px_10px_0_rgba(12,34,24,0.3)] group bg-[#173528]", aspectRatio)}>
      <img
        src={uniqueImages[currentIndex]}
        alt={alt || "সেকশন স্লাইড"}
        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(12,34,24,0.18)_55%,rgba(12,34,24,0.85)_100%)] opacity-90" />

      {uniqueImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-[#b8d85a]"
            aria-label="আগের স্লাইড"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-[#b8d85a]"
            aria-label="পরবর্তী স্লাইড"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-2xl border-2 border-[#0c2218] bg-[#173528]/90 px-3 py-1.5 backdrop-blur-md shadow-[4px_4px_0_#0c2218]">
            {uniqueImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cx(
                  "h-2 rounded-full transition-all border border-[#0c2218]",
                  currentIndex === idx ? "w-6 bg-[#b8d85a]" : "w-2 bg-[#f7f0d0]/50",
                )}
                aria-label={`স্লাইড ${idx + 1}-এ যান`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- floating motifs */

const MOTIFS = [
  { glyph: "ॐ", className: "left-[4%] top-[12%] text-[7rem]" },
  { glyph: "卐", className: "right-[6%] top-[22%] text-[5.5rem]" },
  { glyph: "শ্রী", className: "left-[12%] bottom-[14%] text-[4.5rem]" },
  { glyph: "❁", className: "right-[14%] bottom-[10%] text-[5rem]" },
  { glyph: "ॐ", className: "right-[38%] top-[6%] text-[3.5rem]" },
  { glyph: "卐", className: "left-[34%] bottom-[4%] text-[3.2rem]" },
];

function FloatingMotifs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {MOTIFS.map((motif, index) => (
        <span
          key={`${motif.glyph}-${index}`}
          className={cx(
            "absolute font-black opacity-[0.04]",
            motif.className,
            "text-[#f7f0d0]"
          )}
        >
          {motif.glyph}
        </span>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- section heading */

function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  tone = "light",
  align = "center",
}) {
  const night = tone === "night";
  return (
    <div className={cx("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow}
      <h2
        className={cx(
          "mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]",
          night ? "text-[#f7f0d0]" : "text-[#173528]",
        )}
      >
        {title} {accent && <span className="text-[#2d684d]">{accent}</span>}
      </h2>
      {description && (
        <p
          className={cx(
            "mt-4 text-base leading-relaxed sm:text-lg font-medium",
            night ? "text-[#dfe8c4]" : "text-[#42604e]",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- hero */

const HERO_STATS = [
  { icon: Users, label: "কমিউনিটি", value: "100+", note: "সংযুক্ত গ্রামবাসী" },
  { icon: MapPin, label: "লোকেশন", value: "5+", note: "স্থানীয় এলাকা" },
  { icon: ShieldCheck, label: "অ্যাক্সেস", value: "24/7", note: "ডিজিটাল পরিষেবা" },
];

function Hero({ data }) {
  const navigate = useNavigate();
  const titleParts = data.title ? data.title.split(". ") : ["একটি গ্রাম,", "সম্পূর্ণ সংযুক্ত।"];

  return (
    <section id="welcome" className="relative overflow-hidden bg-[#173528] text-[#f7f0d0] pt-24 pb-16 border-b-[3px] border-[#0c2218]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16 py-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Chip variant="night">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8d85a] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8d85a]" />
              </span>
              পালিতপুর • বীরভূম • পশ্চিমবঙ্গ
            </Chip>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-[#f7f0d0] sm:text-6xl lg:text-[4.2rem] leading-[1.08]">
              {titleParts[0]} <br />
              <span className="text-[#b8d85a]">{titleParts[1] || "সম্পূর্ণ সংযুক্ত।"}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-[#dfe8c4]">
              {data.subtitle || "পালিতপুর কানেক্ট আমাদের পাড়া, মানুষ, ঐতিহ্য ও নাগরিক পরিষেবার ডিজিটাল প্রবেশদ্বার — সাহায্য খোঁজা, খবর রাখা এবং একাত্ম বোধ করার একটি শান্ত জায়গা।"}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Btn size="xl" className="group" onClick={() => scrollTo("villages")}>
                পালিতপুর ঘুরে দেখুন
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
              <Btn variant="glass" size="xl" onClick={() => navigate("/login")}>
                নাগরিক লগইন
                <ArrowRight />
              </Btn>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-3 divide-x-2 divide-[#0c2218]/20 border-y-2 border-[#0c2218]/20 py-6">
              {HERO_STATS.map(({ icon: Icon, label, value, note }, i) => (
                <div key={label} className={i === 0 ? "pr-4" : "px-4"}>
                  <dt className="flex items-center gap-1.5 text-[#b8d85a]">
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                  </dt>
                  <dd>
                    <p className="mt-2 text-2xl sm:text-3xl font-black text-[#f7f0d0]">{value}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#a7b89a]">{note}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-[36rem]">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="হিরো ব্যানার শোকেস"
                aspectRatio="h-[30rem]"
              />

              <div className="absolute -right-3 -top-6 hidden items-center gap-3 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-3 text-[#173528] shadow-[4px_4px_0_#0c2218] backdrop-blur-xl sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8d85a] border border-[#173528]">
                  <Navigation className="h-4 w-4 text-[#173528]" />
                </span>
                <span>
                  <p className="text-xs font-black">আপনার গ্রাম</p>
                  <p className="text-[10px] font-semibold text-[#58705e]">বীরভূম, পশ্চিমবঙ্গ</p>
                </span>
              </div>

              <div className="absolute -bottom-7 -left-4 flex items-center gap-3 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-3 text-[#173528] shadow-[4px_4px_0_#0c2218] backdrop-blur-xl sm:-left-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8d85a] border border-[#173528]">
                  <ShieldCheck className="h-4 w-4 text-[#173528]" />
                </span>
                <span>
                  <p className="text-xs font-black">নাগরিক পরিষেবা</p>
                  <p className="text-[10px] font-semibold text-[#58705e]">গ্রাম যাচাইকৃত</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- community */

const COMMUNITY_STATS = [
  { value: "100+", label: "সংযুক্ত গ্রামবাসী", note: "স্থানীয় পাড়াজুড়ে" },
  { value: "24/7", label: "ডিজিটাল অ্যাক্সেস", note: "নাগরিক তথ্য" },
  { value: "100%", label: "কমিউনিটি ফোকাস", note: "মানুষই প্রথম" },
  { value: "1", label: "একক প্ল্যাটফর্ম", note: "পালিতপুরকানেক্ট" },
];

const PILLARS = [
  {
    icon: Users,
    title: "মানুষ ও দৈনন্দিন জীবন",
    body: "প্রতিদিনের কথোপকথন, ভাগ করে নেওয়া কাজ এবং শান্ত প্রতিবেশীসুলভতা — যে আত্মা পালিতপুরকে বাড়ির মতো অনুভব করায়।",
    tags: ["পরিবার", "প্রতিবেশী", "যুবসমাজ", "প্রবীণ"],
  },
  {
    icon: Sparkles,
    title: "উৎসব ও সমাবেশ",
    body: "গ্রামের পুজো, সাংস্কৃতিক অনুষ্ঠান, মৌসুমি মেলা ও সমাবেশ যা সারা বছরকে রঙিন করে তোলে।",
    tags: ["উৎসব", "মেলা", "অনুষ্ঠান", "লোকমেলা"],
  },
  {
    icon: HeartHandshake,
    title: "সংযুক্ত ও সম্পৃক্ত",
    body: "খবর রাখুন, উদ্বেগ জানান, স্থানীয় পরিষেবা খুঁজুন এবং একটি শক্তিশালী গ্রাম গড়তে অংশ নিন।",
    tags: ["খবর রাখুন", "সমস্যা জানান", "সাহায্য নিন", "অংশগ্রহণ করুন"],
  },
];

function Community({ data }) {
  const navigate = useNavigate();

  return (
    <section id="community" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28 border-b-[3px] border-[#0c2218]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
        <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 sm:p-10 lg:p-14 text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
          <SectionHeading
            tone="light"
            eyebrow={
              <Chip variant="leaf" className="mx-auto">
                <Users className="h-3.5 w-3.5" />
                আমাদের কমিউনিটি
              </Chip>
            }
            title={data.title || "যে গ্রাম সংযুক্ত"}
            accent={data.title ? "" : "মানুষের মাধ্যমে"}
            description={data.subtitle || "পালিতপুর শুধু কয়েকটি পাড়ার সমষ্টি নয়। এটি সম্পর্ক, ঐতিহ্য, সহযোগিতা ও ভাগ করে নেওয়া দায়িত্বের উপর গড়ে ওঠা একটি কমিউনিটি।"}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COMMUNITY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[6px_6px_0_#0c2218] transition-all hover:-translate-y-1 hover:bg-[#173528]"
              >
                <p className="text-3xl sm:text-4xl font-black text-[#b8d85a]">{stat.value}</p>
                <p className="mt-2 font-bold text-sm text-[#f7f0d0]">{stat.label}</p>
                <p className="mt-1 text-xs font-medium text-[#dfe8c4]">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="কমিউনিটি জীবন"
                aspectRatio="h-full min-h-[26rem]"
              />
            </div>

            <div className="grid gap-6 lg:col-span-7">
              {PILLARS.map(({ icon: Icon, title, body, tags }) => (
                <article
                  key={title}
                  className="group rounded-2xl border-[2px] border-[#0c2218] bg-[#173528] p-6 text-[#f7f0d0] shadow-[6px_6px_0_#0c2218] transition-all hover:-translate-y-1 hover:bg-[#214636]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#173528] transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-[#f7f0d0]">{title}</h3>
                      <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">{body}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} tone="night">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border-[3px] border-[#0c2218] bg-[#173528] p-8 sm:p-10 text-[#f7f0d0] shadow-[8px_8px_0_#0c2218] relative overflow-hidden">
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e6ad45]">একসাথে, আমরা গড়ি পালিতপুর</span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-[#f7f0d0]">
                  আপনার কমিউনিটি। আপনার কণ্ঠস্বর। আপনার গ্রাম।
                </h3>
                <p className="mt-2 text-sm font-medium text-[#dfe8c4]">
                  পালিতপুর কানেক্ট নাগরিক ও স্থানীয় প্রশাসনের মধ্যে সংযোগ রাখা, তথ্য বিনিময় করা এবং একসাথে কাজ করা সহজ করে তোলে।
                </p>
              </div>
              <Btn variant="harvest" size="xl" className="shrink-0" onClick={() => navigate("/login")}>
                কমিউনিটিতে যোগ দিন
                <ArrowRight />
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ village gallery */

function VillageGallery({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  let rawList = [];
  const source = data.images || data.image_url;

  if (Array.isArray(source)) {
    rawList = source;
  } else if (typeof source === "string") {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) rawList = parsed;
      else if (source.includes(",")) rawList = source.split(",").map(s => ({ url: s.trim(), title: "পালিতপুর দৃশ্য", description: "গ্রামজীবনের একটি ধারণকৃত মুহূর্ত।" }));
      else rawList = [{ url: source, title: "পালিতপুর দৃশ্য", description: "গ্রামজীবনের একটি ধারণকৃত মুহূর্ত।" }];
    } catch {
      rawList = [{ url: source, title: "পালিতপুর দৃশ্য", description: "গ্রামজীবনের একটি ধারণকৃত মুহূর্ত।" }];
    }
  }

  const items = rawList
    .map((item) => {
      const url = typeof item === "string" ? item : item.url;
      const validUrl = getImageUrl(url);
      if (!validUrl) return null;
      return {
        url: validUrl,
        title: typeof item === "object" && item.title ? item.title : "পালিতপুরের মুহূর্ত",
        description: typeof item === "object" && item.description ? item.description : "আমাদের দৈনন্দিন গ্রামজীবন ও ঐতিহ্যের একঝলক।",
      };
    })
    .filter(Boolean)
    .slice(0, 10);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <section id="gallery" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28 border-b-[3px] border-[#0c2218]">
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
          <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-12 text-center text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
            <Sparkles className="mx-auto h-12 w-12 text-[#e6ad45] mb-3 animate-pulse" />
            <h3 className="text-2xl font-black">ভিলেজ গ্যালারি স্পেস</h3>
            <p className="mt-2 text-sm font-medium text-[#42604e]">অ্যাডমিন ব্যাকএন্ড ড্যাশবোর্ড থেকে কাস্টম শিরোনাম ও বিবরণসহ ছবি আপলোড করতে পারেন।</p>
          </div>
        </div>
      </section>
    );
  }

  const currentItem = items[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28 border-b-[3px] border-[#0c2218]">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#b8d85a]/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-[#e6ad45]/15 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
        <div className="rounded-[32px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 sm:p-12 lg:p-16 text-[#173528] shadow-[14px_14px_0_rgba(12,34,24,0.35)]">
          <SectionHeading
            tone="light"
            eyebrow={
              <Chip variant="leaf" className="mx-auto shadow-[4px_4px_0_#173528]">
                <Palette className="h-4 w-4 text-[#173528]" />
                ভিলেজ গ্যালারি শোকেস
              </Chip>
            }
            title={data.title || "দৃশ্যকথা"}
            accent={data.title ? "" : "পালিতপুরের ঐতিহ্যের"}
            description={data.subtitle || "আমাদের কমিউনিটির প্রতিটি পাড়া জুড়ে ধারণ করা দৈনন্দিন মুহূর্ত, মৌসুমি উৎসব এবং চিরন্তন দৃশ্যপটে ডুবে যান।"}
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Cinematic Image Frame */}
            <div className="relative overflow-hidden rounded-[28px] border-[3px] border-[#0c2218] bg-[#173528] shadow-[10px_10px_0_#0c2218] h-[30rem] sm:h-[38rem] lg:col-span-7 group">
              <img
                key={currentIndex}
                src={currentItem.url}
                alt={currentItem.title}
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,34,24,0.1)_40%,rgba(12,34,24,0.85)_90%)]" />

              {/* Floating Live Badge over Image */}
              <div className="absolute top-5 left-5 flex items-center gap-2 rounded-xl border-2 border-[#0c2218] bg-[#f7f0d0] px-3.5 py-1.5 text-xs font-black text-[#173528] shadow-[3px_3px_0_#0c2218] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e6ad45] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e6ad45]" />
                </span>
                লাইভ মুহূর্ত • {currentIndex + 1} / {items.length}
              </div>

              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:-translate-x-0.5 hover:bg-[#b8d85a]"
                    aria-label="আগের স্লাইড"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[3]" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:translate-x-0.5 hover:bg-[#b8d85a]"
                    aria-label="পরবর্তী স্লাইড"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[3]" />
                  </button>
                </>
              )}
            </div>

            {/* Premium Editorial Info Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#173528] p-8 sm:p-10 text-[#f7f0d0] shadow-[10px_10px_0_#0c2218] space-y-6 relative overflow-hidden">
                {/* Background ambient accent inside card */}
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#b8d85a]/10 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b-2 border-[#0c2218]/40 pb-4">
                  <span className="rounded-xl bg-[#b8d85a] px-4 py-1.5 text-xs font-black border-2 border-[#0c2218] text-[#173528] uppercase tracking-widest shadow-[2px_2px_0_#0c2218]">
                    বিশেষ স্মৃতি 🌾
                  </span>
                </div>

                <div className="space-y-4 min-h-[140px]">
                  <h3 className="text-2xl sm:text-4xl font-black text-[#f7f0d0] tracking-tight leading-tight">
                    {currentItem.title}
                  </h3>
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-[#dfe8c4]">
                    {currentItem.description}
                  </p>
                </div>

                {/* Progress Indicators & Interactive Pills */}
                {items.length > 1 && (
                  <div className="pt-4 border-t-2 border-[#0c2218]/40 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      {items.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={cx(
                            "h-3 rounded-full transition-all border-2 border-[#0c2218]",
                            currentIndex === idx 
                              ? "w-10 bg-[#b8d85a] shadow-[2px_2px_0_#0c2218]" 
                              : "w-3 bg-[#f7f0d0]/30 hover:bg-[#f7f0d0]/60",
                          )}
                          aria-label={`ছবি ${idx + 1}-এ যান`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- villages */

const resolveIcon = (iconName) => {
  switch (String(iconName).toLowerCase()) {
    case "sprout": return Sprout;
    case "landmark": return Landmark;
    case "waves": return Waves;
    case "home":
    default:
      return Home;
  }
};

function Villages({ data = {} }) {
  const defaultAreas = [
    {
      name: "পালিতপুর মূল",
      icon: "Home",
      summary: "গ্রামের প্রাণকেন্দ্র — বাজার গলি এবং প্রাথমিক বিদ্যালয়।",
      tags: ["বাজার", "পঞ্চায়েত", "বিদ্যালয়"],
    },
    {
      name: "আমতলা পাড়া",
      icon: "Sprout",
      summary: "চারদিকে আম বাগান ও উন্মুক্ত ধানের ক্ষেত, মাঠের রাস্তা ধরে ঘেরা বাড়িগুলো।",
      tags: ["বাগান", "খেত", "বাড়ি"],
    },
    {
      name: "উত্তর পল্লী",
      icon: "Landmark",
      summary: "উত্তরের পাড়া, তার মন্দির প্রাঙ্গণ এবং সন্ধ্যার আড্ডার জন্য পরিচিত।",
      tags: ["মন্দির", "প্রাঙ্গণ", "জমায়েত"],
    },
    {
      name: "পুকুর ডাঙ্গা",
      icon: "Waves",
      summary: "পুকুর, মাছ ধরা এবং ঘাট যা প্রতি সকালের রুটিন তৈরি করে।",
      tags: ["পুকুর", "ঘাট", "মাছ ধরা"],
    },
  ];

  const areasList = Array.isArray(data.areas) && data.areas.length > 0 ? data.areas : defaultAreas;

  return (
    <section id="villages" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28 border-b-[3px] border-[#0c2218]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
        <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 sm:p-10 lg:p-14 text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionHeading
                align="left"
                tone="light"
                eyebrow={
                  <Chip variant="leaf">
                    <Compass className="h-3.5 w-3.5" />
                    গ্রাম শোকেস
                  </Chip>
                }
                title={data.title || "পাঁচটি পাড়া,"}
                accent={data.title ? "" : "একটি পালিতপুর"}
                description={data.subtitle || "প্রতিটি পাড়ার নিজস্ব বৈশিষ্ট্য রয়েছে — মাঠ, পুকুর, মন্দির ও গলিপথ। একসাথে তারা গড়ে তোলে আপনার চেনা গ্রামটি।"}
              />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-[2px] border-[#0c2218] bg-[#2d684d] p-6 text-[#f7f0d0] shadow-[6px_6px_0_#0c2218]">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#e6ad45]">ডাক অঞ্চল</p>
                <p className="mt-1 text-xl font-black text-[#f7f0d0]"> নুতনহাট • ৭১৩১৪৭</p>
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#dfe8c4]">
                  পালিতপুর পশ্চিমবঙ্গের বীরভূম জেলায় অবস্থিত, চারপাশে ধানখেত এবং গ্রামীণ রাস্তা দিয়ে নিকটবর্তী শহরগুলির সাথে সংযুক্ত।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="গ্রাম শোকেস"
                aspectRatio="h-full min-h-[28rem]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {areasList.map((area, idx) => {
                const IconComponent = typeof area.icon === "string" ? resolveIcon(area.icon) : (area.icon || Home);
                const areaTags = Array.isArray(area.tags) ? area.tags : (typeof area.tags === "string" ? area.tags.split(",") : []);

                return (
                  <article
                    key={area.name || idx}
                    className="group rounded-2xl border-[2px] border-[#0c2218] bg-[#173528] p-5 text-[#f7f0d0] shadow-[6px_6px_0_#0c2218] transition-all hover:-translate-y-1 hover:bg-[#214636]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#173528]">
                        <IconComponent className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-black text-[#f7f0d0]">{area.name}</h3>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#b8d85a] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">{area.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {areaTags.map((tag, tIdx) => (
                            <Tag key={tIdx} tone="night">{typeof tag === 'string' ? tag.trim() : tag}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ culture */

const TRADITIONS = [
  {
    icon: Flower2,
    title: "বছরের উৎসবসমূহ",
    body: "দুর্গাপুজো, পৌষমেলার দিনগুলি, কালীপুজো এবং প্রতিটি গলি আলোকিত করা ছোট পাড়া-পুজো।",
  },
  {
    icon: Drum,
    title: "গান ও পরিবেশনা",
    body: "বাউল গান, কীর্তন সন্ধ্যা এবং গ্রামীণ শিল্পীদের হাতে বয়ে চলা লোকনাট্য।",
  },
  {
    icon: Palette,
    title: "কারুশিল্প ও টেরাকোটা",
    body: "মাটির কাজ, আলপনা এবং পারিবারিক আঙিনায় চর্চিত হস্তচালিত তাঁতের বুনন।",
  },
  {
    icon: Wheat,
    title: "ফসল ও ঋতু",
    body: "নবান্ন ও ফসল কাটার আচার যা কৃষি পঞ্জিকাকে গ্রামজীবনের কেন্দ্রে রাখে।",
  },
];

function Culture({ data }) {
  return (
    <section id="culture" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28 border-b-[3px] border-[#0c2218]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
        <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 sm:p-10 lg:p-14 text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
          <SectionHeading
            tone="light"
            eyebrow={
              <Chip variant="leaf" className="mx-auto">
                <Flower2 className="h-3.5 w-3.5" />
                সংস্কৃতি ও ঐতিহ্য
              </Chip>
            }
            title={data.title || "ঐতিহ্য বেঁচে আছে"}
            accent={data.title ? "" : "প্রতিটি প্রজন্মের হাতে"}
            description={data.subtitle || "টেরাকোটা মন্দির, বাউল গান, ফসল কাটার আচার ও উৎসবের রাত — যে ঐতিহ্য পালিতপুরকে তার কণ্ঠস্বর দেয়।"}
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="সংস্কৃতি ও ঐতিহ্য"
                aspectRatio="h-full min-h-[28rem]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              {TRADITIONS.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="group flex flex-col rounded-2xl border-[2px] border-[#0c2218] bg-[#173528] p-6 text-[#f7f0d0] shadow-[6px_6px_0_#0c2218] transition-all hover:-translate-y-1 hover:bg-[#214636]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#173528] transition-transform duration-300 group-hover:-translate-y-1">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-black text-[#f7f0d0]">{title}</h3>
                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-[#dfe8c4]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- map block */

const MAP_QUERY = "Palitpur,Birbhum,West+Bengal,713147,India";
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

const PLACES = [
  { label: "পালিতপুর পল্লীমঙ্গল সমিতি", icon: ShieldCheck, description: "ক্লাব" },
  { label: "স্বাস্থ্যকেন্দ্র", icon: Users, description: "স্বাস্থ্যসেবা" },
  { label: "প্রাথমিক বিদ্যালয়", icon: Compass, description: "শিক্ষা ও পাঠ" },
  { label: "হনুমান মন্দির", icon: Sparkles, description: "মন্দির" },
];

function MapSection() {
  return (
    <section id="map" className="relative overflow-hidden bg-[#173528] py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
      <FloatingMotifs />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-16">
        <div className="rounded-[28px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-6 sm:p-10 lg:p-14 text-[#173528] shadow-[12px_12px_0_rgba(12,34,24,0.3)]">
          <SectionHeading
            tone="light"
            eyebrow={
              <Chip variant="leaf" className="mx-auto">
                <Navigation className="h-3.5 w-3.5" />
                পালিতপুর ঘুরে দেখুন
              </Chip>
            }
            title="পথ খুঁজে নিন"
            accent="গ্রামের চারপাশে"
            description="প্রতিদিনের জীবনে গুরুত্বপূর্ণ কমিউনিটি স্থান, পরিষেবা ও ল্যান্ডমার্কসহ পালিতপুরের বিন্যাস আবিষ্কার করুন।"
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="group relative min-h-[30rem] overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] shadow-[8px_8px_0_#0c2218] lg:col-span-8 bg-[#173528]">
              <iframe
                title="পালিতপুর, বীরভূম, পশ্চিমবঙ্গের মানচিত্র"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 opacity-90 grayscale-[15%] transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />

              <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-xl border-2 border-[#0c2218] bg-[#f7f0d0] px-4 py-2 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8d85a] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8d85a]" />
                  </span>
                  লাইভ ভৌগোলিক দৃশ্য
                </span>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-xl border-2 border-[#0c2218] bg-[#b8d85a] px-4 py-2 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition hover:bg-[#e6ad45]"
                >
                  গুগল ম্যাপে খুলুন
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="rounded-[24px] border-[3px] border-[#0c2218] bg-[#173528] p-6 text-[#f7f0d0] shadow-[8px_8px_0_#0c2218]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-black text-[#f7f0d0]">গুরুত্বপূর্ণ স্থান</h3>
                <p className="mt-1.5 text-xs font-medium text-[#dfe8c4]">
                  দৈনন্দিন গ্রামজীবনে গুরুত্বপূর্ণ স্থানগুলি দ্রুত চিহ্নিত করুন।
                </p>

                <ul className="mt-6 space-y-3">
                  {PLACES.map(({ label, icon: Icon, description }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 rounded-xl border-2 border-[#0c2218] bg-[#2d684d] p-3 text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] transition hover:bg-[#173528]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#0c2218] bg-[#b8d85a] text-[#173528]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <p className="text-xs font-black text-[#f7f0d0]">{label}</p>
                        <p className="text-[11px] font-semibold text-[#dfe8c4]">{description}</p>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- page */

export default function LandingPage() {
  const [content, setContent] = useState({});

  useEffect(() => {
    async function fetchLandingData() {
      try {
        const response = await api.getLandingContent();
        const map = {};
        (response?.data || []).forEach((item) => {
          map[item.section_key] = item;
        });
        setContent(map);
      } catch (err) {
        console.error("Failed to load landing page data:", err);
      }
    }
    fetchLandingData();
  }, []);

  const heroData = content.hero_main || {};
  const communityData = content.community_section || {};
  const galleryData = content.village_gallery || {};
  const villagesData = content.villages_section || {};
  const cultureData = content.culture_section || {};

  return (
    <div className="min-h-screen bg-[#173528] text-[#f7f0d0]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <main>
        <Hero data={heroData} />
        <TextMarquee />
        <Community data={communityData} />
        <TextMarquee textItems={["ভিলেজ গ্যালারি 📸", "ধারণকৃত মুহূর্ত", "দৈনন্দিন জীবন", "পালিতপুরের গল্প"]} />
        <VillageGallery data={galleryData} />
        <TextMarquee textItems={["আমতলা পাড়া", "উত্তর পল্লী", "পুকুর ডাঙা", "পালিতপুর মেইন", "বীরভূম পশ্চিমবঙ্গ"]} />
        <Villages data={villagesData} />
        <TextMarquee textItems={["দুর্গাপুজো", "বাউল গান", "টেরাকোটা ঐতিহ্য", "ফসল কাটার আচার", "সংস্কৃতি ও ঐতিহ্য"]} />
        <Culture data={cultureData} />
        <TextMarquee textItems={["পঞ্চায়েত অফিস", "স্বাস্থ্যকেন্দ্র", "গ্রামীণ বিদ্যালয়", "কৃষি সেবা", "ডিজিটাল পরিষেবা"]} />
        <MapSection />
      </main>
    </div>
  );
}