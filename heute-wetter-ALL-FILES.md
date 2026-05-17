# heute-wetter — All Files in One

Deploy instructions at the bottom.

-----

## package.json

```json
{
  "name": "heute-wetter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "typescript": "^5"
  }
}
```

-----

## vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

-----

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/wetter/münchen', destination: '/wetter/muenchen', permanent: true },
      { source: '/wetter/koeln', destination: '/wetter/koeln', permanent: false },
      { source: '/wetter/frankfurt-am-main', destination: '/wetter/frankfurt', permanent: true },
    ];
  },
};

module.exports = nextConfig;
```

-----

## tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

-----

## .eslintrc.json

```json
{
  "extends": "next/core-web-vitals"
}
```

-----

## .gitignore

```
.next/
node_modules/
.env
.env.local
.env*.local
out/
*.log
.DS_Store
```

-----

## public/favicon.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <text y="26" font-size="28">⛅</text>
</svg>
```

-----

## src/styles/globals.css

```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

:root {
  --navy-950: #060c1a;
  --navy-900: #0d1b2e;
  --navy-800: #122540;
  --navy-700: #1a3356;
  --navy-600: #1f3f69;
  --navy-400: #3a6491;
  --navy-200: #7aaed4;
  --navy-100: #b8d4ec;
  --navy-50:  #e8f2f9;

  --amber-500: #f59e0b;
  --amber-400: #fbbf24;
  --amber-300: #fcd34d;
  --amber-100: #fef3c7;

  --sky-400: #38bdf8;
  --sky-300: #7dd3fc;
  --sky-200: #bae6fd;

  --green-400: #4ade80;
  --red-400:   #f87171;
  --purple-400: #c084fc;

  --bg:         var(--navy-950);
  --bg-card:    var(--navy-900);
  --bg-raised:  var(--navy-800);
  --border:     rgba(255,255,255,0.07);
  --border-hover: rgba(255,255,255,0.14);

  --text-primary: #f0f6fd;
  --text-secondary: #94afc8;
  --text-muted: #546a82;

  --accent: var(--amber-400);
  --accent-dim: var(--amber-100);

  --font-display: 'Sora', system-ui, sans-serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.35);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-glow-amber: 0 0 32px rgba(251,191,36,0.15);

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 150ms;
  --dur-mid: 280ms;
  --dur-slow: 500ms;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg:         #f0f6fd;
    --bg-card:    #ffffff;
    --bg-raised:  #e8f2f9;
    --border:     rgba(0,0,0,0.07);
    --border-hover: rgba(0,0,0,0.14);
    --text-primary: #0d1b2e;
    --text-secondary: #3a6491;
    --text-muted: #7aaed4;
  }
}

.dark {
  --bg:         var(--navy-950);
  --bg-card:    var(--navy-900);
  --bg-raised:  var(--navy-800);
  --border:     rgba(255,255,255,0.07);
  --border-hover: rgba(255,255,255,0.14);
  --text-primary: #f0f6fd;
  --text-secondary: #94afc8;
  --text-muted: #546a82;
}

.light {
  --bg:         #f0f6fd;
  --bg-card:    #ffffff;
  --bg-raised:  #e8f2f9;
  --border:     rgba(0,0,0,0.07);
  --border-hover: rgba(0,0,0,0.14);
  --text-primary: #0d1b2e;
  --text-secondary: #3a6491;
  --text-muted: #7aaed4;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100dvh;
  transition: background var(--dur-mid) var(--ease), color var(--dur-mid) var(--ease);
  -webkit-font-smoothing: antialiased;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button { cursor: pointer; font-family: inherit; }

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

.display-temp {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(4rem, 12vw, 7rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { padding: 0 var(--space-6); }
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: border-color var(--dur-fast) var(--ease),
              box-shadow var(--dur-fast) var(--ease);
}

.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}

.card-sm {
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(6, 12, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  transition: background var(--dur-mid) var(--ease);
}

.light .nav {
  background: rgba(240, 246, 253, 0.88);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  gap: var(--space-4);
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-logo span { color: var(--accent); }

.search-wrap {
  position: relative;
  flex: 1;
  max-width: 380px;
}

.search-input {
  width: 100%;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4) var(--space-2) 2.5rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--dur-fast) var(--ease),
              background var(--dur-fast) var(--ease);
}

.search-input::placeholder { color: var(--text-muted); }
.search-input:focus {
  border-color: var(--navy-400);
  background: var(--bg-card);
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  font-size: 0.9rem;
}

.search-results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  z-index: 200;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease);
  font-size: 0.9rem;
}

.search-result-item:hover,
.search-result-item:focus { background: var(--bg-raised); }

.search-result-item .city-name { font-weight: 500; color: var(--text-primary); }
.search-result-item .city-sub  { color: var(--text-muted); font-size: 0.8rem; }

.hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-12) 0 var(--space-10);
  background: linear-gradient(
    135deg,
    var(--navy-900) 0%,
    var(--navy-800) 50%,
    #0f2744 100%
  );
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--bg));
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: pulse-orb 8s ease-in-out infinite alternate;
}

@keyframes pulse-orb {
  from { transform: scale(1); opacity: 0.4; }
  to   { transform: scale(1.15); opacity: 0.6; }
}

.weather-icon-xl {
  font-size: clamp(3.5rem, 10vw, 6rem);
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

@media (min-width: 480px) {
  .meta-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .meta-grid { grid-template-columns: repeat(6, 1fr); }
}

.meta-item {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-3);
  text-align: center;
  transition: transform var(--dur-fast) var(--ease);
}

.meta-item:hover { transform: translateY(-2px); }

.meta-item .label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.meta-item .value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.meta-item .unit {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.hourly-scroll {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  scrollbar-width: thin;
  scrollbar-color: var(--navy-600) transparent;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.hourly-scroll::-webkit-scrollbar { height: 4px; }
.hourly-scroll::-webkit-scrollbar-track { background: transparent; }
.hourly-scroll::-webkit-scrollbar-thumb { background: var(--navy-600); border-radius: 4px; }

.hourly-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  text-align: center;
  min-width: 68px;
  transition: border-color var(--dur-fast) var(--ease),
              background var(--dur-fast) var(--ease);
}

.hourly-item.active {
  border-color: var(--accent);
  background: rgba(251, 191, 36, 0.05);
}

.hourly-item .h-time { font-size: 0.72rem; color: var(--text-muted); margin-bottom: var(--space-2); }
.hourly-item .h-icon { font-size: 1.4rem; margin-bottom: var(--space-1); }
.hourly-item .h-temp { font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; }
.hourly-item .h-rain { font-size: 0.72rem; color: var(--sky-300); margin-top: var(--space-1); }

.daily-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.daily-row {
  display: grid;
  grid-template-columns: 3rem 1.8rem 1fr auto;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--dur-fast) var(--ease);
}

.daily-row:hover { border-color: var(--border-hover); }

.daily-row .day-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.daily-row .day-icon { font-size: 1.3rem; }

.day-bar-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.day-bar-wrap .t-min { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }
.day-bar-wrap .t-max { font-size: 0.8rem; font-weight: 600; white-space: nowrap; }

.temp-bar {
  flex: 1;
  height: 4px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
  min-width: 40px;
}

.temp-bar-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--sky-400), var(--amber-400));
}

.daily-rain {
  font-size: 0.78rem;
  color: var(--sky-300);
  white-space: nowrap;
  text-align: right;
}

.sun-times {
  display: flex;
  gap: var(--space-6);
  align-items: center;
}

.sun-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sun-item .sun-icon { font-size: 1.2rem; }
.sun-item .sun-label { font-size: 0.75rem; color: var(--text-muted); }
.sun-item .sun-time { font-family: var(--font-display); font-weight: 600; font-size: 1rem; }

.section-title {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

.city-link-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.city-link-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: all var(--dur-fast) var(--ease);
}

.city-link-pill:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(251, 191, 36, 0.06);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all var(--dur-fast) var(--ease);
}

.btn-primary {
  background: var(--accent);
  color: var(--navy-950);
  border-color: var(--accent);
}
.btn-primary:hover { background: var(--amber-300); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border);
}
.btn-ghost:hover {
  background: var(--bg-raised);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: all var(--dur-fast) var(--ease);
  font-size: 1rem;
}
.theme-toggle:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
  background: var(--bg-card);
}

.footer {
  border-top: 1px solid var(--border);
  padding: var(--space-10) 0 var(--space-6);
  margin-top: var(--space-16);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
}

.footer-brand {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3);
}
.footer-brand span { color: var(--accent); }

.footer-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.7;
}

.footer-col-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-links a {
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease);
}
.footer-links a:hover { color: var(--text-primary); }

.footer-bottom {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: 0.78rem;
  color: var(--text-muted);
}

.footer-bottom a { color: var(--text-muted); text-decoration: underline; text-underline-offset: 3px; }
.footer-bottom a:hover { color: var(--text-secondary); }

.uv-bar {
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(90deg, #4ade80, #fbbf24, #f87171, #a855f7);
  position: relative;
  overflow: visible;
}

.uv-indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  border: 2px solid var(--navy-900);
  box-shadow: 0 0 6px rgba(0,0,0,0.4);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-raised) 25%,
    var(--bg-card) 50%,
    var(--bg-raised) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.fade-up {
  animation: fade-up var(--dur-slow) var(--ease) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up-delay-1 { animation-delay: 80ms; }
.fade-up-delay-2 { animation-delay: 160ms; }
.fade-up-delay-3 { animation-delay: 240ms; }
.fade-up-delay-4 { animation-delay: 320ms; }
.fade-up-delay-5 { animation-delay: 400ms; }

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

.text-accent { color: var(--accent); }
.text-muted  { color: var(--text-muted); }
.text-secondary { color: var(--text-secondary); }
.font-display { font-family: var(--font-display); }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }
.mb-10 { margin-bottom: var(--space-10); }
.mt-4 { margin-top: var(--space-4); }

.py-8  { padding-top: var(--space-8);  padding-bottom: var(--space-8); }
.py-10 { padding-top: var(--space-10); padding-bottom: var(--space-10); }
.py-12 { padding-top: var(--space-12); padding-bottom: var(--space-12); }

.w-full { width: 100%; }
.relative { position: relative; }
.overflow-hidden { overflow: hidden; }

@media (max-width: 480px) {
  .hide-mobile { display: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

-----

## src/lib/weather.ts

```typescript
// lib/weather.ts

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  cloudCover: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  updatedAt: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weekday: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export const WMO_CODES: Record<number, { label: string; icon: string; bg: string }> = {
  0:  { label: 'Klarer Himmel',           icon: '☀️',  bg: 'sunny' },
  1:  { label: 'Überwiegend klar',        icon: '🌤️', bg: 'mostly-sunny' },
  2:  { label: 'Teilweise bewölkt',       icon: '⛅',  bg: 'partly-cloudy' },
  3:  { label: 'Bedeckt',                 icon: '☁️',  bg: 'cloudy' },
  45: { label: 'Nebel',                   icon: '🌫️', bg: 'foggy' },
  48: { label: 'Gefrierender Nebel',      icon: '🌫️', bg: 'foggy' },
  51: { label: 'Leichter Nieselregen',    icon: '🌦️', bg: 'drizzle' },
  53: { label: 'Mäßiger Nieselregen',     icon: '🌦️', bg: 'drizzle' },
  55: { label: 'Starker Nieselregen',     icon: '🌧️', bg: 'rain' },
  61: { label: 'Leichter Regen',          icon: '🌧️', bg: 'rain' },
  63: { label: 'Mäßiger Regen',           icon: '🌧️', bg: 'rain' },
  65: { label: 'Starker Regen',           icon: '🌧️', bg: 'heavy-rain' },
  71: { label: 'Leichter Schneefall',     icon: '🌨️', bg: 'snow' },
  73: { label: 'Mäßiger Schneefall',      icon: '❄️',  bg: 'snow' },
  75: { label: 'Starker Schneefall',      icon: '❄️',  bg: 'snow' },
  77: { label: 'Schneegriesel',           icon: '🌨️', bg: 'snow' },
  80: { label: 'Leichte Schauer',         icon: '🌦️', bg: 'shower' },
  81: { label: 'Mäßige Schauer',          icon: '🌦️', bg: 'shower' },
  82: { label: 'Starke Schauer',          icon: '⛈️',  bg: 'heavy-rain' },
  85: { label: 'Schneeschauer',           icon: '🌨️', bg: 'snow' },
  86: { label: 'Starke Schneeschauer',    icon: '❄️',  bg: 'snow' },
  95: { label: 'Gewitter',               icon: '⛈️',  bg: 'storm' },
  96: { label: 'Gewitter mit Hagel',      icon: '⛈️',  bg: 'storm' },
  99: { label: 'Heftiges Gewitter',       icon: '🌩️', bg: 'storm' },
};

