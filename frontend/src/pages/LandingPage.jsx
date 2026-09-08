/**
 * PalitpurConnect — clean landing page supporting up to 10 images per section.
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
  Leaf,
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
  return url.startsWith("http") ? url : `http://localhost:5000${url}`;
};

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

const BTN_VARIANT = {
  hero: "bg-[image:var(--gradient-leaf)] text-[#B07820]-foreground shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:brightness-110",
  harvest:
    "bg-[image:var(--gradient-harvest)] text-[#B07820]-foreground shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-105",
  glass:
    "border border-[#B07820]/20 bg-[#f7f0d0]/8 text-[#B07820] backdrop-blur-xl hover:bg-night-foreground/14",
  quiet: "border border-border bg-[#214636]/55 text-[#B07820] hover:bg-[#2d684d]",
};

const BTN_SIZE = {
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  xl: "h-14 px-8 text-base",
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
  leaf: "border-primary/20 bg-[#B07820]/12 text-[#B07820]",
  harvest: "border-accent/25 bg-amber-300/15 text-amber-300",
  night: "border-[#B07820]/15 bg-[#f7f0d0]/8 text-[#B07820] backdrop-blur-xl",
};

function Chip({ variant = "leaf", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide",
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
        "rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
        tone === "night"
          ? "border border-[#B07820]/15 bg-[#173528]/70 text-[#2D684D]"
          : "bg-muted text-[#2D684D]",
      )}
    >
      {children}
    </span>
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
    if (currentIndex >= uniqueImages.length) {
      setCurrentIndex(0);
    }
  }, [uniqueImages.length, currentIndex]);

  if (uniqueImages.length === 0) {
    return (
      <div className={cx("w-full bg-[radial-gradient(circle_at_top,#164e35,#07130d_68%)] flex flex-col items-center justify-center p-8 text-center text-[#2D684D] rounded-[2rem] border border-[#B07820]/15", aspectRatio)}>
        <Sparkles className="h-12 w-12 text-[#B07820] mb-2 animate-pulse" />
        <p className="font-semibold text-white">Media Space</p>
        <p className="text-xs text-[#a9a184] mt-1">Upload up to 10 images via Admin Dashboard</p>
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
    <div className={cx("relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-lift)] group", aspectRatio)}>
      <img
        src={uniqueImages[currentIndex]}
        alt={alt || "Section slide"}
        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(4,12,8,0.12)_55%,rgba(4,12,8,0.82)_100%)] opacity-90" />

      {uniqueImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-emerald-500/80"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-emerald-500/80"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
            {uniqueImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cx(
                  "h-2 rounded-full transition-all",
                  currentIndex === idx ? "w-7 bg-emerald-300" : "w-2 bg-white/40",
                )}
                aria-label={`Go to slide ${idx + 1}`}
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
  { glyph: "ॐ", className: "left-[4%] top-[12%] text-[7rem] float-a" },
  { glyph: "卐", className: "right-[6%] top-[22%] text-[5.5rem] float-b" },
  { glyph: "শ্রী", className: "left-[12%] bottom-[14%] text-[4.5rem] float-c" },
  { glyph: "❁", className: "right-[14%] bottom-[10%] text-[5rem] float-a" },
  { glyph: "ॐ", className: "right-[38%] top-[6%] text-[3.5rem] float-c" },
  { glyph: "卐", className: "left-[34%] bottom-[4%] text-[3.2rem] float-b" },
];

function FloatingMotifs({ tone = "light" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {MOTIFS.map((motif, index) => (
        <span
          key={`${motif.glyph}-${index}`}
          className={cx(
            "display absolute",
            motif.className,
            tone === "night" ? "text-harvest/12" : "text-[#B07820]/10",
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
          "display mt-5 text-4xl sm:text-5xl",
          night ? "text-[#B07820]" : "text-[#B07820]",
        )}
      >
        {title} {accent && <span className={night ? "text-gradient-leaf" : "text-[#B07820]"}>{accent}</span>}
      </h2>
      {description && (
        <p
          className={cx(
            "mt-5 text-base leading-8 sm:text-lg",
            night ? "text-[#2D684D]" : "text-[#2D684D]",
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
  { icon: Users, label: "Community", value: "1000+", note: "Villagers connected" },
  { icon: MapPin, label: "Location", value: "5+", note: "Local areas" },
  { icon: ShieldCheck, label: "Access", value: "24/7", note: "Digital services" },
];

function Hero({ data }) {
  const navigate = useNavigate();
  const titleParts = data.title ? data.title.split(". ") : ["A village,", "fully connected."];

  return (
    <section id="welcome" className="retro-section relative overflow-hidden border-b border-[#B07820]/15 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="grain absolute inset-0 opacity-60" />
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#B07820]/15 blur-[140px] animate-pulse" />
        <div className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[#B07820]/15 blur-[150px]" />
      </div>
      <FloatingMotifs tone="night" />

      <div className="page-x relative grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-12 lg:py-28">
        <div className="rise lg:col-span-6">
          <Chip variant="night">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
            </span>
            Palitpur • Birbhum • West Bengal
          </Chip>

          <h1 className="display mt-8 text-5xl tracking-tight text-[#B07820] drop-shadow-sm sm:text-6xl lg:text-[4.8rem]">
            {titleParts[0]} <br />
            <span className="bg-[linear-gradient(90deg,#86efac_0%,#facc15_48%,#fb923c_100%)] bg-clip-text text-transparent">{titleParts[1] || "fully connected."}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#e9e2c5]">
            {data.subtitle || "PalitpurConnect is the digital gateway to our neighbourhoods, people, heritage and civic services — one calm place to find help, stay informed and belong."}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Btn size="xl" className="group" onClick={() => scrollTo("villages")}>
              Explore Palitpur
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Btn>
            <Btn variant="glass" size="xl" onClick={() => navigate("/login")}>
              Citizen Login
              <ArrowRight />
            </Btn>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-3 divide-x divide-white/10 border-y border-[#B07820]/15 py-7">
            {HERO_STATS.map(({ icon: Icon, label, value, note }, i) => (
              <div key={label} className={i === 0 ? "pr-5" : "px-5"}>
                <dt className="flex items-center gap-2 text-[#B07820]">
                  <Icon className="h-4 w-4" />
                  <span className="eyebrow text-[0.6rem]">{label}</span>
                </dt>
                <dd>
                  <p className="display mt-3 text-3xl text-[#B07820]">{value}</p>
                  <p className="mt-1 text-xs text-[#2D684D]/80">{note}</p>
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
              alt="Hero Banner Showcase"
              aspectRatio="h-[30rem]"
            />

            <div className="absolute -right-3 -top-6 hidden items-center gap-3 rounded-2xl border border-[#B07820]/15 bg-[#173528]/90 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B07820]/15">
                <Navigation className="h-4 w-4 text-[#B07820]" />
              </span>
              <span>
                <p className="text-xs font-semibold text-[#B07820]">Your village</p>
                <p className="text-[0.7rem] text-[#2D684D]/80">Birbhum, West Bengal</p>
              </span>
            </div>

            <div className="absolute -bottom-7 -left-4 flex items-center gap-3 rounded-2xl border border-[#B07820]/15 bg-[#173528]/90 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B07820]/15">
                <ShieldCheck className="h-4 w-4 text-[#B07820]" />
              </span>
              <span>
                <p className="text-xs font-semibold text-[#B07820]">Civic services</p>
                <p className="text-[0.7rem] text-[#2D684D]/80">Panchayat verified</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- community */

