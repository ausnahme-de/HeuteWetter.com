// src/app/wetter/[city]/page.tsx
// Dynamic city page — SSR/ISR hybrid
// Each city gets: unique title, H1, description, canonical, OG, schema

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getAllCitySlugs, CITIES } from '@/lib/cities';
import { fetchWeather, formatTime } from '@/lib/weather';
import { WeatherHero } from '@/components/WeatherHero';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { WeatherDetails } from '@/components/WeatherDetails';

// ISR: rebuild every 30 min
export const revalidate = 1800;

// Generate all known city pages at build time
export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

// Dynamic SEO metadata per city
export async function generateMetadata(
  { params }: { params: { city: string } }
): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return {};

  const title = `Wetter ${city.name} heute – Temperatur, Regen & Vorhersage`;
  const canonical = `https://heute-wetter.de/wetter/${city.slug}`;

  return {
    title,
    description: city.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: city.description,
      url: canonical,
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: city.description,
    },
  };
}

// Schema: WeatherForecast per city
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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

  // Other cities to link to (exclude current)
  const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 10);

  const condition = weather
    ? (require('@/lib/weather').getWeatherMeta(weather.current.weatherCode).label)
    : '';

  return (
    <>
      {weather && (
        <CityWeatherSchema city={city.name} temp={weather.current.temperature} condition={condition} />
      )}

      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: '1rem' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>Startseite</Link>
          <span aria-hidden>›</span>
          <span>Wetter {city.name}</span>
        </nav>
      </div>

      {/* Hero */}
      {weather && !fetchError ? (
        <WeatherHero city={city} weather={weather.current} />
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
          Wetterdaten für {city.name} konnten nicht geladen werden.{' '}
          <button
            onClick={() => window.location.reload()}
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Erneut versuchen
          </button>
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

            {/* Sun times */}
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

        {/* Local content — unique per city, good for SEO */}
        <section className="card mb-8" aria-label={`Klima ${city.name}`}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Klima in {city.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8' }}>
            {city.localFact}
          </p>
        </section>

        {/* Internal links to other cities */}
        <section aria-label="Wetter anderer Städte" className="mb-10">
          <p className="section-title">Wetter in anderen Städten</p>
          <nav aria-label="Städte">
            <div className="city-link-grid">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/wetter/${c.slug}`}
                  className="city-link-pill"
                  title={`Wetter ${c.name}`}
                >
                  📍 {c.name}
                </Link>
              ))}
            </div>
          </nav>
        </section>

        {/* Share section */}
        <div className="card mb-10 fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            📤 Diese Seite teilen:
          </span>
          <a
            href={`https://twitter.com/intent/tweet?text=Aktuelles+Wetter+in+${encodeURIComponent(city.name)}&url=${encodeURIComponent(`https://heute-wetter.de/wetter/${city.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            aria-label={`Wetter ${city.name} auf Twitter teilen`}
          >
            𝕏 Twitter
          </a>
          <a
            href={`https://wa.me/?text=Wetter+${encodeURIComponent(city.name)}+https://heute-wetter.de/wetter/${city.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            aria-label={`Wetter ${city.name} auf WhatsApp teilen`}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
