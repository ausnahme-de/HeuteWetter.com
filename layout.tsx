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
  keywords: [
    'Wetter heute',
    'Wettervorhersage',
    'Wetter Deutschland',
    'aktuelles Wetter',
    'Temperatur',
    '7-Tage-Vorhersage',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Heute Wetter',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Heute Wetter' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@heutewetter',
  },
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
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Theme color */}
        <meta name="theme-color" content="#060c1a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f0f6fd" media="(prefers-color-scheme: light)" />
        {/* Inject theme before render to avoid flash */}
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
