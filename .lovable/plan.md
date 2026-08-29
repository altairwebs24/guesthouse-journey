# Urban Field Guest House — Website

A single-page marketing site for Urban Field Guest House (Matsulu, Mpumalanga), with a photo gallery, pricing, and a "Get directions" navigation feature. No database — all bookings go through WhatsApp and phone.

## Content (extracted from the uploads)

- Name: Urban Field Guest House
- Phone: 079 128 0801 (WhatsApp) and 072 095 1779
- Location: Mpumalanga, Nelspruit, Matsulu Youth Centre, 1203
- Coordinates: 25°31'51.2"S 31°18'56.5"E (-25.530889, 31.315694)
- Open 24 hours
- Rates: R100 / 1 hour, R150 / 2 hours, R200 / 3 hours, R350 day or night, R3000 to book the whole place (day/night)
- Amenities visible in photos: free WiFi, DSTV, air conditioning, en-suite rooms, secure gated parking, bar fridge, private entrances, 24/7 access

## Sections

1. **Hero** — logo, name, "Open 24 hours" badge, Book on WhatsApp + Call buttons, night exterior photo backdrop.
2. **Rooms & gallery** — grid of the interior photos with lightbox; exterior photos in an "Our place" strip.
3. **Rates** — card list of the five price tiers, each with a WhatsApp booking button that pre-fills the chosen rate.
4. **Amenities** — icon grid.
5. **Find us / navigation** — embedded Google Map centred on the coordinates, plus:
   - "Get directions from my location" — asks the browser for geolocation and opens Google Maps turn-by-turn from the visitor's position to the guest house; falls back to a plain destination link if location is denied.
   - Shows straight-line distance once location is granted.
   - Copy-coordinates and open-in-Maps links.
6. **Footer** — contact numbers, address, hours.

## Design

Dark, neon-cyan direction matching the logo and the blue-lit property photos: near-black background, cyan accent, light text, wide-tracked uppercase headings. All colours as semantic tokens in `src/styles.css` (no hardcoded colour utilities).

## Technical notes

- Screenshots are used as information only and never displayed. Logo, exterior, and interior photos are uploaded via `lovable-assets` to the CDN and referenced by their public URLs, so they load correctly on any deployment including Cloudflare.
- Favicon generated from the logo into `public/`.
- Page built at `/` (replacing the placeholder index route) with its own `head()` — title, description, og/twitter tags, LodgingBusiness JSON-LD including geo coordinates and price range, single H1, alt text on every image.
- Google Maps embed uses the Google Maps connector browser key if connected; otherwise a keyless `https://www.google.com/maps?q=...&output=embed` iframe, which needs no credentials. Directions open via `https://www.google.com/maps/dir/?api=1&origin=<lat,lng>&destination=<coords>`.
- Global CSS rule to hide `#lovable-badge`.
- No backend, no Supabase tables, no auth — nothing to store. If you later want an enquiry form saved to a database, that's a follow-up.