const COMMUNITY_STATS = [
  { value: "1000+", label: "Connected villagers", note: "Across local paras" },
  { value: "24/7", label: "Digital access", note: "Civic information" },
  { value: "100%", label: "Community focus", note: "People first" },
  { value: "1", label: "Single platform", note: "PalitpurConnect" },
];

const PILLARS = [
  {
    icon: Users,
    title: "People & daily life",
    body: "Everyday conversations, shared work and quiet neighbourliness — the spirit that makes Palitpur feel like home.",
    tags: ["Families", "Neighbours", "Youth", "Elders"],
  },
  {
    icon: Sparkles,
    title: "Festivals & gatherings",
    body: "Village pujas, cultural programmes, seasonal fairs and gatherings that fill the year with colour.",
    tags: ["Festivals", "Fairs", "Programmes", "Melas"],
  },
  {
    icon: HeartHandshake,
    title: "Connected & involved",
    body: "Stay informed, raise concerns, find local services and take part in building a stronger village.",
    tags: ["Stay informed", "Report issues", "Get help", "Participate"],
  },
];

function Community({ data }) {
  const navigate = useNavigate();

  return (
    <section id="community" className="retro-section relative overflow-hidden border-y border-[#B07820]/15 py-24 sm:py-28">
      <FloatingMotifs tone="night" />
      <div className="pointer-events-none absolute inset-0">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#B07820]/12 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#B07820]/10 blur-[130px]" />
      </div>
      <div className="page-x relative">
        <div className="retro-panel rounded-[2.25rem] p-5 sm:p-8 lg:p-10">
          <SectionHeading
            tone="night"
            eyebrow={
              <Chip variant="night" className="mx-auto">
                <Users className="h-3.5 w-3.5" />
                Our community
              </Chip>
            }
            title={data.title || "A village connected by"}
            accent={data.title ? "" : "people"}
            description={data.subtitle || "Palitpur is more than a cluster of paras. It is a community built on relationships, tradition, cooperation and shared responsibility."}
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMMUNITY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="card-lift rounded-3xl border border-[#B07820]/15 bg-[#214636]/55 p-6 shadow-[0_18px_45px_-25px_rgba(20,83,45,0.35)] backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-[#B07820]/35 hover:bg-[#2d684d]/70 hover:shadow-[0_25px_55px_-25px_rgba(20,83,45,0.45)]"
              >
                <p className="display text-4xl text-[#B07820]">{stat.value}</p>
                <p className="mt-3 font-semibold text-[#B07820]">{stat.label}</p>
                <p className="mt-1 text-sm text-[#2D684D]">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="Community Life"
                aspectRatio="h-full min-h-[22rem]"
              />
            </div>

            <div className="grid gap-4 lg:col-span-7">
              {PILLARS.map(({ icon: Icon, title, body, tags }) => (
                <article
                  key={title}
                  className="card-lift group rounded-3xl border border-[#B07820]/15 bg-[#214636]/55 p-6 shadow-[0_18px_45px_-25px_rgba(20,83,45,0.3)] backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-[#B07820]/35 hover:bg-[#2d684d]/70 hover:shadow-[0_25px_55px_-25px_rgba(20,83,45,0.4)] sm:p-7"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-lime-300/10 text-[#B07820] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="display text-xl text-[#B07820]">{title}</h3>
                      <p className="mt-2.5 text-sm leading-7 text-[#2D684D]">{body}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="retro-section relative mt-6 overflow-hidden rounded-[2rem] border border-[#B07820]/15 p-8 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.75)] sm:p-12">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#B07820]/20 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#B07820]/15 blur-[110px]" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="eyebrow text-[#B07820]">Together, we build Palitpur</p>
                <h3 className="display mt-3 text-3xl text-[#B07820] sm:text-4xl">
                  Your community. Your voice. Your village.
                </h3>
                <p className="mt-4 text-base leading-7 text-[#2D684D]">
                  PalitpurConnect makes it easier for citizens and local administration to stay
                  connected, share information and work together.
                </p>
              </div>
              <Btn variant="harvest" size="xl" className="shrink-0" onClick={() => navigate("/login")}>
                Join the community
                <ArrowRight />
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- villages */

const AREAS = [
  {
    name: "Palitpur Main",
    icon: Home,
    summary: "The heart of the village — the market lane, panchayat office and primary school.",
    tags: ["Market", "Panchayat", "School"],
  },
  {
    name: "Amtola Para",
    icon: Sprout,
    summary: "Mango groves and open paddy on every side, with homes gathered along the field road.",
    tags: ["Groves", "Farmland", "Homes"],
  },
  {
    name: "Uttar Pally",
    icon: Landmark,
    summary: "The northern neighbourhood, known for its temple courtyard and evening gatherings.",
    tags: ["Temple", "Courtyard", "Gatherings"],
  },
  {
    name: "Pukur Danga",
    icon: Waves,
    summary: "Ponds, fishing and the bathing ghats that shape the rhythm of every morning.",
    tags: ["Ponds", "Ghats", "Fishing"],
  },
];

function Villages({ data }) {
  return (
    <section id="villages" className="retro-section relative overflow-hidden border-y border-[#B07820]/15 py-24 sm:py-28">
      <FloatingMotifs tone="night" />
      <div className="pointer-events-none absolute inset-0">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#B07820]/12 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#B07820]/10 blur-[130px]" />
      </div>
      <div className="page-x relative">
        <div className="retro-panel rounded-[2.25rem] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionHeading
                align="left"
                tone="night"
                eyebrow={
                  <Chip variant="night">
                    <Compass className="h-3.5 w-3.5" />
                    Village showcase
                  </Chip>
                }
                title={data.title || "Five neighbourhoods,"}
                accent={data.title ? "" : "one Palitpur"}
                description={data.subtitle || "Each para has its own character — fields, ponds, temples and lanes. Together they make the village you know."}
              />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#B07820]/15 bg-[#214636]/55 p-6 shadow-[0_18px_45px_-25px_rgba(120,53,15,0.3)] backdrop-blur-sm">
                <p className="eyebrow text-[#B07820]">Postal region</p>
                <p className="display mt-2 text-2xl text-[#B07820]">Birbhum • 713147</p>
                <p className="mt-2 text-sm leading-6 text-[#2D684D]">
                  Palitpur sits in the Birbhum district of West Bengal, surrounded by paddy fields
                  and connected by village roads to nearby towns.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="Villages showcase"
                aspectRatio="h-full min-h-[26rem]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {AREAS.map(({ name, icon: Icon, summary, tags }) => (
                <article
                  key={name}
                  className="card-lift group rounded-3xl border border-[#B07820]/15 bg-[#214636]/55 p-5 shadow-[0_18px_45px_-25px_rgba(20,83,45,0.28)] backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-[#B07820]/35 hover:bg-[#2d684d]/70 hover:shadow-[0_25px_55px_-25px_rgba(20,83,45,0.38)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-lime-300/10 text-[#B07820] shadow-inner">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="display text-lg text-[#B07820]">{name}</h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#2D684D] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B07820]" />
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-[#2D684D]">{summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
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
    title: "Festivals of the year",
    body: "Durga Puja, Poush Mela days, Kali Puja and the small para pujas that light every lane.",
  },
  {
    icon: Drum,
    title: "Song & performance",
    body: "Baul songs, kirtan evenings and folk theatre carried forward by village performers.",
  },
  {
    icon: Palette,
    title: "Craft & terracotta",
    body: "Clay work, alpona floor art and handloom weaving practised in family courtyards.",
  },
  {
    icon: Wheat,
    title: "Harvest & seasons",
    body: "Nabanna and harvest rituals that keep the farming calendar at the centre of village life.",
  },
];

function Culture({ data }) {
  return (
    <section id="culture" className="retro-section relative overflow-hidden border-y border-[#B07820]/15 py-24 sm:py-28">
      <FloatingMotifs tone="night" />
      <div className="pointer-events-none absolute inset-0">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#B07820]/12 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#B07820]/10 blur-[130px]" />
      </div>
      <div className="page-x relative">
        <div className="retro-panel rounded-[2.25rem] p-5 sm:p-8 lg:p-10">
          <SectionHeading
            tone="night"
            eyebrow={
              <Chip variant="night" className="mx-auto">
                <Flower2 className="h-3.5 w-3.5" />
                Culture & heritage
              </Chip>
            }
            title={data.title || "Traditions kept alive by"}
            accent={data.title ? "" : "every generation"}
            description={data.subtitle || "Terracotta temples, Baul songs, harvest rituals and festival nights — the heritage that gives Palitpur its voice."}
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ImageCarousel
                images={data.images}
                fallbackUrl={data.image_url}
                alt="Culture & Heritage"
                aspectRatio="h-full min-h-[28rem]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              {TRADITIONS.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="card-lift group flex flex-col rounded-3xl border border-[#B07820]/15 bg-[#214636]/55 p-6 shadow-[0_18px_45px_-25px_rgba(120,53,15,0.28)] backdrop-blur-sm transition-all hover:-translate-y-1.5 hover:border-amber-400/50 hover:bg-[#2d684d]/70 hover:shadow-[0_25px_55px_-25px_rgba(120,53,15,0.38)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 text-[#B07820] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="display mt-5 text-lg text-[#B07820]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#2D684D]">{body}</p>
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
  { label: "Panchayat office", icon: ShieldCheck, description: "Civic administration" },
  { label: "Health centre", icon: Users, description: "Healthcare services" },
  { label: "Schools", icon: Compass, description: "Education & learning" },
  { label: "Krishi Seva", icon: Sparkles, description: "Agriculture support" },
];

function MapSection() {
  return (
    <section id="map" className="retro-section relative overflow-hidden border-y border-[#B07820]/15 py-24 sm:py-28">
      <FloatingMotifs tone="night" />
      <div className="pointer-events-none absolute inset-0">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-[#B07820]/15 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#B07820]/10 blur-[130px]" />
      </div>

      <div className="page-x relative">
        <div className="retro-panel rounded-[2.25rem] border border-[#B07820]/15 bg-white/[0.035] p-5 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.75)] backdrop-blur-sm sm:p-8 lg:p-10">
          <SectionHeading
            tone="night"
            eyebrow={
              <Chip variant="night" className="mx-auto">
                <Navigation className="h-3.5 w-3.5" />
                Explore Palitpur
              </Chip>
            }
            title="Find your way around"
            accent="the village"
            description="Discover the layout of Palitpur along with the community locations, services and landmarks that matter day to day."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="group relative min-h-[30rem] overflow-hidden rounded-3xl border border-[#B07820]/15 shadow-[var(--shadow-lift)] lg:col-span-8">
              <iframe
                title="Map of Palitpur, Birbhum, West Bengal"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 opacity-90 grayscale-[15%] transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />

              <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full border border-[#B07820]/15 bg-[#173528]/85 px-4 py-2 text-sm font-medium text-[#B07820] backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
                  </span>
                  Live geographical view
                </span>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full border border-[#B07820]/15 bg-[#173528]/85 px-4 py-2 text-sm font-medium text-[#2D684D] backdrop-blur-xl transition hover:text-[#B07820]"
                >
                  Open in Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="rounded-3xl border border-[#B07820]/15 bg-[#f7f0d0]/6 p-6 backdrop-blur-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B07820]/15 text-[#B07820]">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="display mt-5 text-xl text-[#B07820]">Important locations</h3>
                <p className="mt-2 text-sm leading-6 text-[#2D684D]">
                  Quickly identify the places that matter to everyday village life.
                </p>

                <ul className="mt-6 space-y-3">
                  {PLACES.map(({ label, icon: Icon, description }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-night-foreground/10 bg-[#10281e]/75 p-3 transition hover:border-leaf/35 hover:bg-[#B07820]/10"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#214636] text-[#B07820]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <p className="text-sm font-medium text-[#B07820]">{label}</p>
                        <p className="text-xs text-[#2D684D]/80">{description}</p>
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
  const retroStyles = `
    /* PalitpurConnect text palette: emerald + warm heritage gold */
    .retro-section, .retro-section p, .retro-section span, .retro-section li { color: #2D684D; }
    .retro-section h1, .retro-section h2, .retro-section h3, .retro-section h4,
    .retro-section .display, .retro-section .eyebrow, .retro-section button,
    .retro-section a { color: #B07820; }
    .retro-section .text-\[\#2D684D\] { color: #2D684D !important; }
    .retro-section .text-\[\#B07820\] { color: #B07820 !important; }
    .retro-section .backdrop-blur-sm, .retro-section .backdrop-blur-xl {
      background-image: linear-gradient(135deg, rgba(247,240,208,.10), rgba(45,104,77,.18));
      box-shadow: inset 0 1px 0 rgba(247,240,208,.14), 0 18px 50px rgba(12,34,24,.18);
    }

    .retro-section {
      background-color: #173528;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #B07820;

      background-image: radial-gradient(rgba(247,240,208,.10) 1px, transparent 1px), radial-gradient(circle at 15% 15%, rgba(184,216,90,.16), transparent 28%), radial-gradient(circle at 85% 80%, rgba(230,173,69,.14), transparent 30%);
      background-size: 18px 18px, auto, auto;
    }
    .retro-panel {
      border: 3px solid rgba(18,39,29,.78) !important;
      box-shadow: 10px 10px 0 rgba(12,34,24,.28), inset 0 0 0 2px rgba(255,244,190,.30);
      background: linear-gradient(135deg, rgba(247,240,208,.98), rgba(226,218,175,.96)) !important;
      color: #173528;
    }
    .retro-section h1,.retro-section h2,.retro-section h3 { text-shadow: 2px 2px 0 rgba(92,72,34,.16); }
    .retro-section .rounded-2xl,.retro-section .rounded-3xl { border-radius: 14px !important; }
    .retro-section button,.retro-section a { transition: transform .22s ease, box-shadow .22s ease, filter .22s ease; }
    .retro-section button:hover,.retro-section a:hover { filter: saturate(1.08); }
    .retro-section .card-lift:hover { transform: translate(-3px,-3px); }
    .retro-section .page-x { position: relative; z-index: 2; }
    .retro-section .display {
      letter-spacing: -.035em;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 800;
      line-height: .98;
    }
    .retro-section h1, .retro-section h2 {
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 800;
      color: #B07820;
    }
    .retro-section h3, .retro-section h4 {
      font-weight: 800;
      color: #173528;
      letter-spacing: -.015em;
    }
    .retro-section p {
      line-height: 1.72;
    }
    .retro-section .backdrop-blur, .retro-section [class*="backdrop-blur"] {
      background-color: rgba(23,53,40,.72) !important;
      backdrop-filter: blur(18px) saturate(125%);
      -webkit-backdrop-filter: blur(18px) saturate(125%);
      border-color: rgba(184,216,90,.38) !important;
      box-shadow: 0 14px 40px rgba(8,25,17,.24), inset 0 1px 0 rgba(255,248,223,.10);
    }
    .retro-section .retro-panel [class*="backdrop-blur"] {
      background-color: rgba(247,240,208,.78) !important;
      border-color: rgba(23,53,40,.20) !important;
      color: #173528;
    }
  `;

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
  const villagesData = content.villages_section || {};
  const cultureData = content.culture_section || {};

  return (
     <>
        <style>{retroStyles}</style>
    <div className="min-h-screen bg-[#173528] text-[#B07820]">
      <main>
        <Hero data={heroData} />
        <Community data={communityData} />
        <Villages data={villagesData} />
        <Culture data={cultureData} />
        <MapSection />
      </main>
    </div>
      </>
  );
}