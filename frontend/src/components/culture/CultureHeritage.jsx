
import {
  ArrowUpRight,
  BookOpen,
  Heart,
  Landmark,
  Users,
} from "lucide-react";

const cultureItems = [
  {
    icon: Landmark,
    title: "Local Heritage",
    description:
      "Discover the places, traditions, and landmarks that form Palitpur's local identity.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Learn about the people and community activities that bring the village together.",
  },
  {
    icon: BookOpen,
    title: "Stories & Traditions",
    description:
      "Preserve and share stories, customs, and knowledge from one generation to the next.",
  },
];

export default function CultureHeritage() {
  return (
    <section
      id="culture"
      className="w-full bg-white py-20 sm:py-24"
    >
      <div className="page-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left */}
          <div className="lg:col-span-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <Heart className="h-4 w-4" />
              Culture & Heritage
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Preserving what makes
              <span className="block text-emerald-600">
                Palitpur unique.
              </span>
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
              Palitpur is more than a location on a map. Its identity
              comes from its people, history, community, traditions,
              and everyday experiences.
            </p>

            <button
              type="button"
              className="group mt-7 inline-flex items-center gap-2 font-semibold text-slate-900 transition hover:text-emerald-600"
            >
              Explore local heritage
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {cultureItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

