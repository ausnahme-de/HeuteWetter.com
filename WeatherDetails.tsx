// src/components/WeatherDetails.tsx
// Server component — detailed weather metrics in a card grid

import type { CurrentWeather } from '@/lib/weather';
import { windDirection } from '@/lib/weather';

interface Props {
  current: CurrentWeather;
}

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

export function WeatherDetails({ current }: Props) {
  const uvPct = Math.min((current.uvIndex / 12) * 100, 100);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
      }}
      role="list"
      aria-label="Ausführliche Wetterdaten"
    >
      <DetailCard
        icon="💧"
        label="Luftfeuchtigkeit"
        value={`${current.humidity}%`}
        sub={current.humidity > 70 ? 'Feucht' : current.humidity > 40 ? 'Komfortabel' : 'Trocken'}
      />
      <DetailCard
        icon="💨"
        label="Windgeschwindigkeit"
        value={`${current.windSpeed} km/h`}
        sub={windDirection(current.windDirection)}
      />
      <DetailCard
        icon="🧭"
        label="Luftdruck"
        value={`${current.pressure} hPa`}
        sub={current.pressure > 1013 ? 'Hochdruck' : 'Tiefdruck'}
      />
      <DetailCard
        icon="👁️"
        label="Sichtweite"
        value={`${current.visibility} km`}
        sub={current.visibility > 10 ? 'Gut' : current.visibility > 4 ? 'Mäßig' : 'Schlecht'}
      />
      <DetailCard
        icon="☁️"
        label="Bewölkung"
        value={`${current.cloudCover}%`}
        sub={current.cloudCover > 80 ? 'Bedeckt' : current.cloudCover > 40 ? 'Teilweise' : 'Heiter'}
      />
      <DetailCard
        icon="🌧️"
        label="Niederschlag"
        value={`${current.precipitation} mm`}
        sub={`${current.precipitationProbability}% Wahrsch.`}
      />

      {/* UV Index with visual bar */}
      <div
        className="card card-sm"
        role="listitem"
        aria-label={`UV-Index: ${current.uvIndex}, ${uvLabel(current.uvIndex)}`}
        style={{ gridColumn: 'span 2' }}
      >
        <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }} aria-hidden>☀️</div>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          UV-Index
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: uvColor(current.uvIndex) }}>
            {current.uvIndex}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{uvLabel(current.uvIndex)}</span>
        </div>
        {/* UV gradient bar */}
        <div className="uv-bar" aria-hidden role="img" aria-label={`UV-Index ${current.uvIndex} von 12`}>
          <div
            className="uv-indicator"
            style={{ left: `${uvPct}%` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          <span>Niedrig</span>
          <span>Hoch</span>
          <span>Extrem</span>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon, label, value, sub,
}: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div
      className="card card-sm"
      role="listitem"
      aria-label={`${label}: ${value}, ${sub}`}
    >
      <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }} aria-hidden>{icon}</div>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.1rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  );
}
