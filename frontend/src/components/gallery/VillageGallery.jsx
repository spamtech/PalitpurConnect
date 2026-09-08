
import {
  ArrowRight,
  Camera,
  MapPin,
  Sparkles,
} from "lucide-react";

const galleryItems = [
  {
    title: "Palitpur Village",
    location: "Palitpur, Birbhum",
    description:
      "Explore the everyday landscape and community life of Palitpur.",
    className:
      "from-emerald-950 via-emerald-800 to-teal-700",
  },
  {
    title: "Village Life",
    location: "Palitpur",
    description:
      "A glimpse into the peaceful rhythm of local village life.",
    className:
      "from-slate-900 via-slate-700 to-emerald-800",
  },
  {
    title: "Local Community",
    location: "Palitpur",
    description:
      "Discover the people, places, and stories that shape the community.",
    className:
      "from-teal-950 via-teal-800 to-slate-800",
  },
];

export default function VillageGallery() {
  return (
    <section
      id="gallery"
      className="w-full bg-slate-50 py-20 sm:py-24"
    >
      <div className="page-x">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <Camera className="h-4 w-4" />
              Discover Palitpur
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              A closer look at
              <span className="block text-emerald-600">
                village life.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore Palitpur through its people, places,
              community, and everyday life.
            </p>
          </div>

          <button
            type="button"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-700 transition hover:text-emerald-600 lg:self-auto"
          >
            View village stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Gallery */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.className} shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative min-h-[360px] p-6 sm:p-8">
                {/* Decorative background */}
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

                {/* Placeholder visual */}
                <div className="relative flex h-52 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="text-center text-white/70">
                    <Sparkles className="mx-auto mb-3 h-8 w-8" />
                    <p className="text-sm">
                      Village photo coming soon
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/70">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            More stories coming soon.
          </span>{" "}
          The village gallery will be expanded with real photographs
          and community stories in the final design stage.
        </div>
      </div>
    </section>
  );
}

