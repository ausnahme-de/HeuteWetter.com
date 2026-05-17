# ⛅ Heute Wetter



---

## Architecture Summary

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR + ISR for SEO; server components for speed |
| Styling | **Pure CSS (design tokens)** | Zero-dependency, fast, maintainable |
| Data | **Open-Meteo** | Free, no key, European servers, GDPR-friendly |
| Deploy | **Vercel** | Ideal for Next.js; edge functions; automatic ISR |
| Fonts | **Sora + DM Sans** | Premium feel, German-market appropriate |

**Data flow:**
1. User visits `/wetter/berlin`
2. Next.js SSR fetches Open-Meteo at build or ISR cycle (every 30 min)
3. Fully rendered HTML delivered — zero JS needed for initial paint
4. Client JS only for: search (Nav), theme toggle

---

## File Tree

```
heute-wetter/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── weather/
│   │   │       └── route.ts          ← Geocoding proxy (edge)
│   │   ├── wetter/
│   │   │   └── [city]/
│   │   │       └── page.tsx          ← Dynamic city pages
│   │   ├── layout.tsx                ← Root layout + SEO defaults
│   │   ├── not-found.tsx             ← 404 page
│   │   ├── page.tsx                  ← Homepage (Berlin default)
│   │   ├── robots.ts                 ← robots.txt generation
│   │   └── sitemap.ts                ← sitemap.xml generation
│   ├── components/
│   │   ├── DailyForecast.tsx         ← 7-day forecast strip
│   │   ├── Footer.tsx                ← Footer with city links
│   │   ├── HourlyForecast.tsx        ← Hourly scroll strip
│   │   ├── Nav.tsx                   ← Nav + search + theme toggle
│   │   ├── ThemeScript.tsx           ← Anti-FOUC theme injection
│   │   ├── WeatherDetails.tsx        ← Detail cards grid
│   │   └── WeatherHero.tsx           ← Hero with current conditions
│   ├── lib/
│   │   ├── cities.ts                 ← City registry + metadata
│   │   └── weather.ts                ← Open-Meteo integration
│   └── styles/
│       └── globals.css               ← Full design system
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tsconfig.json
└── vercel.json
```

---

## Setup Instructions

