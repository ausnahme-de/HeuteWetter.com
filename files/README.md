# ⛅ HeuteWetter

A modern, SEO-optimised German weather website — built with pure HTML, CSS, and JavaScript. No build tools, no API keys, no backend. Just open the files and deploy.

**Live data powered by [Open-Meteo](https://open-meteo.com/) — 100% free, no registration required.**

---

## 📁 Project Structure

```
heute-wetter/
├── index.html      ← Main page (all content, SEO tags, structure)
├── style.css       ← All styles (dark UI, mobile-first, animations)
├── script.js       ← Weather logic (geocoding, API calls, rendering)
├── sitemap.xml     ← For Google & other search engines
├── robots.txt      ← Search engine crawl instructions
├── vercel.json     ← Vercel config (clean URLs + security headers)
└── README.md       ← This file
```

---

## ✨ Features

- **Current weather** — temperature, feels-like, humidity, wind speed, UV index, visibility
- **Hourly forecast** — scrollable 24-hour strip with rain probability
- **7-day forecast** — daily cards with high/low and precipitation
- **City search** — any German (or world) city via Open-Meteo Geocoding
- **Quick-select buttons** — Berlin, Hamburg, München, Frankfurt, Köln, Stuttgart
- **URL-based city pages** — `?city=Hamburg` works as a direct link
- **Clean URLs via Vercel** — `/wetter/berlin` rewrites to `?city=Berlin`
- **Dark premium UI** — glass-morphism accents, animated gradient orbs, smooth transitions
- **Mobile-first** — fully responsive from 320 px upward
- **SEO-ready** — semantic HTML, Open Graph tags, JSON-LD, sitemap, robots.txt

---

## 🚀 How to Deploy (Step by Step)

### Step 1 – Upload to GitHub

1. Go to [github.com](https://github.com) and create a free account (if you don't have one).
2. Click the **"+"** icon in the top-right corner → **"New repository"**.
3. Name it `heute-wetter` (or anything you like). Set it to **Public**. Click **"Create repository"**.
4. On the next screen, click **"uploading an existing file"**.
5. Drag and drop **all six project files** into the upload area:
   - `index.html`
   - `style.css`
   - `script.js`
   - `sitemap.xml`
   - `robots.txt`
   - `vercel.json`
6. Scroll down, write a commit message like `Initial upload`, and click **"Commit changes"**.

Your code is now safely stored on GitHub. ✅

---

### Step 2 – Deploy on Vercel (Free Hosting)

1. Go to [vercel.com](https://vercel.com) and sign up **with your GitHub account** — this links the two automatically.
2. Click **"Add New Project"**.
3. Find your `heute-wetter` repository in the list and click **"Import"**.
4. Vercel will detect it as a static site. You don't need to change any settings.
5. Click **"Deploy"**.

Within about 30 seconds, your site is live at a URL like:
`https://heute-wetter.vercel.app`

Every time you update a file on GitHub, Vercel redeploys automatically. ✅

---

### Step 3 – Connect a Custom Domain (Optional)

If you have a domain like `heute-wetter.de`:

1. In your Vercel project, go to **Settings → Domains**.
2. Type your domain and click **"Add"**.
3. Vercel shows you two DNS records. Log into your domain registrar (e.g. IONOS, Strato, Namecheap) and add those records in the DNS settings.
4. Wait 10–60 minutes for DNS to propagate. Vercel handles HTTPS automatically.

---

## ✏️ How to Edit the Website

All editing is done directly on GitHub — no special software needed.

### Changing the default city

Open `script.js`. Find this line near the top:

```js
defaultCity: "Berlin",
```

Change `"Berlin"` to any city you prefer, e.g. `"Hamburg"`.

### Adding a new city to the quick-select buttons

Open `index.html`. Find the `<div class="quick-cities">` block. Copy one of the existing `<button>` lines and change the city name:

```html
<button class="city-pill" data-city="Bochum" role="listitem">Bochum</button>
```

### Adding a new city page (clean URL)

Open `vercel.json`. Add a new line inside the `"rewrites"` array:

```json
{ "source": "/wetter/bochum", "destination": "/?city=Bochum" }
```

Then open `sitemap.xml` and add a new `<url>` block for that city.

### Changing the site colours

Open `style.css`. At the very top, find the `:root { }` block. The key variables are:

```css
--bg:       #0a0d14;   /* Page background */
--accent:   #4f8ef7;   /* Blue highlight colour */
--accent-2: #64c8ff;   /* Lighter blue accent */
```

Change those hex values to whatever colours you like. All colours in the site update automatically.

### Changing the SEO title and description

Open `index.html`. Find these lines near the top:

```html
<title>Heute Wetter – Aktuelles Wetter & 7-Tage-Vorhersage für Deutschland</title>
<meta name="description" content="…" />
```

Edit the text inside. Keep the description between 120–160 characters for best SEO results.

---

## 🔧 Technical Details

| Item | Detail |
|---|---|
| Weather API | [Open-Meteo](https://open-meteo.com/) — free, no API key |
| Geocoding API | Open-Meteo Geocoding — free, no API key |
| Fonts | Syne (display) + DM Sans (body) via Google Fonts |
| Framework | None — plain HTML/CSS/JS |
| Build tool | None |
| Hosting | Vercel (free tier) |
| Browser support | All modern browsers (Chrome, Firefox, Safari, Edge) |

---

## 📋 SEO Checklist

- [x] Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`)
- [x] Unique `<title>` and `<meta name="description">`
- [x] Open Graph tags for social sharing
- [x] Twitter Card meta tags
- [x] JSON-LD structured data (WebSite schema)
- [x] `sitemap.xml` with all city URLs
- [x] `robots.txt` allowing full crawl
- [x] Clean, keyword-rich URL structure (`?city=Berlin`)
- [x] Vercel rewrites for `/wetter/berlin` style paths
- [x] `<link rel="canonical">` tag
- [x] `aria-label` and `role` attributes for accessibility
- [x] Mobile-responsive layout (passes Google Mobile-Friendly Test)
- [x] Fast load time — no JavaScript frameworks, no large dependencies

---

## ❓ FAQ

**Does it work offline?**
No — it fetches live weather data from the Open-Meteo API. An internet connection is required.

**Is Open-Meteo really free?**
Yes. Open-Meteo is an open-source project with a free public API. No registration or credit card is needed. For very high traffic (millions of requests/month), they offer a commercial plan.

**Can I add more cities?**
Yes — any city in the world is supported by the geocoding API. Just type the name into the search box.

**Can I translate it to English?**
Yes — search `script.js` and `index.html` for German text strings and replace them. Most labels are in `WMO_CODES`, `DAYS_DE`, and `MONTHS_DE` in `script.js`.

---

## 📄 License

MIT — free to use, modify, and deploy commercially.

Data attribution: Weather data © [Open-Meteo](https://open-meteo.com/) contributors.