export function getWeatherMeta(code: number, isDay = true) {
  return WMO_CODES[code] ?? { label: 'Unbekannt', icon: '🌡️', bg: 'default' };
}

export function windDirection(deg: number): string {
  const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

const GERMAN_WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const GERMAN_WEEKDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export function formatGermanDate(dateStr: string): { short: string; full: string } {
  const d = new Date(dateStr);
  return {
    short: GERMAN_WEEKDAYS[d.getDay()],
    full: GERMAN_WEEKDAYS_FULL[d.getDay()],
  };
}

export function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export async function fetchWeather(lat: number, lon: number, timezone = 'Europe/Berlin'): Promise<WeatherData> {
  const base = 'https://api.open-meteo.com/v1/forecast';
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone,
    current: [
      'temperature_2m', 'apparent_temperature', 'weather_code',
      'wind_speed_10m', 'wind_direction_10m', 'relative_humidity_2m',
      'precipitation', 'precipitation_probability', 'uv_index',
      'visibility', 'surface_pressure', 'cloud_cover', 'is_day',
    ].join(','),
    hourly: [
      'temperature_2m', 'weather_code', 'precipitation_probability',
      'wind_speed_10m', 'is_day',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'precipitation_sum', 'precipitation_probability_max',
      'wind_speed_10m_max', 'sunrise', 'sunset', 'uv_index_max',
    ].join(','),
    forecast_days: '7',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });

  const url = `${base}?${params}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });

  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const raw = await res.json();
  const c = raw.current;
  const d0 = raw.daily;

  const current: CurrentWeather = {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    weatherCode: c.weather_code,
    windSpeed: Math.round(c.wind_speed_10m),
    windDirection: c.wind_direction_10m,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    precipitationProbability: c.precipitation_probability ?? 0,
    uvIndex: Math.round(c.uv_index ?? 0),
    visibility: Math.round((c.visibility ?? 0) / 1000),
    pressure: Math.round(c.surface_pressure ?? 0),
    cloudCover: c.cloud_cover ?? 0,
    isDay: c.is_day === 1,
    sunrise: d0.sunrise[0],
    sunset: d0.sunset[0],
    updatedAt: new Date().toISOString(),
  };

  const hourly: HourlyForecast[] = raw.hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: t,
    temperature: Math.round(raw.hourly.temperature_2m[i]),
    weatherCode: raw.hourly.weather_code[i],
    precipitationProbability: raw.hourly.precipitation_probability[i] ?? 0,
    windSpeed: Math.round(raw.hourly.wind_speed_10m[i]),
    isDay: raw.hourly.is_day?.[i] === 1,
  }));

  const daily: DailyForecast[] = d0.time.map((date: string, i: number) => ({
    date,
    weekday: formatGermanDate(date).short,
    tempMax: Math.round(d0.temperature_2m_max[i]),
    tempMin: Math.round(d0.temperature_2m_min[i]),
    weatherCode: d0.weather_code[i],
    precipitationSum: d0.precipitation_sum[i] ?? 0,
    precipitationProbabilityMax: d0.precipitation_probability_max[i] ?? 0,
    windSpeedMax: Math.round(d0.wind_speed_10m_max[i]),
    sunrise: d0.sunrise[i],
    sunset: d0.sunset[i],
    uvIndexMax: Math.round(d0.uv_index_max[i] ?? 0),
  }));

  return { current, hourly, daily };
}

export interface GeoResult {
  name: string;
  country: string;
  admin1: string;
  lat: number;
  lon: number;
  id: number;
}

export async function geocodeCity(query: string): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=de&format=json`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    name: r.name,
    country: r.country_code,
    admin1: r.admin1 ?? '',
    lat: r.latitude,
    lon: r.longitude,
    id: r.id,
  }));
}
```

-----

## src/lib/cities.ts

```typescript
// lib/cities.ts

