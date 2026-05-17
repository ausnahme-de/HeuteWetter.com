// src/components/Footer.tsx
// Server component

import Link from 'next/link';
import { TOP_CITIES } from '@/lib/cities';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <span aria-hidden>⛅</span> Heute<span>Wetter</span>
            </div>
            <p className="footer-desc">
              Aktuelles Wetter für ganz Deutschland – kostenlos, schnell und ohne Werbung.
              Wetterdaten von{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">
                Open-Meteo
              </a>
              .
            </p>
          </div>

          {/* Top cities */}
          <div>
            <p className="footer-col-title">Beliebte Städte</p>
            <ul className="footer-links">
              {TOP_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link href={`/wetter/${city.slug}`}>
                    Wetter {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="footer-col-title">Info</p>
            <ul className="footer-links">
              <li><Link href="/">Startseite</Link></li>
              <li>
                <a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">
                  Datenbasis (Open-Meteo)
                </a>
              </li>
              <li>
                <a href="mailto:kontakt@heute-wetter.de">Kontakt</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {year} HeuteWetter. Alle Rechte vorbehalten.</span>
          <span>
            Wetterdaten:{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">
              Open-Meteo
            </a>{' '}
            (CC BY 4.0)
          </span>
        </div>
      </div>
    </footer>
  );
}
