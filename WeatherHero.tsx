// src/components/WeatherHero.tsx
// Server component — renders the hero with current weather
// No client-side JS needed here; pure HTML for fast FCP

import Link from 'next/link';
import type { City } from '@/lib/cities';
import type { CurrentWeather } from '@/lib/weather';
import { getWeatherMeta, windDirection, formatTime } from '@/lib/weather';

interface Props {
  city: City;
  weather: CurrentWeather;
}

// Map weather bg to gradient
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

// Orb color per weather
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
    <section
      className="hero"
      style={{ background: gradient }}
      aria-label={`Aktuelles Wetter in ${city.name}`}
    >
      {/* Decorative orbs */}
      <div
        className="hero-orb"
        aria-hidden
        style={{
          width: 400,
          height: 400,
          background: orbColor,
          top: -100,
          right: -80,
        }}
      />
      <div
        className="hero-orb"
        aria-hidden
        style={{
          width: 250,
          height: 250,
          background: orbColor,
          bottom: 60,
          left: -60,
          animationDelay: '3s',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* City name */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            <span aria-hidden>📍</span>
            {city.state}
          </span>
        </div>

        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {/* Left: temp + condition */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff',
                marginBottom: '0.25rem',
                lineHeight: 1.1,
              }}
            >
              Wetter {city.name}
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {dateStr} · Zuletzt: {timeStr} Uhr
            </p>

            {/* Temperature */}
            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
              <div
                className="display-temp"
                style={{ color: '#fff' }}
                aria-label={`${weather.temperature} Grad Celsius`}
              >
                {weather.temperature}°
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '0.3rem',
                  }}
                >
                  {meta.label}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>
                  Gefühlt {weather.feelsLike}°C
                </div>
              </div>
            </div>
          </div>

          {/* Right: big icon */}
          <div
            className="weather-icon-xl hide-mobile"
            aria-hidden="true"
          >
            {meta.icon}
          </div>
        </div>

        {/* Meta grid */}
        <div
          className="meta-grid fade-up fade-up-delay-2"
          role="list"
          aria-label="Wetterdetails"
        >
          <MetaItem label="Luftfeuchte" value={`${weather.humidity}`} unit="%" icon="💧" />
          <MetaItem label="Wind" value={`${weather.windSpeed}`} unit={`km/h ${windDirection(weather.windDirection)}`} icon="💨" />
          <MetaItem label="Regen" value={`${weather.precipitationProbability}`} unit="%" icon="🌧️" />
          <MetaItem label="UV-Index" value={`${weather.uvIndex}`} unit="" icon="☀️" />
          <MetaItem label="Sichtweite" value={`${weather.visibility}`} unit="km" icon="👁️" />
          <MetaItem label="Luftdruck" value={`${weather.pressure}`} unit="hPa" icon="🧭" />
        </div>
      </div>
    </section>
  );
}

function MetaItem({
  label, value, unit, icon,
}: { label: string; value: string; unit: string; icon: string }) {
  return (
    <div
      className="meta-item"
      role="listitem"
      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>
        <span aria-hidden>{icon} </span>{label}
      </div>
      <div className="value" style={{ color: '#fff' }}>
        {value}
        {unit && <span className="unit" style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  );
}
