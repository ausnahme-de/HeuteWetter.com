// src/components/HourlyForecast.tsx
// Server component — renders horizontal scrollable hourly strip

import type { HourlyForecast as HourlyData } from '@/lib/weather';
import { getWeatherMeta } from '@/lib/weather';

interface Props {
  hours: HourlyData[];
}

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
            <div
              key={hour.time}
              className={`hourly-item${isNow ? ' active' : ''}`}
              role="listitem"
              aria-label={`${h}:00 Uhr: ${hour.temperature}°C, ${meta.label}`}
            >
              <div className="h-time">
                {isNow ? 'Jetzt' : `${String(h).padStart(2, '0')}:00`}
              </div>
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