export interface City {
  slug: string;
  name: string;
  nameGenitive: string;
  state: string;
  lat: number;
  lon: number;
  timezone: string;
  population: number;
  description: string;
  localFact: string;
}

export const CITIES: City[] = [
  {
    slug: 'berlin',
    name: 'Berlin',
    nameGenitive: 'Berlins',
    state: 'Berlin',
    lat: 52.5200,
    lon: 13.4050,
    timezone: 'Europe/Berlin',
    population: 3645000,
    description: 'Aktuelles Wetter in Berlin – Temperatur, Regen, Wind und 7-Tage-Vorhersage für die Bundeshauptstadt.',
    localFact: 'Berlin liegt im Nordostdeutschen Tiefland und hat ein gemäßigt-kontinentales Klima mit warmen Sommern und kalten Wintern.',
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    nameGenitive: 'Hamburgs',
    state: 'Hamburg',
    lat: 53.5753,
    lon: 10.0153,
    timezone: 'Europe/Berlin',
    population: 1841000,
    description: 'Wetter Hamburg heute – aktuelle Temperatur, Regenvorhersage und Windstärke für die Hansestadt.',
    localFact: 'Hamburg liegt an der Elbe und ist für sein maritimes Klima bekannt – mit häufigem Wind und vergleichsweise viel Niederschlag.',
  },
  {
    slug: 'muenchen',
    name: 'München',
    nameGenitive: 'Münchens',
    state: 'Bayern',
    lat: 48.1351,
    lon: 11.5820,
    timezone: 'Europe/Berlin',
    population: 1488000,
    description: 'Wetter München – Vorhersage für heute, morgen und 7 Tage. Temperatur, Sonnenstunden und Alpine Wetterlage.',
    localFact: 'München liegt am Alpenrand und profitiert von über 1.700 Sonnenstunden pro Jahr – mehr als Hamburg oder Berlin.',
  },
  {
    slug: 'koeln',
    name: 'Köln',
    nameGenitive: 'Kölns',
    state: 'Nordrhein-Westfalen',
    lat: 50.9333,
    lon: 6.9500,
    timezone: 'Europe/Berlin',
    population: 1084000,
    description: 'Wetter Köln aktuell – Temperaturen, Niederschlag und Wind am Rhein. 7-Tage-Vorhersage für Köln.',
    localFact: 'Köln am Rhein hat ein ozeanisches Klima mit milden Wintern und mäßig warmen Sommern.',
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt',
    nameGenitive: 'Frankfurts',
    state: 'Hessen',
    lat: 50.1109,
    lon: 8.6821,
    timezone: 'Europe/Berlin',
    population: 773000,
    description: 'Wetter Frankfurt am Main – aktuelle Wetterdaten, Stundentabelle und Wochenvorhersage.',
    localFact: 'Frankfurt am Main gilt als wärmste Großstadt Deutschlands und hat besonders heiße Sommer durch den Wärmeinseleffekt.',
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    nameGenitive: 'Stuttgarts',
    state: 'Baden-Württemberg',
    lat: 48.7758,
    lon: 9.1829,
    timezone: 'Europe/Berlin',
    population: 634830,
    description: 'Wetter Stuttgart heute und die nächsten 7 Tage – Kessel-Klima, Temperatur und Regenradar.',
    localFact: 'Stuttgart liegt in einem Talkessel, was zu Inversionslagen und smogähnlichen Bedingungen im Winter führen kann.',
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    nameGenitive: 'Düsseldorfs',
    state: 'Nordrhein-Westfalen',
    lat: 51.2217,
    lon: 6.7762,
    timezone: 'Europe/Berlin',
    population: 619477,
    description: 'Wetter Düsseldorf – Vorhersage für die Landeshauptstadt NRW. Temperatur, Wind und Regen am Rhein.',
    localFact: 'Düsseldorf am Rhein hat ein typisch atlantisch geprägtes Klima mit milden, feuchten Wintern und mäßig warmen Sommern.',
  },
  {
    slug: 'leipzig',
    name: 'Leipzig',
    nameGenitive: 'Leipzigs',
    state: 'Sachsen',
    lat: 51.3397,
    lon: 12.3731,
    timezone: 'Europe/Berlin',
    population: 601519,
    description: 'Wetter Leipzig aktuell – Temperatur, Sonnenstunden und 7-Tage-Prognose für die Messestadt.',
    localFact: 'Leipzig hat ein kontinentales Klima mit vergleichsweise geringen Niederschlägen und heißen Sommern.',
  },
  {
    slug: 'nuernberg',
    name: 'Nürnberg',
    nameGenitive: 'Nürnbergs',
    state: 'Bayern',
    lat: 49.4521,
    lon: 11.0767,
    timezone: 'Europe/Berlin',
    population: 515543,
    description: 'Wetter Nürnberg – aktuelle Wettervorhersage, Temperatur und Wind für die Franken-Metropole.',
    localFact: 'Nürnberg liegt im Mittelfränkischen Becken und hat ein etwas trockeneres kontinentales Klima als andere bayerische Städte.',
  },
  {
    slug: 'dresden',
    name: 'Dresden',
    nameGenitive: 'Dresdens',
    state: 'Sachsen',
    lat: 51.0504,
    lon: 13.7373,
    timezone: 'Europe/Berlin',
    population: 554649,
    description: 'Wetter Dresden – Vorhersage für das Elbtal, Temperatur, Niederschlag und Sonnenschein.',
    localFact: 'Dresden liegt im Elbtal und hat mit dem Elbsandsteingebirge in der Nähe interessante Wetterphänomene durch Föhn und Stau.',
  },
  {
    slug: 'hannover',
    name: 'Hannover',
    nameGenitive: 'Hannovers',
    state: 'Niedersachsen',
    lat: 52.3759,
    lon: 9.7320,
    timezone: 'Europe/Berlin',
    population: 535932,
    description: 'Wetter Hannover aktuell – Temperaturen, Regenprognose und Windwerte für Niedersachsens Landeshauptstadt.',
    localFact: 'Hannover hat ein ozeanisch geprägtes Klima und liegt zentral in Norddeutschland zwischen den Küsteneinflüssen und dem Kontinentalklima des Ostens.',
  },
  {
    slug: 'bremen',
    name: 'Bremen',
    nameGenitive: 'Bremens',
    state: 'Bremen',
    lat: 53.0793,
    lon: 8.8017,
    timezone: 'Europe/Berlin',
    population: 563000,
    description: 'Wetter Bremen – aktuelle Wetterinformationen für das Stadtstaat an der Weser.',
    localFact: 'Bremen hat ein maritimes Klima mit viel Wind und Regen durch die Nähe zur Nordsee.',
  },
];

