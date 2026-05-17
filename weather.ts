// lib/weather.ts
// Open-Meteo integration — no API key required.
// Docs: https://open-meteo.com/en/docs
// Free, open data. Attribution required in footer.

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

// WMO Weather Code to German description + icon
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

// Main fetch function — called server-side in Next.js page components
// Open-Meteo: free, no key, CORS-friendly, caches aggressively
export async function fetchWeather(lat: number, lon: number, timezone = 'Europe/Berlin'): Promise<WeatherData> {
  const base = 'https://api.open-meteo.com/v1/forecast';
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone,
    // Current weather variables
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'relative_humidity_2m',
      'precipitation',
      'precipitation_probability',
      'uv_index',
      'visibility',
      'surface_pressure',
      'cloud_cover',
      'is_day',
    ].join(','),
    // Hourly for next 24h
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    hourly_units: 'undefined', // not a real param, just documentation
    // Daily 7-day
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    forecast_days: '7',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });

  // Remove the fake param we added for docs
  params.delete('hourly_units');

  const url = `${base}?${params}`;

  const res = await fetch(url, {
    // ISR: revalidate every 30 minutes
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const raw = await res.json();

  // Parse current
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
    visibility: Math.round((c.visibility ?? 0) / 1000), // m → km
    pressure: Math.round(c.surface_pressure ?? 0),
    cloudCover: c.cloud_cover ?? 0,
    isDay: c.is_day === 1,
    sunrise: d0.sunrise[0],
    sunset: d0.sunset[0],
    updatedAt: new Date().toISOString(),
  };

  // Parse hourly (next 24 entries)
  const hourly: HourlyForecast[] = raw.hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: t,
    temperature: Math.round(raw.hourly.temperature_2m[i]),
    weatherCode: raw.hourly.weather_code[i],
    precipitationProbability: raw.hourly.precipitation_probability[i] ?? 0,
    windSpeed: Math.round(raw.hourly.wind_speed_10m[i]),
    isDay: raw.hourly.is_day?.[i] === 1,
  }));

  // Parse daily
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

// Geocoding via Open-Meteo's geocoding API — also no key required
export interface GeoResult {
  name: string;
  country: string;
  admin1: string; // state/region
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
