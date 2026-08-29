import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Wifi,
  Tv,
  Snowflake,
  Car,
  Refrigerator,
  DoorOpen,
  ShieldCheck,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Copy,
  Check,
  X,
} from "lucide-react";

const IMG_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/site-images`;
const logo = { url: `${IMG_BASE}/logo.jpg` };
const gateDay = { url: `${IMG_BASE}/gate-day.jpg` };
const entranceWifi = { url: `${IMG_BASE}/entrance-wifi.jpg` };
const courtyardNight = { url: `${IMG_BASE}/courtyard-night.jpg` };
const roomPurple = { url: `${IMG_BASE}/room-purple.jpg` };
const roomAircon = { url: `${IMG_BASE}/room-aircon.jpg` };
const roomBlue = { url: `${IMG_BASE}/room-blue.jpg` };
const roomSlate = { url: `${IMG_BASE}/room-slate.jpg` };

const LAT = -25.530889;
const LNG = 31.315694;
const COORDS = "25°31'51.2\"S 31°18'56.5\"E";
const WHATSAPP = "27791280801";
const PHONE_1 = "079 128 0801";
const PHONE_2 = "072 095 1779";
const ADDRESS = "Matsulu Youth Centre, Matsulu 1203, Nelspruit, Mpumalanga";

const TITLE = "Urban Field Guest House | 24-Hour Rooms in Matsulu, Nelspruit";
const DESCRIPTION =
  "Urban Field Guest House in Matsulu, Nelspruit. Clean en-suite rooms with free WiFi, DSTV and air-con. Hourly from R100, day/night R350. Open 24 hours.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const roomRates = [
  { label: "1 hour", price: "R100" },
  { label: "2 hours", price: "R150" },
  { label: "3 hours", price: "R200" },
  { label: "Day or night", price: "R350" },
];

const amenities = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Tv, label: "DSTV" },
  { icon: Snowflake, label: "Air conditioning" },
  { icon: Refrigerator, label: "Bar fridge" },
  { icon: Car, label: "Secure parking" },
  { icon: DoorOpen, label: "Private entrances" },
  { icon: ShieldCheck, label: "Gated & walled" },
  { icon: Clock, label: "Open 24 hours" },
];

const roomPairs = [
  {
    images: [
      { src: roomBlue.url, alt: "Guest room with double bed, wooden slat feature wall and wall-mounted TV" },
      { src: roomSlate.url, alt: "Guest room with black slat headboard wall, bedside tables and flat-screen TV" },
    ],
    caption: "Every room is private and en-suite, with a comfortable double bed, fresh linen and a flat-screen TV with DSTV.",
  },
  {
    images: [
      { src: roomPurple.url, alt: "Guest room with purple bedding, air conditioner and window blinds" },
      { src: roomAircon.url, alt: "Guest room interior showing air conditioner, bar fridge and private door" },
    ],
    caption: "Air conditioning, a bar fridge and your own private entrance — everything you need for a short rest or a full night.",
  },
];

const placeSlides = [
  {
    src: gateDay.url,
    alt: "Urban Field Guest House signage on the secure entrance gate during the day",
    caption: "A fully gated and walled entrance with secure parking inside the yard.",
  },
  {
    src: entranceWifi.url,
    alt: "Room entrance with free WiFi sign, DSTV dishes and air conditioning unit",
    caption: "Every room has its own private entrance, free WiFi, DSTV and air conditioning.",
  },
  {
    src: courtyardNight.url,
    alt: "Lit paved courtyard and room doors at Urban Field Guest House at night",
    caption: "The courtyard is lit up after dark and the gate never closes — arrive whenever suits you, we're open 24 hours.",
  },
];

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function Index() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "denied">("idle");
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openDirections = useCallback((from: { lat: number; lng: number } | null) => {
    const base = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}&travelmode=driving`;
    const url = from ? `${base}&origin=${from.lat},${from.lng}` : base;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleDirections = useCallback(() => {
    if (origin) {
      openDirections(origin);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      openDirections(null);
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const from = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(from);
        setGeoState("idle");
        openDirections(from);
      },
      () => {
        setGeoState("denied");
        openDirections(null);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, [origin, openDirections]);

  const distanceKm = origin ? haversine(origin.lat, origin.lng, LAT, LNG) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Urban Field Guest House",
    description: DESCRIPTION,
    telephone: "+27791280801",
    priceRange: "R100 - R3000",
    openingHours: "Mo-Su 00:00-23:59",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Matsulu Youth Centre",
      addressLocality: "Matsulu, Nelspruit",
      addressRegion: "Mpumalanga",
      postalCode: "1203",
      addressCountry: "ZA",
    },
    geo: { "@type": "GeoCoordinates", latitude: LAT, longitude: LNG },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        <img
          src={courtyardNight.url}
          alt="Urban Field Guest House courtyard lit up at night"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-24">
          <img
            src={logo.url}
            alt="Urban Field Guest House logo"
            className="mx-auto h-28 w-28 rounded-full border border-primary/40 object-cover sm:h-36 sm:w-36"
          />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/70 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-primary uppercase">
            <Clock className="h-3.5 w-3.5" /> Open 24 hours
          </p>
          <h1 className="mt-5 font-display text-4xl tracking-[0.08em] uppercase sm:text-6xl">
            Urban Field
            <span className="mt-2 block font-script text-4xl font-normal tracking-normal text-primary normal-case sm:text-5xl">
              Guest House
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Comfortable, private en-suite rooms in Matsulu, Nelspruit. Free WiFi, DSTV, air-con and
            secure parking — by the hour, by the night, or the whole place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={waLink("Hi Urban Field Guest House, I'd like to book a room.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
            <a
              href="tel:+27791280801"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              <Phone className="h-4 w-4" /> {PHONE_1}
            </a>
          </div>
        </div>
      </header>

      {/* The place — sideways carousel */}
      <section className="border-b border-border bg-card/40 py-16" id="place">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle eyebrow="Safe & private" title="The place" />
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A fully gated and walled property with secure parking, private room entrances and free
            WiFi throughout. Book the whole place, day or night, for R3000.
          </p>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
            {placeSlides.map((slide) => (
              <div key={slide.src} className="w-[82vw] max-w-md shrink-0 snap-center">
                <GalleryImage img={slide} onOpen={setLightbox} className="aspect-[4/3] w-full" />
                <p className="mt-3 text-sm text-muted-foreground">{slide.caption}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
            Swipe sideways for more
          </p>
        </div>
      </section>

      {/* Rooms */}
      <section className="mx-auto max-w-6xl px-5 py-16" id="rooms">
        <SectionTitle eyebrow="Gallery" title="Our rooms" />
        <div className="mt-8 space-y-10">
          {roomPairs.map((pair, i) => (
            <div key={i}>
              <div className="grid gap-4 sm:grid-cols-2">
                {pair.images.map((img) => (
                  <GalleryImage key={img.src} img={img} onOpen={setLightbox} className="aspect-[4/3]" />
                ))}
              </div>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                <span className="font-script text-2xl text-primary sm:text-3xl">Room {i + 1 === 1 ? "comfort" : "extras"}</span>
                <span className="mt-1 block">{pair.caption}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {roomRates.map((r) => (
                  <a
                    key={r.label}
                    href={waLink(`Hi Urban Field Guest House, I'd like to book a room: ${r.label} (${r.price}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
                  >
                    <span className="font-display text-sm text-primary">{r.price}</span>
                    <span className="text-muted-foreground">/ {r.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionTitle eyebrow="Comfort" title="What you get" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {amenities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center"
            >
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Find us */}
      <section className="border-t border-border bg-card/40 py-16" id="find-us">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle eyebrow="Navigation" title="Find us" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Map showing Urban Field Guest House location"
                src={`https://www.google.com/maps?q=${LAT},${LNG}&z=15&output=embed`}
                className="h-80 w-full lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {ADDRESS}
              </p>
              <p className="mt-4 font-mono text-sm text-foreground">{COORDS}</p>

              {distanceKm !== null && (
                <p className="mt-3 text-sm text-primary">
                  You are about {distanceKm.toFixed(1)} km away (straight line).
                </p>
              )}
              {geoState === "denied" && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Location access was blocked — we opened the map to the guest house instead.
                </p>
              )}

              <button
                type="button"
                onClick={handleDirections}
                disabled={geoState === "loading"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Navigation className="h-4 w-4" />
                {geoState === "loading" ? "Getting your location…" : "Directions from my location"}
              </button>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <MapPin className="h-4 w-4" /> Open in Maps
                </a>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`${LAT}, ${LNG}`).then(() => setCopied(true));
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy coordinates"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <img
            src={logo.url}
            alt="Urban Field Guest House logo"
            className="mx-auto h-16 w-16 rounded-full object-cover"
          />
          <p className="mt-4 text-sm font-semibold tracking-[0.3em] uppercase">Urban Field Guest House</p>
          <p className="mt-2 text-sm text-muted-foreground">{ADDRESS}</p>
          <p className="mt-2 text-sm text-muted-foreground">Open 24 hours, every day</p>
          <p className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="tel:+27791280801" className="text-primary hover:underline">
              {PHONE_1}
            </a>
            <a href="tel:+27720951779" className="text-primary hover:underline">
              {PHONE_2}
            </a>
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Urban Field Guest House
          </p>
        </div>
      </footer>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
          onClick={() => setLightbox(null)}
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 rounded-full border border-border bg-card p-2"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-script text-3xl text-primary sm:text-4xl">{eyebrow}</p>
      <h2 className="mt-1 font-display text-3xl tracking-wide uppercase sm:text-4xl">{title}</h2>
    </div>
  );
}

function GalleryImage({
  img,
  onOpen,
  className,
}: {
  img: { src: string; alt: string };
  onOpen: (img: { src: string; alt: string }) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(img)}
      className={`group overflow-hidden rounded-2xl border border-border ${className ?? ""}`}
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </button>
  );
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
