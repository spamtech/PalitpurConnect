import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
  Wheat,
  Sprout,
  FileText,
  Building2,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import { Badge, Button, Card } from "../../components/ui";
import { api } from "../../services/api";

/* --------------------------------
    Hero Metrics Component
--------------------------------- */
function HeroMetrics() {
  const metrics = [
    {
      value: "২৪/৭",
      label: "পোর্টাল অ্যাক্সেস",
      description: "যেকোনো সময় পরিষেবা উপলব্ধ",
      icon: Clock3,
    },
    {
      value: "১০০%",
      label: "নাগরিক কেন্দ্রীক",
      description: "স্থানীয় চাহিদার কথা মাথায় রেখে তৈরি",
      icon: Users,
    },
    {
      value: "<২৪ ঘণ্টা",
      label: "সমস্যার প্রতিক্রিয়া",
      description: "স্বীকৃতি দেওয়ার নির্ধারিত সময়",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-[20px] border-[2px] border-[#0c2218] bg-[#f7f0d0] p-4 shadow-[4px_4px_0_#0c2218] transition duration-300 hover:-translate-y-1 hover:bg-[#b8d85a] hover:shadow-[6px_6px_0_#0c2218]"
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                <p className="text-2xl font-black tracking-tight text-[#173528]">
                  {metric.value}
                </p>

                <p className="mt-1 text-sm font-black text-[#173528]">
                  {metric.label}
                </p>

                <p className="mt-1 text-xs leading-5 font-semibold text-[#42604e]">
                  {metric.description}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218] transition group-hover:bg-[#e6ad45]">
                <Icon size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------
    Live Activity Component (Backend Synced)
--------------------------------- */
function LiveActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadRecentActivity() {
      try {
        setLoading(true);
        const response = await api.getAnnouncements();
        const items = response?.data?.announcements || response?.data || [];
        
        if (mounted) {
          const formatted = items.slice(0, 4).map((item, index) => ({
            id: item.id || index,
            title: item.title || "গ্রামের আপডেট",
            description: item.description || "নতুন অফিসিয়াল বিজ্ঞপ্তি প্রকাশিত হয়েছে।",
            time: item.published_at || item.created_at ? new Date(item.published_at || item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "ਸমাত্র",
            icon: Megaphone,
            status: item.category === "emergency" ? "নতুন" : "সক্রিয়",
          }));

          if (formatted.length === 0) {
            setActivities([
              { id: 1, title: "গ্রামসভা নোটিশ", description: "বাসিন্দাদের জন্য পঞ্চায়েত সভার সময় নির্ধারিত হয়েছে।", time: "এই মাত্র", icon: Megaphone, status: "নতুন" },
              { id: 2, title: "জল সরবরাহ রক্ষণাবেক্ষণ", description: "পাইপলাইন মেরামতের কাজ সফলভাবে সম্পন্ন হয়েছে।", time: "১ ঘণ্টা আগে", icon: CheckCircle2, status: "সমাধান হয়েছে" },
            ]);
          } else {
            setActivities(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to load live activity:", err);
        if (mounted) {
          setActivities([
            { id: 1, title: "পঞ্চায়েত সম্প্রচার", description: "সিস্টেম চালু আছে এবং সংযুক্ত রয়েছে।", time: "সক্রিয়", icon: Activity, status: "লাইভ" }
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRecentActivity();
    return () => { mounted = false; };
  }, []);

  return (
    <Card className="relative overflow-hidden rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-0 shadow-[10px_10px_0_rgba(12,34,24,0.3)] text-[#173528]">
      <div className="h-2 w-full bg-[#0c2218]" />

      {/* Header */}
      <div className="border-b-[3px] border-[#0c2218] px-5 py-5 sm:px-6 bg-[#2d684d] text-[#f7f0d0]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8d85a] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#b8d85a]" />
              </span>

              <span className="text-sm font-black text-[#f7f0d0] tracking-wide uppercase">
                লাইভ গ্রামের কার্যকলাপ ও ফসল
              </span>
            </div>

            <p className="mt-1 text-xs text-[#dfe8c4] font-semibold">
              পালিতপুর থেকে সর্বশেষ আপডেট এবং কমিউনিটি বিজ্ঞপ্তি
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218]">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y-2 divide-[#0c2218]/15 min-h-[220px]">
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#2d684d]" />
          </div>
        ) : activities.length === 0 ? (
          <div className="px-6 py-10 text-center text-xs font-bold text-[#42604e]">
            কোনো সাম্প্রতিক কার্যকলাপ বিজ্ঞপ্তি পাওয়া যায়নি।
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="group px-5 py-4 transition duration-300 hover:bg-[#b8d85a]/25 sm:px-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[3px_3px_0_#0c2218] transition group-hover:bg-[#e6ad45]">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-black text-[#173528] truncate max-w-[200px]">
                        {activity.title}
                      </h3>

                      <span
                        className={`rounded-xl px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-2 border-[#0c2218] shadow-[2px_2px_0_#0c2218] ${
                          activity.status === "সমাধান হয়েছে"
                            ? "bg-[#b8d85a] text-[#173528]"
                            : activity.status === "নতুন"
                            ? "bg-[#e6ad45] text-[#173528]"
                            : "bg-[#2d684d] text-[#f7f0d0]"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed font-medium text-[#42604e] line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#58705e]">
                      <Clock3 size={12} className="text-[#b07820]" />
                      {activity.time}
                    </div>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="mt-1 hidden shrink-0 text-[#173528] transition group-hover:translate-x-0.5 sm:block"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t-[3px] border-[#0c2218] bg-[#173528] px-5 py-3.5 sm:px-6 text-[#f7f0d0]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8d85a] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#b8d85a]" />
            </span>

            <span className="text-xs font-black">
              সিস্টেম সচল ও লাইভ সিঙ্ক সক্রিয় রয়েছে
            </span>
          </div>

          <span className="text-xs font-black text-[#e6ad45] flex items-center gap-1">
            <Sparkles size={12} /> লাইভ ডিবি
          </span>
        </div>
      </div>
    </Card>
  );
}

/* --------------------------------
    Main Citizen Dashboard Component
--------------------------------- */
export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30; // 30px max movement
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToGrievance = () => {
    const element = document.getElementById("grievance");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/dashboard/grievances");
    }
  };

  const scrollToAnnouncements = () => {
    const element = document.getElementById("announcements");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/dashboard/announcements");
    }
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#173528] text-[#f7f0d0] min-h-screen pb-16 pt-24"
    >
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Floating Cultural & Sacred Badges moving with mouse */}
      <div
        style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}
        className="absolute top-28 left-8 hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] z-20 transition-transform duration-150 ease-out"
      >
        <span className="text-[#b07820] font-black text-sm">卐</span>
        <span className="text-xs font-black tracking-wide">শুভ লাভ</span>
      </div>

      <div
        style={{ transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)` }}
        className="absolute top-48 right-10 hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] z-20 transition-transform duration-150 ease-out"
      >
        <span className="text-[#e6ad45] font-black text-base">ॐ</span>
        <span className="text-xs font-black tracking-wide">ওম শান্তি</span>
      </div>

      <div
        style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        className="absolute bottom-28 left-12 hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] z-20 transition-transform duration-150 ease-out"
      >
        <Wheat size={18} className="text-[#b07820]" strokeWidth={2.5} />
        <span className="text-xs font-black tracking-wide">সোনালী ফসল</span>
      </div>

      <div
        style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)` }}
        className="absolute bottom-20 right-14 hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] text-[#173528] shadow-[4px_4px_0_#0c2218] z-20 transition-transform duration-150 ease-out"
      >
        <Sprout size={18} className="text-[#2d684d]" strokeWidth={2.5} />
        <span className="text-xs font-black tracking-wide">ধান ও ফসল</span>
      </div>

      <div className="px-6 pb-20 pt-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">

            {/* LEFT SIDE */}
            <div className="lg:col-span-7">

              <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-4 py-1.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] uppercase tracking-wider">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8d85a] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2d684d]" />
                </span>
                <span>পালিতপুর গ্রাম</span>
                <span className="text-[#b07820]">•</span>
                <span>ডিজিটাল নাগরিক পোর্টাল</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[#f7f0d0] sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
                একটি স্মার্ট গ্রাম,
                <span className="block text-[#b8d85a] mt-1">
                  সবার সাথে সংযুক্ত।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#dfe8c4] sm:text-lg font-medium">
                পালিতপুরকানেক্ট স্থানীয় সরকারের পরিষেবা, ঘোষণা, পাবলিক ডিরেক্টরি, জরুরি যোগাযোগ এবং নাগরিকের অভিযোগগুলিকে আশীর্বাদপুষ্ট কমিউনিটি হারমনি এবং কৃষি সমৃদ্ধির অধীনে একটি প্রাণবন্ত ডিজিটাল প্ল্যাটফর্মে একত্রিত করে।
              </p>

              {/* Trust Points */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-[#173528]">
                    <CheckCircle2 size={17} strokeWidth={2.5} />
                  </span>
                  পঞ্চায়েত যাচাইকৃত তথ্য
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-[#173528]">
                    <ShieldCheck size={17} strokeWidth={2.5} />
                  </span>
                  নাগরিক-কেন্দ্রিক পরিষেবা
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-[#173528]">
                    <Sparkles size={17} strokeWidth={2.5} />
                  </span>
                  সহজ ডিজিটাল অ্যাক্সেস
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[#f7f0d0] bg-[#2d684d] p-3.5 rounded-2xl border-[2px] border-[#0c2218] shadow-[4px_4px_0_#0c2218]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#173528] bg-[#b8d85a] text-[#173528]">
                    <CheckCircle2 size={17} strokeWidth={2.5} />
                  </span>
                  ২৪/৭ উপলব্ধ
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={scrollToGrievance}
                  className="rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-6 py-3.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
                >
                  একটি সমস্যা রিপোর্ট করুন
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={scrollToAnnouncements}
                  className="rounded-2xl border-[2px] border-[#0c2218] bg-[#f7f0d0] px-6 py-3.5 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#b8d85a] hover:shadow-[5px_5px_0_#0c2218]"
                >
                  ঘোষণা দেখুন
                </Button>
              </div>

              {/* Metrics */}
              <HeroMetrics />
            </div>

            {/* RIGHT SIDE */}
            <div className="relative lg:col-span-5">
              <LiveActivity />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}