export const CITY_MAP: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c])
);

export const TOP_CITIES = CITIES.filter((c) => c.population > 700000);

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return CITY_MAP[slug];
}
```

-----

## src/app/layout.tsx

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import '../styles/globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ThemeScript } from '@/components/ThemeScript';

export const metadata: Metadata = {
  metadataBase: new URL('https://heute-wetter.de'),
  title: {
    default: 'Heute Wetter – Aktuelles Wetter für Deutschland',
    template: '%s | Heute Wetter',
  },
  description:
    'Aktuelles Wetter für alle deutschen Städte – Temperatur, Regen, Wind, UV und 7-Tage-Vorhersage. Kostenlos, schnell und ohne Werbung.',
  keywords: ['Wetter heute', 'Wettervorhersage', 'Wetter Deutschland', 'aktuelles Wetter', 'Temperatur', '7-Tage-Vorhersage'],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Heute Wetter',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Heute Wetter' }],
  },
  twitter: { card: 'summary_large_image', site: '@heutewetter' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://heute-wetter.de' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#060c1a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f0f6fd" media="(prefers-color-scheme: light)" />
        <ThemeScript />
      </head>
      <body>
        <a href="#main-content" className="sr-only" style={{ position: 'absolute', top: 8, left: 8, zIndex: 9999, padding: '8px 16px', background: 'var(--accent)', color: 'var(--navy-950)', borderRadius: 8, fontWeight: 600 }}>
          Zum Inhalt springen
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

-----

## src/app/page.tsx

```tsx
// src/app/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchWeather } from '@/lib/weather';
import { CITIES, TOP_CITIES } from '@/lib/cities';
import { WeatherHero } from '@/components/WeatherHero';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { WeatherDetails } from '@/components/WeatherDetails';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Heute Wetter – Aktuelles Wetter für Deutschland',
  description:
    'Aktuelle Wetterdaten für ganz Deutschland. Temperatur, Regen, Wind und 7-Tage-Vorhersage für Berlin, Hamburg, München und alle anderen Städte.',
  alternates: { canonical: 'https://heute-wetter.de' },
};

function HomepageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Heute Wetter',
    url: 'https://heute-wetter.de',
    description: 'Aktuelles Wetter für alle deutschen Städte',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://heute-wetter.de/wetter/{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function HomePage() {
  const defaultCity = CITIES.find((c) => c.slug === 'berlin')!;
  let weather;
  let fetchError = false;
  try {
    weather = await fetchWeather(defaultCity.lat, defaultCity.lon, defaultCity.timezone);
  } catch {
    fetchError = true;
  }

  return (
    <>
      <HomepageSchema />
      {weather && !fetchError ? (
        <WeatherHero city={defaultCity} weather={weather.current} />
      ) : (
        <div className="hero" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Wetterdaten konnten nicht geladen werden. Bitte versuche es später erneut.
          </p>
        </div>
      )}

      <div className="container" style={{ paddingTop: '2rem' }}>
        {weather && !fetchError && (
          <>
            <section aria-label="Stündliche Vorhersage" className="mb-8">
              <p className="section-title">Stundenweise</p>
              <HourlyForecast hours={weather.hourly} />
            </section>
            <section aria-label="Wetterdetails" className="mb-8">
              <p className="section-title">Details</p>
              <WeatherDetails current={weather.current} />
            </section>
            <section aria-label="7-Tage-Vorhersage" className="mb-10">
              <p className="section-title">7-Tage-Vorhersage</p>
              <DailyForecast days={weather.daily} />
            </section>
          </>
        )}

        <section aria-label="Städte-Übersicht" className="mb-10">
          <p className="section-title">Wetter nach Städten</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
            Wetter in deutschen Großstädten
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '640px', lineHeight: '1.7' }}>
            Aktuelles Wetter und 7-Tage-Vorhersage für die größten Städte Deutschlands.
          </p>
          <nav aria-label="Städte-Navigation">
            <div className="city-link-grid">
              {CITIES.map((city) => (
                <Link key={city.slug} href={`/wetter/${city.slug}`} className="city-link-pill" title={`Wetter ${city.name}`}>
                  📍 {city.name}
                </Link>
              ))}
            </div>
          </nav>
        </section>

        <section className="card mb-10" aria-label="Über Heute Wetter">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>
            Zuverlässige Wetterdaten für ganz Deutschland
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8', marginBottom: '0.75rem' }}>
            Heute Wetter nutzt die offene Wetter-API von{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              Open-Meteo
            </a>{' '}
            – einem europäischen Wetterdienst, der auf Hochleistungs-Wettermodellen basiert.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8' }}>
            Unsere Plattform ist vollständig kostenlos, ohne Registrierung und ohne Werbung.
          </p>
        </section>
      </div>
    </>
  );
}
```

-----

## src/app/not-found.tsx

```tsx
// src/app/not-found.tsx
import Link from 'next/link';
import { CITIES } from '@/lib/cities';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌧️</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
        Diese Seite gibt es leider nicht. Vielleicht suchst du nach dem Wetter in einer bestimmten Stadt?
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <Link href="/" className="btn btn-primary">Zur Startseite</Link>
      </div>
      <p className="section-title" style={{ marginBottom: '1rem' }}>Beliebte Städte</p>
      <div className="city-link-grid" style={{ justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {CITIES.slice(0, 8).map((c) => (
          <Link key={c.slug} href={`/wetter/${c.slug}`} className="city-link-pill">
            📍 {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

-----

## src/app/robots.ts

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://heute-wetter.de/sitemap.xml',
  };
}
```

-----

## src/app/sitemap.ts

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { CITIES } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://heute-wetter.de';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${base}/wetter/${city.slug}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: city.population > 1000000 ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
```

-----

## src/app/api/weather/route.ts

```typescript
// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const q = searchParams.get('q');

  if (action === 'geo' && q) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=de&format=json`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      return NextResponse.json(
        { results: data.results ?? [] },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
      );
    } catch {
      return NextResponse.json({ results: [] }, { status: 200 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
```

-----

## src/app/wetter/[city]/page.tsx

```tsx
// src/app/wetter/[city]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getAllCitySlugs, CITIES } from '@/lib/cities';
import { fetchWeather, formatTime } from '@/lib/weather';
import { WeatherHero } from '@/components/WeatherHero';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { WeatherDetails } from '@/components/WeatherDetails';

export const revalidate = 1800;

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  const title = `Wetter ${city.name} heute – Temperatur, Regen & Vorhersage`;
  const canonical = `https://heute-wetter.de/wetter/${city.slug}`;
  return {
    title,
    description: city.description,
    alternates: { canonical },
    openGraph: { title, description: city.description, url: canonical, locale: 'de_DE', type: 'website' },
    twitter: { card: 'summary_large_image', title, description: city.description },
  };
}

function CityWeatherSchema({ city, temp, condition }: { city: string; temp: number; condition: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Wetter ${city} heute`,
    description: `Aktuelles Wetter in ${city}: ${temp}°C, ${condition}`,
    url: `https://heute-wetter.de/wetter/${city.toLowerCase()}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://heute-wetter.de' },
        { '@type': 'ListItem', position: 2, name: `Wetter ${city}`, item: `https://heute-wetter.de/wetter/${city.toLowerCase()}` },
      ],
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  let weather;
  let fetchError = false;
  try {
    weather = await fetchWeather(city.lat, city.lon, city.timezone);
  } catch {
    fetchError = true;
  }

  const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 10);
  const condition = weather ? (require('@/lib/weather').getWeatherMeta(weather.current.weatherCode).label) : '';

  return (
    <>
      {weather && <CityWeatherSchema city={city.name} temp={weather.current.temperature} condition={condition} />}

      <div className="container" style={{ paddingTop: '1rem' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>Startseite</Link>
          <span aria-hidden>›</span>
          <span>Wetter {city.name}</span>
        </nav>
      </div>

      {weather && !fetchError ? (
        <WeatherHero city={city} weather={weather.current} />
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
          Wetterdaten für {city.name} konnten nicht geladen werden.
        </div>
      )}

      <div className="container" style={{ paddingTop: '2rem' }}>
        {weather && !fetchError && (
          <>
            <section aria-label="Stündliche Vorhersage" className="mb-8">
              <p className="section-title">Stündliche Vorhersage</p>
              <HourlyForecast hours={weather.hourly} />
            </section>
            <section aria-label="Wetterdetails" className="mb-8">
              <p className="section-title">Details</p>
              <WeatherDetails current={weather.current} />
            </section>
            <section aria-label="7-Tage-Vorhersage" className="mb-10">
              <p className="section-title">7-Tage-Vorhersage</p>
              <DailyForecast days={weather.daily} />
            </section>
            <section aria-label="Sonnenauf- und -untergang" className="card mb-8">
              <p className="section-title">Sonne</p>
              <div className="sun-times">
                <div className="sun-item">
                  <span className="sun-icon" aria-hidden>🌅</span>
                  <div>
                    <div className="sun-label">Sonnenaufgang</div>
                    <div className="sun-time">{formatTime(weather.current.sunrise)}</div>
                  </div>
                </div>
                <div style={{ height: 40, width: 1, background: 'var(--border)' }} aria-hidden />
                <div className="sun-item">
                  <span className="sun-icon" aria-hidden>🌇</span>
                  <div>
                    <div className="sun-label">Sonnenuntergang</div>
                    <div className="sun-time">{formatTime(weather.current.sunset)}</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="card mb-8" aria-label={`Klima ${city.name}`}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Klima in {city.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8' }}>
            {city.localFact}
          </p>
        </section>

        <section aria-label="Wetter anderer Städte" className="mb-10">
          <p className="section-title">Wetter in anderen Städten</p>
          <nav aria-label="Städte">
            <div className="city-link-grid">
              {otherCities.map((c) => (
                <Link key={c.slug} href={`/wetter/${c.slug}`} className="city-link-pill" title={`Wetter ${c.name}`}>
                  📍 {c.name}
                </Link>
              ))}
            </div>
          </nav>
        </section>

        <div className="card mb-10 fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>📤 Diese Seite teilen:</span>
          <a href={`https://twitter.com/intent/tweet?text=Aktuelles+Wetter+in+${encodeURIComponent(city.name)}&url=${encodeURIComponent(`https://heute-wetter.de/wetter/${city.slug}`)}`}
            target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            𝕏 Twitter
          </a>
          <a href={`https://wa.me/?text=Wetter+${encodeURIComponent(city.name)}+https://heute-wetter.de/wetter/${city.slug}`}
            target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
```

-----

## src/components/ThemeScript.tsx

```tsx
// src/components/ThemeScript.tsx
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('hw-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.add(theme);
      } catch(e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
```

-----

## src/components/Nav.tsx

```tsx
'use client';
// src/components/Nav.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CITIES } from '@/lib/cities';
import type { GeoResult } from '@/lib/weather';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Nav() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(typeof CITIES[0] | GeoResult)[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    const t = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    setTheme(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
    localStorage.setItem('hw-theme', next);
    setTheme(next);
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setOpen(false); return; }
    const q = debouncedQuery.toLowerCase();
    const local = CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q));
    if (local.length) { setResults(local); setOpen(true); }

    setLoading(true);
    fetch(`/api/weather?action=geo&q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results?.length) {
          const geoOnly = data.results.filter(
            (r: GeoResult) => !CITIES.find((c) => c.name.toLowerCase() === r.name.toLowerCase())
          );
          setResults([...local, ...geoOnly.slice(0, 3)]);
          setOpen(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((result: typeof CITIES[0] | GeoResult) => {
    const local = CITIES.find((c) => c.name.toLowerCase() === ('name' in result ? result.name.toLowerCase() : ''));
    if (local) {
      router.push(`/wetter/${local.slug}`);
    } else if ('lat' in result) {
      const r = result as GeoResult;
      router.push(`/wetter/${r.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
    setQuery('');
    setOpen(false);
  }, [router]);

  const [activeIdx, setActiveIdx] = useState(-1);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { handleSelect(results[activeIdx]); }
    if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1); }
  };

  return (
    <header className="nav" role="banner">
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Heute Wetter – Startseite">
            <span aria-hidden>⛅</span>
            Heute<span>Wetter</span>
          </Link>

          <div className="search-wrap" ref={wrapRef} role="search">
            <span className="search-icon" aria-hidden>🔍</span>
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Stadt suchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Stadt suchen"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls="search-listbox"
              autoComplete="off"
              spellCheck={false}
            />
            {open && results.length > 0 && (
              <ul className="search-results" role="listbox" id="search-listbox" aria-label="Suchergebnisse">
                {results.map((r, i) => {
                  const name = 'name' in r ? r.name : (r as any).name;
                  const sub = 'state' in r
                    ? `${(r as any).state}, Deutschland`
                    : `${'admin1' in r ? (r as any).admin1 + ', ' : ''}${'country' in r ? (r as any).country : ''}`;
                  return (
                    <li
                      key={i}
                      role="option"
                      aria-selected={i === activeIdx}
                      className="search-result-item"
                      style={{ background: i === activeIdx ? 'var(--bg-raised)' : undefined }}
                      onMouseDown={() => handleSelect(r)}
                    >
                      <span style={{ fontSize: '1rem' }}>📍</span>
                      <span>
                        <span className="city-name">{name}</span>
                        <br />
                        <span className="city-sub">{sub}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

-----

## src/components/Footer.tsx

```tsx
// src/components/Footer.tsx
import Link from 'next/link';
import { TOP_CITIES } from '@/lib/cities';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><span aria-hidden>⛅</span> Heute<span>Wetter</span></div>
            <p className="footer-desc">
              Aktuelles Wetter für ganz Deutschland – kostenlos, schnell und ohne Werbung.
              Wetterdaten von{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
            </p>
          </div>
          <div>
            <p className="footer-col-title">Beliebte Städte</p>
            <ul className="footer-links">
              {TOP_CITIES.map((city) => (
                <li key={city.slug}><Link href={`/wetter/${city.slug}`}>Wetter {city.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Info</p>
            <ul className="footer-links">
              <li><Link href="/">Startseite</Link></li>
              <li><a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">Datenbasis (Open-Meteo)</a></li>
              <li><a href="mailto:kontakt@heute-wetter.de">Kontakt</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} HeuteWetter. Alle Rechte vorbehalten.</span>
          <span>Wetterdaten: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (CC BY 4.0)</span>
        </div>
      </div>
    </footer>
  );
}
```

-----

## src/components/WeatherHero.tsx

```tsx
// src/components/WeatherHero.tsx
import Link from 'next/link';
import type { City } from '@/lib/cities';
import type { CurrentWeather } from '@/lib/weather';
import { getWeatherMeta, windDirection, formatTime } from '@/lib/weather';

interface Props { city: City; weather: CurrentWeather; }

const BG_GRADIENTS: Record<string, string> = {
  'sunny':        'linear-gradient(135deg, #1a3a6e 0%, #0f2855 40%, #d97706 100%)',
  'mostly-sunny': 'linear-gradient(135deg, #1a3a6e 0%, #1e3f6e 50%, #b45309 100%)',
  'partly-cloudy':'linear-gradient(135deg, #1a3a6e 0%, #243a5e 60%, #64748b 100%)',
  'cloudy':       'linear-gradient(135deg, #1e2a3a 0%, #2d3f52 100%)',
  'foggy':        'linear-gradient(135deg, #1e2a3a 0%, #3d4f5e 100%)',
  'drizzle':      'linear-gradient(135deg, #0f1e2e 0%, #1e3a52 100%)',
  'rain':         'linear-gradient(135deg, #0a1628 0%, #0f2540 100%)',
  'heavy-rain':   'linear-gradient(135deg, #070e1a 0%, #0a1a2e 100%)',
  'snow':         'linear-gradient(135deg, #1a2a3e 0%, #2d4a6a 60%, #4a6a8a 100%)',
  'shower':       'linear-gradient(135deg, #0f1e2e 0%, #1e3a52 100%)',
  'storm':        'linear-gradient(135deg, #080e1a 0%, #1a0e2e 100%)',
  'default':      'linear-gradient(135deg, #0d1b2e 0%, #1a3356 100%)',
};

const ORB_COLORS: Record<string, string> = {
  'sunny':         'rgba(251,191,36,0.35)',
  'mostly-sunny':  'rgba(251,191,36,0.25)',
  'partly-cloudy': 'rgba(148,175,200,0.2)',
  'rain':          'rgba(56,189,248,0.2)',
  'heavy-rain':    'rgba(56,189,248,0.15)',
  'storm':         'rgba(192,132,252,0.2)',
  'snow':          'rgba(186,230,253,0.2)',
  'default':       'rgba(58,100,145,0.25)',
};

export function WeatherHero({ city, weather }: Props) {
  const meta = getWeatherMeta(weather.weatherCode, weather.isDay);
  const gradient = BG_GRADIENTS[meta.bg] ?? BG_GRADIENTS['default'];
  const orbColor = ORB_COLORS[meta.bg] ?? ORB_COLORS['default'];
  const now = new Date(weather.updatedAt);
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="hero" style={{ background: gradient }} aria-label={`Aktuelles Wetter in ${city.name}`}>
      <div className="hero-orb" aria-hidden style={{ width: 400, height: 400, background: orbColor, top: -100, right: -80 }} />
      <div className="hero-orb" aria-hidden style={{ width: 250, height: 250, background: orbColor, bottom: 60, left: -60, animationDelay: '3s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
            <span aria-hidden>📍</span>{city.state}
          </span>
        </div>

        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.25rem', lineHeight: 1.1 }}>
              Wetter {city.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {dateStr} · Zuletzt: {timeStr} Uhr
            </p>
            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="display-temp" style={{ color: '#fff' }} aria-label={`${weather.temperature} Grad Celsius`}>
                {weather.temperature}°
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.3rem' }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>Gefühlt {weather.feelsLike}°C</div>
              </div>
            </div>
          </div>
          <div className="weather-icon-xl hide-mobile" aria-hidden="true">{meta.icon}</div>
        </div>

        <div className="meta-grid fade-up fade-up-delay-2" role="list" aria-label="Wetterdetails">
          {[
            { label: 'Luftfeuchte', value: `${weather.humidity}`, unit: '%', icon: '💧' },
            { label: 'Wind', value: `${weather.windSpeed}`, unit: `km/h ${windDirection(weather.windDirection)}`, icon: '💨' },
            { label: 'Regen', value: `${weather.precipitationProbability}`, unit: '%', icon: '🌧️' },
            { label: 'UV-Index', value: `${weather.uvIndex}`, unit: '', icon: '☀️' },
            { label: 'Sichtweite', value: `${weather.visibility}`, unit: 'km', icon: '👁️' },
            { label: 'Luftdruck', value: `${weather.pressure}`, unit: 'hPa', icon: '🧭' },
          ].map(({ label, value, unit, icon }) => (
            <div key={label} className="meta-item" role="listitem" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="label" style={{ color: 'rgba(255,255,255,0.45)' }}><span aria-hidden>{icon} </span>{label}</div>
              <div className="value" style={{ color: '#fff' }}>
                {value}{unit && <span className="unit" style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 3 }}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

-----

## src/components/HourlyForecast.tsx

```tsx
// src/components/HourlyForecast.tsx
import type { HourlyForecast as HourlyData } from '@/lib/weather';
import { getWeatherMeta } from '@/lib/weather';

interface Props { hours: HourlyData[]; }

export function HourlyForecast({ hours }: Props) {
  const now = new Date();
  const currentHour = now.getHours();

  return (
    <div className="card card-sm" style={{ padding: '1rem' }}>
      <div className="hourly-scroll" role="list" aria-label="Stündliche Wettervorhersage">
        {hours.map((hour, i) => {
          const d = new Date(hour.time);
          const h = d.getHours();
          const isNow = i === 0 || (h === currentHour && d.getDate() === now.getDate());
          const meta = getWeatherMeta(hour.weatherCode, hour.isDay);
          return (
            <div key={hour.time} className={`hourly-item${isNow ? ' active' : ''}`} role="listitem" aria-label={`${h}:00 Uhr: ${hour.temperature}°C, ${meta.label}`}>
              <div className="h-time">{isNow ? 'Jetzt' : `${String(h).padStart(2, '0')}:00`}</div>
              <div className="h-icon" aria-hidden>{meta.icon}</div>
              <div className="h-temp">{hour.temperature}°</div>
              {hour.precipitationProbability > 0 && (
                <div className="h-rain" aria-label={`Regenwahrscheinlichkeit ${hour.precipitationProbability}%`}>
                  💧{hour.precipitationProbability}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

-----

## src/components/DailyForecast.tsx

```tsx
// src/components/DailyForecast.tsx
import type { DailyForecast as DailyData } from '@/lib/weather';
import { getWeatherMeta } from '@/lib/weather';

interface Props { days: DailyData[]; }

export function DailyForecast({ days }: Props) {
  const allMax = Math.max(...days.map((d) => d.tempMax));
  const allMin = Math.min(...days.map((d) => d.tempMin));
  const range = allMax - allMin || 1;

  return (
    <div className="daily-grid" role="list" aria-label="7-Tage-Vorhersage">
      {days.map((day, i) => {
        const meta = getWeatherMeta(day.weatherCode, true);
        const isToday = i === 0;
        const minPct = ((day.tempMin - allMin) / range) * 100;
        const maxPct = ((day.tempMax - allMin) / range) * 100;
        const fillWidth = maxPct - minPct;

        return (
          <div key={day.date} className="daily-row" role="listitem" aria-label={`${isToday ? 'Heute' : day.weekday}: ${day.tempMin}° bis ${day.tempMax}°C, ${meta.label}`}>
            <div className="day-name" style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--text-primary)' : undefined }}>
              {isToday ? 'Heute' : day.weekday}
            </div>
            <div className="day-icon" aria-hidden>{meta.icon}</div>
            <div className="day-bar-wrap">
              <span className="t-min">{day.tempMin}°</span>
              <div className="temp-bar" aria-hidden>
                <div className="temp-bar-fill" style={{ marginLeft: `${minPct}%`, width: `${Math.max(fillWidth, 8)}%` }} />
              </div>
              <span className="t-max">{day.tempMax}°</span>
            </div>
            <div className="daily-rain">
              {day.precipitationProbabilityMax > 0 ? (
                <span aria-label={`Regen: ${day.precipitationProbabilityMax}%`}>💧 {day.precipitationProbabilityMax}%</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }} aria-label="Kein Regen erwartet">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

-----

## src/components/WeatherDetails.tsx

```tsx
// src/components/WeatherDetails.tsx
import type { CurrentWeather } from '@/lib/weather';
import { windDirection } from '@/lib/weather';

interface Props { current: CurrentWeather; }

function uvLabel(uv: number): string {
  if (uv <= 2) return 'Niedrig';
  if (uv <= 5) return 'Mäßig';
  if (uv <= 7) return 'Hoch';
  if (uv <= 10) return 'Sehr hoch';
  return 'Extrem';
}

function uvColor(uv: number): string {
  if (uv <= 2) return 'var(--green-400)';
  if (uv <= 5) return 'var(--amber-400)';
  if (uv <= 7) return 'var(--amber-500)';
  if (uv <= 10) return 'var(--red-400)';
  return 'var(--purple-400)';
}

function DetailCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="card card-sm" role="listitem" aria-label={`${label}: ${value}, ${sub}`}>
      <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }} aria-hidden>{icon}</div>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.1rem' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  );
}

export function WeatherDetails({ current }: Props) {
  const uvPct = Math.min((current.uvIndex / 12) * 100, 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }} role="list" aria-label="Ausführliche Wetterdaten">
      <DetailCard icon="💧" label="Luftfeuchtigkeit" value={`${current.humidity}%`} sub={current.humidity > 70 ? 'Feucht' : current.humidity > 40 ? 'Komfortabel' : 'Trocken'} />
      <DetailCard icon="💨" label="Windgeschwindigkeit" value={`${current.windSpeed} km/h`} sub={windDirection(current.windDirection)} />
      <DetailCard icon="🧭" label="Luftdruck" value={`${current.pressure} hPa`} sub={current.pressure > 1013 ? 'Hochdruck' : 'Tiefdruck'} />
      <DetailCard icon="👁️" label="Sichtweite" value={`${current.visibility} km`} sub={current.visibility > 10 ? 'Gut' : current.visibility > 4 ? 'Mäßig' : 'Schlecht'} />
      <DetailCard icon="☁️" label="Bewölkung" value={`${current.cloudCover}%`} sub={current.cloudCover > 80 ? 'Bedeckt' : current.cloudCover > 40 ? 'Teilweise' : 'Heiter'} />
      <DetailCard icon="🌧️" label="Niederschlag" value={`${current.precipitation} mm`} sub={`${current.precipitationProbability}% Wahrsch.`} />

      <div className="card card-sm" role="listitem" aria-label={`UV-Index: ${current.uvIndex}, ${uvLabel(current.uvIndex)}`} style={{ gridColumn: 'span 2' }}>
        <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }} aria-hidden>☀️</div>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>UV-Index</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: uvColor(current.uvIndex) }}>{current.uvIndex}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{uvLabel(current.uvIndex)}</span>
        </div>
        <div className="uv-bar" aria-hidden role="img" aria-label={`UV-Index ${current.uvIndex} von 12`}>
          <div className="uv-indicator" style={{ left: `${uvPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          <span>Niedrig</span><span>Hoch</span><span>Extrem</span>
        </div>
      </div>
    </div>
  );
}
```

-----

## Deploy to Vercel

**Option A — GitHub (recommended):**

1. Create a new GitHub repo
1. Push all files with the folder structure shown above
1. Go to vercel.com → New Project → Import your repo
1. No settings needed — `vercel.json` handles everything
1. Click Deploy

**Option B — Vercel CLI:**

```bash
npm i -g vercel
cd heute-wetter
vercel
```

**The key fix:** The zip is now packaged so `src/`, `package.json`, etc. are at the **root level** of the archive — not inside a `heute-wetter/` subfolder. Vercel will find `src/` immediately.