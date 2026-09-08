import React from 'react';
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
  Sprout,
  Wheat,
  Flame,
} from "lucide-react";

import { Badge, Button, Card } from "../ui";

/* --------------------------------
   Hero Metrics
--------------------------------- */

const metrics = [
  {
    value: "24/7",
    label: "Portal Access",
    description: "Services available anytime",
    icon: Clock3,
  },
  {
    value: "100%",
    label: "Citizen Focused",
    description: "Designed around local needs",
    icon: Users,
  },
  {
    value: "<24h",
    label: "Issue Response",
    description: "Target acknowledgement time",
    icon: ShieldCheck,
  },
];

/* --------------------------------
   Live Activity
--------------------------------- */

const activities = [
  {
    id: 1,
    title: "New Panchayat Notice",
    description: "Gram Sabha meeting scheduled for residents.",
    time: "12 min ago",
    icon: Megaphone,
    status: "New",
  },
  {
    id: 2,
    title: "Water Supply Update",
    description: "Maintenance work completed in the main area.",
    time: "42 min ago",
    icon: CheckCircle2,
    status: "Resolved",
  },
  {
    id: 3,
    title: "Health Camp",
    description: "Free health screening camp announced.",
    time: "2 hrs ago",
    icon: Activity,
    status: "Upcoming",
  },
];

/* --------------------------------
   Hero Metrics Component
--------------------------------- */

function HeroMetrics() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white/90 via-emerald-50/30 to-amber-50/30 p-4 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl"
          >
            <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-400/10 blur-xl transition-all group-hover:bg-amber-400/20" />
            
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                <p className="text-2xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-emerald-950 bg-clip-text text-transparent">
                  {metric.value}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {metric.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {metric.description}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/20 transition group-hover:scale-110 group-hover:from-amber-500 group-hover:to-amber-700">
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------
   Live Activity Component
--------------------------------- */

function LiveActivity() {
  return (
    <Card className="relative overflow-hidden border-amber-200/60 bg-white/90 p-0 shadow-2xl shadow-emerald-950/10 backdrop-blur-2xl">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500" />

      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6 bg-gradient-to-r from-emerald-900/5 via-amber-500/5 to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>

              <span className="text-sm font-bold text-slate-900 tracking-wide">
                Live Village Activity & Harvest
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 font-medium">
              Latest updates & community notices from Palitpur
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="group px-5 py-5 transition duration-300 hover:bg-emerald-50/50 sm:px-6"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-gradient-to-tr group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white group-hover:shadow-md">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {activity.title}
                    </h3>

                    <Badge
                      variant={
                        activity.status === "Resolved"
                          ? "success"
                          : activity.status === "New"
                            ? "info"
                            : "warning"
                      }
                      size="sm"
                    >
                      {activity.status}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {activity.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock3 size={13} className="text-amber-500" />
                    {activity.time}
                  </div>
                </div>

                <ArrowUpRight
                  size={17}
                  className="mt-1 hidden shrink-0 text-slate-300 transition group-hover:text-amber-600 sm:block"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />

            <span className="text-xs font-bold text-slate-700">
              Systems operational & crops thriving
            </span>
          </div>

          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Sparkles size={12} /> Updated just now
          </span>
        </div>
      </div>
    </Card>
  );
}

/* --------------------------------
   Main Hero Component
--------------------------------- */

export default function Hero() {
  const scrollToGrievance = () => {
    document
      .getElementById("grievance")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAnnouncements = () => {
    document
      .getElementById("announcements")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/30"
    >
      {/* Floating Cultural & Sacred Floating Badges (Swastik, Om, Crop Wheat/Paddy icons) */}
      <div className="absolute top-24 left-8 hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-amber-300 shadow-xl backdrop-blur-md animate-bounce duration-1000 z-20">
        <span className="text-amber-600 font-extrabold text-sm">卐</span>
        <span className="text-xs font-bold text-slate-800 tracking-wide">Shubh Labh</span>
      </div>

      <div className="absolute top-44 right-10 hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-orange-300 shadow-xl backdrop-blur-md animate-pulse z-20">
        <span className="text-orange-600 font-extrabold text-base">ॐ</span>
        <span className="text-xs font-bold text-slate-800 tracking-wide">Om Shanti</span>
      </div>

      <div className="absolute bottom-28 left-12 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-300 shadow-lg backdrop-blur-md z-20">
        <Wheat size={18} className="text-amber-600" />
        <span className="text-xs font-bold text-slate-800 tracking-wide">Golden Harvest</span>
      </div>

      <div className="absolute bottom-20 right-14 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-300 shadow-lg backdrop-blur-md z-20">
        <Sprout size={18} className="text-emerald-600 animate-pulse" />
        <span className="text-xs font-bold text-slate-800 tracking-wide">Paddy & Crops</span>
      </div>

      {/* Ambient Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-200/40 via-emerald-200/50 to-transparent blur-3xl animate-pulse" />

        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-teal-200/50 via-emerald-100/60 to-amber-100/30 blur-3xl" />

        <div className="absolute bottom-[-20%] left-[30%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-amber-100/60 to-green-50 blur-3xl" />
      </div>

      {/* Grid Background Pattern */}
      <div
        aria-hidden="true"
        className="radial-grid pointer-events-none absolute inset-0 -z-10 opacity-70"
      />

      <div className="px-6 pb-20 pt-32 sm:px-12 sm:pb-24 lg:px-16 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">

            {/* LEFT SIDE */}
            <div className="lg:col-span-7">

              <Badge variant="success" className="mb-6 px-4 py-1.5 shadow-sm border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-amber-50">
                <span className="mr-2 inline-block h-2.5 w-2.5 animate-ping rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
                <span className="font-bold text-emerald-900">Palitpur Gram </span> 
                <span className="mx-1.5 text-amber-600 font-bold">•</span> 
                <span className="text-slate-700 font-medium">Digital Civic Portal</span>
              </Badge>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
                A Smarter Village,
                <span className="block bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 bg-clip-text text-transparent mt-1">
                  connected to everyone.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg font-normal">
                PalitpurConnect brings local government services,
                announcements, public directories, emergency contacts
                and citizen grievances together in one vibrant digital
                platform under blessed community harmony and agricultural prosperity.
              </p>

              {/* Trust Points */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-white/60 p-3 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-xs">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
                    <CheckCircle2 size={17} />
                  </span>
                  Panchayat verified information
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-white/60 p-3 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-xs">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 shadow-inner">
                    <ShieldCheck size={17} />
                  </span>
                  Citizen-first services
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-white/60 p-3 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-xs">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
                    <Sparkles size={17} />
                  </span>
                  Simple digital access
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-white/60 p-3 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-xs">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
                    <CheckCircle2 size={17} />
                  </span>
                  Available 24/7
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={scrollToGrievance}
                  className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  Report an Issue
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={scrollToAnnouncements}
                  className="border-2 border-amber-300/80 bg-white hover:bg-amber-50 text-slate-800 font-bold shadow-sm transition-all duration-300"
                >
                  View Announcements
                </Button>
              </div>

              {/* Metrics */}
              <HeroMetrics />
            </div>

            {/* RIGHT SIDE */}
            <div className="relative lg:col-span-5">

              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-amber-300/40 via-emerald-300/40 to-teal-300/30 blur-3xl animate-pulse"
              />

              <LiveActivity />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}