### Requirements
- Node.js 18+ 
- npm 9+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open http://localhost:3000
```

That's it. No environment variables, no API keys. Open-Meteo is free and open.

---

## Vercel Deployment

### Option A — CLI (fastest)
```bash
npm install -g vercel
vercel deploy
```
Follow prompts. Vercel auto-detects Next.js. Done.

### Option B — GitHub (recommended for production)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository
3. Select your repo → Vercel auto-detects Next.js settings
4. Click **Deploy**

### Custom domain
In Vercel → Project → Settings → Domains → Add `heute-wetter.de`

Update your DNS:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

---

## Open-Meteo Integration — Where to Find It

**Main fetch function:** `src/lib/weather.ts` — `fetchWeather(lat, lon, timezone)`

To add more weather variables (e.g. pollen, air quality):
1. Find the `current:` URLSearchParams array in `weather.ts`
2. Add the variable name from [Open-Meteo docs](https://open-meteo.com/en/docs)
3. Parse it from `raw.current` in the same function
4. Add it to the `CurrentWeather` interface at the top

To change revalidation interval (default 30 min):
- In `src/app/page.tsx` and `src/app/wetter/[city]/page.tsx`
- Change: `export const revalidate = 1800;` (seconds)

---

## Adding More Cities

In `src/lib/cities.ts`, add a new entry to the `CITIES` array:

```ts
{
  slug: 'freiburg',
  name: 'Freiburg',
  nameGenitive: 'Freiburgs',
  state: 'Baden-Württemberg',
  lat: 47.9990,
  lon: 7.8421,
  timezone: 'Europe/Berlin',
  population: 230000,
  description: 'Wetter Freiburg im Breisgau – Vorhersage für die sonnigste Stadt Deutschlands.',
  localFact: 'Freiburg gilt als sonnigste Stadt Deutschlands mit über 1.800 Sonnenstunden jährlich.',
}
```

The city page at `/wetter/freiburg` is automatically:
- Statically generated at build time
- Included in sitemap.xml
- Linked from other city pages
- SEO-optimized with unique meta

---

## SEO Architecture

### Why this ranks:
- **ISR**: Pages are pre-rendered HTML — Googlebot sees full content instantly
- **Unique metadata**: Every city has distinct title, description, H1, and local content
- **Internal linking**: Every city page links to 10 others → distributes link equity
- **Schema markup**: WebPage + BreadcrumbList + SearchAction on homepage
- **Canonical tags**: Prevents duplicate content issues
- **Sitemap**: Auto-generated with `changeFrequency: 'hourly'` signals
- **robots.txt**: Allows all crawling except /api/
- **Fast TTFB**: Server rendering means no JS-rendered content issues

### Target keywords per city:
- "Wetter [Stadt]" — primary
- "Wetter [Stadt] heute" — secondary
- "Wetter [Stadt] morgen" — secondary
- "[Stadt] Wettervorhersage 7 Tage" — long-tail
- "Temperatur [Stadt] aktuell" — long-tail

### Scaling to 1000+ cities:
1. Create a database (Supabase, PlanetScale, or a JSON file) with all German municipalities
2. Change `generateStaticParams` to read from DB
3. Add `dynamicParams = true` to the city page for on-demand ISR
4. Unknown cities will be generated on first request and cached

---

## Launch Checklist

**Technical:**
- [ ] `npm run build` completes without errors
- [ ] Deployed on Vercel
- [ ] Custom domain configured with SSL
- [ ] Test `/wetter/berlin`, `/wetter/hamburg`, `/wetter/muenchen` on mobile
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, SEO, Best Practices
- [ ] Test dark/light mode toggle
- [ ] Test city search (type "Mün", "Kö", "Ham")
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Test 404 page

**SEO:**
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Verify no indexing errors in Search Console
- [ ] Add Google Analytics or Plausible
- [ ] Set up uptime monitoring (UptimeRobot free tier)

**Content:**
- [ ] Add `og-default.png` (1200×630) to `/public/` for social sharing
- [ ] Add `apple-touch-icon.png` (180×180) to `/public/`
- [ ] Review `localFact` for each city for accuracy

---

## Next Improvements After Launch

### Month 1
1. **Add more cities** — expand from 12 to 100+ German cities using official municipality data
2. **Weather map** — embed a Windy.com iframe or OpenLayers map for visual appeal
3. **PWA support** — add service worker + manifest for "Add to Home Screen"
4. **Analytics** — add Plausible (privacy-friendly, GDPR-compliant) for German audience

### Month 2-3
5. **Pollen forecast** — German pollen season is a major search category; integrate DWD pollen API
6. **Weather alerts** — integrate Deutscher Wetterdienst (DWD) warning API (free, official)
7. **Rain radar widget** — embed RainViewer or Meteoblue radar iframe
8. **Hourly temperature chart** — add a simple SVG line chart (no library needed)

### Month 4+
9. **Location-based PWA** — geolocation API on client side for instant local weather
10. **AMP pages** — optional AMP versions for Google's Top Stories carousel in German search

---

## 10 Monetization & Growth Ideas

1. **Display advertising** (Google AdSense / Ezoic) — weather sites are top-tier inventory. Target CPMs of €3-12 in the German market.

2. **Weather widget API** — offer an embeddable widget for German blogs and local newspapers for a monthly license fee.

3. **Premium plan** — €1.99/month for: extended 14-day forecast, no ads, push notifications, CSV export.

4. **Local service integrations** — partner with gardening centers, outdoor sports brands, travel agencies for contextual CTA banners ("Heute Regen in Berlin? Buche ein Indoor-Kino").

5. **Affiliate — outdoor gear** — contextual product recommendations. When UV is high: sunscreen from dm/Rossmann. When raining: umbrellas from Amazon.de.

6. **Regional business ads** — sell direct ad placements to regional businesses (e.g. "Café in Hamburg: Komm rein wenn's regnet").

7. **Email newsletter** — weekly regional weather digest with a curated local events section. Monetize with local sponsors.

8. **B2B weather API** — wrap Open-Meteo and resell to German SMBs (construction, logistics, events) as a simple API with a German dashboard.

9. **SEO content expansion** — publish city weather guides ("Wann ist das beste Reisewetter in Bayern?") targeting informational keywords with affiliate links to booking.com / HRS.

10. **White-label for municipalities** — license the platform to German city governments for their own branded weather pages.
