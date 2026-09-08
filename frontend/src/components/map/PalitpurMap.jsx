
import {
  ExternalLink,
  MapPin,
  Navigation,
} from "lucide-react";

const mapQuery =
  "Palitpur,Birbhum,West+Bengal,713147,India";

export default function PalitpurMap() {
  return (
    <section
      id="map"
      className="w-full bg-slate-50 py-20 sm:py-24"
    >
      <div className="page-x">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Navigation className="h-4 w-4" />
            Palitpur Map
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Find your way around
            <span className="block text-emerald-600">
              Palitpur.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Explore Palitpur, Birbhum, West Bengal and discover
            the surrounding local areas.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Map */}
          <div className="h-[420px] w-full sm:h-[500px]">
            <iframe
              title="Palitpur, Birbhum geographical map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Bottom information */}
          <div className="grid gap-6 border-t border-slate-200 p-6 sm:p-8 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Location
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Palitpur, Birbhum,
                  <br />
                  West Bengal – 713147
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Navigation className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Local Areas
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Palitpur Main
                  <br />
                  Amtola Para • Uttar Pally
                </p>
              </div>
            </div>

            <div>
              <a
                href={`https://maps.google.com/?q=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

