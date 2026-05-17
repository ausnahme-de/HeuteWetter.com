// src/components/DailyForecast.tsx
// Server component — 7-day forecast with temperature bar

import type { DailyForecast as DailyData } from '@/lib/weather';
import { getWeatherMeta } from '@/lib/weather';

interface Props {
  days: DailyData[];
}

export function DailyForecast({ days }: Props) {
  // Calculate global min/max for relative bar sizing
  const allMax = Math.max(...days.map((d) => d.tempMax));
  const allMin = Math.min(...days.map((d) => d.tempMin));
  const range = allMax - allMin || 1;

  return (
    <div className="daily-grid" role="list" aria-label="7-Tage-Vorhersage">
      {days.map((day, i) => {
        const meta = getWeatherMeta(day.weatherCode, true);
        const isToday = i === 0;

        // Bar positioning
        const minPct = ((day.tempMin - allMin) / range) * 100;
        const maxPct = ((day.tempMax - allMin) / range) * 100;
        const fillWidth = maxPct - minPct;

        return (
          <div
            key={day.date}
            className="daily-row"
            role="listitem"
            aria-label={`${isToday ? 'Heute' : day.weekday}: ${day.tempMin}° bis ${day.tempMax}°C, ${meta.label}`}
          >
            {/* Day name */}
            <div
              className="day-name"
              style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--text-primary)' : undefined }}
            >
              {isToday ? 'Heute' : day.weekday}
            </div>

            {/* Icon */}
            <div className="day-icon" aria-hidden>{meta.icon}</div>

            {/* Temperature bar */}
            <div className="day-bar-wrap">
              <span className="t-min">{day.tempMin}°</span>
              <div className="temp-bar" aria-hidden>
                <div
                  className="temp-bar-fill"
                  style={{
                    marginLeft: `${minPct}%`,
                    width: `${Math.max(fillWidth, 8)}%`,
                  }}
                />
              </div>
              <span className="t-max">{day.tempMax}°</span>
            </div>

            {/* Rain probability */}
            <div className="daily-rain">
              {day.precipitationProbabilityMax > 0 ? (
                <span aria-label={`Regen: ${day.precipitationProbabilityMax}%`}>
                  💧 {day.precipitationProbabilityMax}%
                </span>
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
