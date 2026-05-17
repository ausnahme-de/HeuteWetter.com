/**
 * ═══════════════════════════════════════════════════════════════
 * HEUTE WETTER – script.js
 * Fetches weather from Open-Meteo (no API key required)
 * Geocoding from Open-Meteo Geocoding API
 * ═══════════════════════════════════════════════════════════════
 */

"use strict";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & CONFIGURATION
───────────────────────────────────────────────────────────────*/

const CONFIG = {
  geocodeUrl:    "https://geocoding-api.open-meteo.com/v1/search",
  weatherUrl:    "https://api.open-meteo.com/v1/forecast",
  defaultCity:   "Berlin",
  // How many hours to show in the hourly strip
  hourlyCount:   24,
};

/**
 * Maps Open-Meteo WMO weather code to a human-readable German label
 * and an emoji icon.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
const WMO_CODES = {
  0:  { label: "Klarer Himmel",             icon: "☀️" },
  1:  { label: "Überwiegend klar",           icon: "🌤️" },
  2:  { label: "Teilweise bewölkt",          icon: "⛅" },
  3:  { label: "Bedeckt",                    icon: "☁️" },
  45: { label: "Neblig",                     icon: "🌫️" },
  48: { label: "Reifnebel",                  icon: "🌫️" },
  51: { label: "Leichter Nieselregen",       icon: "🌦️" },
  53: { label: "Mäßiger Nieselregen",        icon: "🌦️" },
  55: { label: "Starker Nieselregen",        icon: "🌧️" },
  61: { label: "Leichter Regen",             icon: "🌧️" },
  63: { label: "Mäßiger Regen",              icon: "🌧️" },
  65: { label: "Starker Regen",              icon: "🌧️" },
  66: { label: "Leichter Eisregen",          icon: "🌨️" },
  67: { label: "Starker Eisregen",           icon: "🌨️" },
  71: { label: "Leichter Schneefall",        icon: "❄️" },
  73: { label: "Mäßiger Schneefall",         icon: "❄️" },
  75: { label: "Starker Schneefall",         icon: "❄️" },
  77: { label: "Schneekörner",               icon: "🌨️" },
  80: { label: "Leichte Regenschauer",       icon: "🌦️" },
  81: { label: "Mäßige Regenschauer",        icon: "🌧️" },
  82: { label: "Starke Regenschauer",        icon: "⛈️" },
  85: { label: "Leichte Schneeschauer",      icon: "🌨️" },
  86: { label: "Starke Schneeschauer",       icon: "🌨️" },
  95: { label: "Gewitter",                   icon: "⛈️" },
  96: { label: "Gewitter mit Hagel",         icon: "⛈️" },
  99: { label: "Starkes Gewitter mit Hagel", icon: "⛈️" },
};

const DAYS_DE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
                   "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

/* ─────────────────────────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────────────────────────────*/

const $ = (id) => document.getElementById(id);

const DOM = {
  searchForm:       $("search-form"),
  cityInput:        $("city-input"),
  loadingState:     $("loading-state"),
  errorState:       $("error-state"),
  errorMessage:     $("error-message"),
  retryBtn:         $("retry-btn"),
  weatherContent:   $("weather-content"),

  // Current weather
  currentHeading:   $("current-heading"),
  currentDate:      $("current-date"),
  currentIcon:      $("current-icon"),
  currentTemp:      $("current-temp"),
  currentDesc:      $("current-desc"),

  // Stats
  statFeels:        $("stat-feels"),
  statHumidity:     $("stat-humidity"),
  statWind:         $("stat-wind"),
  statRain:         $("stat-rain"),
  statUv:           $("stat-uv"),
  statVisibility:   $("stat-visibility"),

  // Forecasts
  hourlyTrack:      $("hourly-track"),
  dailyGrid:        $("daily-grid"),

  // Footer year
  footerYear:       $("footer-year"),
};

/* ─────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────────*/

let lastCity = CONFIG.defaultCity;

/* ─────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
───────────────────────────────────────────────────────────────*/

/**
 * Returns the WMO code object (icon + label), falling back gracefully.
 */
function getWmo(code) {
  return WMO_CODES[code] ?? { label: "Unbekannt", icon: "🌡️" };
}

/**
 * Formats a temperature number as "22°C"
 */
function formatTemp(temp) {
  if (temp == null) return "–";
  return `${Math.round(temp)}°C`;
}

/**
 * Formats an ISO datetime string to "HH:MM"
 */
function formatHour(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Returns a short German day name for an ISO date string.
 */
function getDayName(isoDate, isToday) {
  if (isToday) return "Heute";
  const d = new Date(isoDate + "T12:00:00");
  return DAYS_DE[d.getDay()];
}

/**
 * Formats a full date like "Mo, 17. Mai"
 */
function formatFullDate(date) {
  const day   = DAYS_DE[date.getDay()];
  const month = MONTHS_DE[date.getMonth()];
  return `${day}, ${date.getDate()}. ${month} ${date.getFullYear()}`;
}

/**
 * Converts km/h wind to a readable German string with Beaufort hint.
 */
function formatWind(kmh) {
  if (kmh == null) return "–";
  return `${Math.round(kmh)} km/h`;
}

/* ─────────────────────────────────────────────────────────────
   UI STATE MANAGEMENT
───────────────────────────────────────────────────────────────*/

function showLoading() {
  DOM.loadingState.hidden    = false;
  DOM.errorState.hidden      = true;
  DOM.weatherContent.hidden  = true;
}

function showError(message) {
  DOM.loadingState.hidden    = true;
  DOM.errorState.hidden      = false;
  DOM.weatherContent.hidden  = true;
  DOM.errorMessage.textContent = message;
}

function showWeather() {
  DOM.loadingState.hidden   = true;
  DOM.errorState.hidden     = true;
  DOM.weatherContent.hidden = false;
}

/* ─────────────────────────────────────────────────────────────
   API CALLS
───────────────────────────────────────────────────────────────*/

/**
 * Geocodes a city name → { lat, lon, displayName }
 * Uses the Open-Meteo Geocoding API (free, no key).
 */
async function geocodeCity(cityName) {
  const url = new URL(CONFIG.geocodeUrl);
  url.searchParams.set("name",     cityName);
  url.searchParams.set("count",    "1");
  url.searchParams.set("language", "de");
  url.searchParams.set("format",   "json");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Geocoding-Fehler: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Keine Stadt gefunden für „${cityName}". Bitte überprüfe die Schreibweise.`);
  }

  const result = data.results[0];
  return {
    lat:         result.latitude,
    lon:         result.longitude,
    displayName: result.name,
    country:     result.country,
  };
}

/**
 * Fetches full weather data from Open-Meteo for given coordinates.
 */
async function fetchWeather(lat, lon) {
  const url = new URL(CONFIG.weatherUrl);
  url.searchParams.set("latitude",       lat);
  url.searchParams.set("longitude",      lon);
  url.searchParams.set("timezone",       "Europe/Berlin");
  url.searchParams.set("forecast_days",  "7");

  // Current variables
  url.searchParams.set("current", [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "weather_code",
    "wind_speed_10m",
    "uv_index",
    "visibility",
    "precipitation",
  ].join(","));

  // Hourly variables
  url.searchParams.set("hourly", [
    "temperature_2m",
    "apparent_temperature",
    "weather_code",
    "precipitation_probability",
    "precipitation",
  ].join(","));

  // Daily variables
  url.searchParams.set("daily", [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max",
    "precipitation_sum",
    "wind_speed_10m_max",
    "uv_index_max",
  ].join(","));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Wetterdaten-Fehler: HTTP ${response.status}`);
  }

  return response.json();
}

/* ─────────────────────────────────────────────────────────────
   RENDER FUNCTIONS
───────────────────────────────────────────────────────────────*/

/**
 * Renders the "current weather" card at the top.
 */
function renderCurrent(weather, cityName) {
  const cur = weather.current;
  const wmo = getWmo(cur.weather_code);

  DOM.currentHeading.textContent  = cityName;
  DOM.currentDate.textContent     = formatFullDate(new Date());
  DOM.currentIcon.textContent     = wmo.icon;
  DOM.currentIcon.setAttribute("aria-label", wmo.label);
  DOM.currentTemp.textContent     = formatTemp(cur.temperature_2m);
  DOM.currentTemp.setAttribute("aria-label", `${formatTemp(cur.temperature_2m)} Celsius`);
  DOM.currentDesc.textContent     = wmo.label;

  // Stats
  DOM.statFeels.textContent       = formatTemp(cur.apparent_temperature);
  DOM.statHumidity.textContent    = `${cur.relative_humidity_2m} %`;
  DOM.statWind.textContent        = formatWind(cur.wind_speed_10m);
  DOM.statRain.textContent        = `${cur.precipitation ?? 0} mm`;
  DOM.statUv.textContent          = cur.uv_index != null ? `${Math.round(cur.uv_index)}` : "–";
  DOM.statVisibility.textContent  = cur.visibility != null
    ? `${(cur.visibility / 1000).toFixed(0)} km`
    : "–";
}

/**
 * Renders the horizontal hourly forecast strip.
 * Shows the next `CONFIG.hourlyCount` hours starting from now.
 */
function renderHourly(weather) {
  const { time, temperature_2m, weather_code, precipitation_probability } = weather.hourly;

  const now         = new Date();
  const currentHour = now.getHours();

  // Find the index of the current hour
  let startIndex = 0;
  for (let i = 0; i < time.length; i++) {
    const t = new Date(time[i]);
    if (t >= now) {
      startIndex = i;
      break;
    }
  }

  const fragment = document.createDocumentFragment();
  const end = Math.min(startIndex + CONFIG.hourlyCount, time.length);

  for (let i = startIndex; i < end; i++) {
    const t    = new Date(time[i]);
    const wmo  = getWmo(weather_code[i]);
    const isNow = i === startIndex;

    const card = document.createElement("div");
    card.className = `hourly-card${isNow ? " is-now" : ""}`;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label",
      `${isNow ? "Jetzt" : formatHour(time[i])}: ${wmo.label}, ${formatTemp(temperature_2m[i])}`
    );

    card.innerHTML = `
      <span class="h-time">${isNow ? "Jetzt" : formatHour(time[i])}</span>
      <span class="h-icon" aria-hidden="true">${wmo.icon}</span>
      <span class="h-temp">${formatTemp(temperature_2m[i])}</span>
      <span class="h-rain" aria-label="${precipitation_probability[i] ?? 0}% Regenwahrscheinlichkeit">
        💧 ${precipitation_probability[i] ?? 0}%
      </span>
    `;

    fragment.appendChild(card);
  }

  DOM.hourlyTrack.innerHTML = "";
  DOM.hourlyTrack.appendChild(fragment);
}

/**
 * Renders the 7-day daily forecast grid.
 */
function renderDaily(weather) {
  const {
    time,
    weather_code,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_probability_max,
  } = weather.daily;

  const fragment = document.createDocumentFragment();

  time.forEach((isoDate, i) => {
    const isToday = i === 0;
    const wmo     = getWmo(weather_code[i]);
    const dayName = getDayName(isoDate, isToday);
    const rainPct = precipitation_probability_max[i] ?? 0;

    const card = document.createElement("div");
    card.className = `daily-card${isToday ? " is-today" : ""}`;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label",
      `${dayName}: ${wmo.label}, ${formatTemp(temperature_2m_max[i])} / ${formatTemp(temperature_2m_min[i])}`
    );

    card.innerHTML = `
      <span class="d-day">${dayName}</span>
      <span class="d-icon" aria-hidden="true">${wmo.icon}</span>
      <span class="d-high">${formatTemp(temperature_2m_max[i])}</span>
      <span class="d-low">${formatTemp(temperature_2m_min[i])}</span>
      <span class="d-rain" aria-label="${rainPct}% Regenwahrscheinlichkeit">
        💧 ${rainPct}%
      </span>
    `;

    fragment.appendChild(card);
  });

  DOM.dailyGrid.innerHTML = "";
  DOM.dailyGrid.appendChild(fragment);
}

/* ─────────────────────────────────────────────────────────────
   MAIN LOAD FUNCTION
───────────────────────────────────────────────────────────────*/

/**
 * Main entry point: geocode the city, fetch weather, render all panels.
 */
async function loadWeather(cityName) {
  if (!cityName || !cityName.trim()) return;

  lastCity = cityName.trim();
  DOM.cityInput.value = lastCity;

  showLoading();

  try {
    // 1. Geocode
    const geo = await geocodeCity(lastCity);

    // 2. Fetch weather
    const weather = await fetchWeather(geo.lat, geo.lon);

    // 3. Render
    renderCurrent(weather, geo.displayName);
    renderHourly(weather);
    renderDaily(weather);

    // 4. Show
    showWeather();

    // 5. Update page title & URL for SEO / bookmarking
    document.title = `Wetter ${geo.displayName} – HeuteWetter`;
    updateURL(geo.displayName);

    // 6. Smooth scroll to weather on mobile
    if (window.innerWidth < 768) {
      document.getElementById("current-section")?.scrollIntoView({ behavior: "smooth" });
    }

  } catch (err) {
    console.error("[HeuteWetter]", err);
    showError(err.message || "Die Wetterdaten konnten nicht geladen werden. Bitte versuche es erneut.");
  }
}

/* ─────────────────────────────────────────────────────────────
   URL MANAGEMENT
───────────────────────────────────────────────────────────────*/

/**
 * Updates the browser URL bar without a full page reload.
 * This supports bookmarking and SEO crawling of city-specific URLs.
 */
function updateURL(cityName) {
  try {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("city", cityName);
    window.history.replaceState({ city: cityName }, "", newUrl.toString());
  } catch (_) {
    // Silently fail if history API is unavailable
  }
}

/**
 * Reads the city from the URL query string (?city=Hamburg)
 * so direct links and city pages work.
 */
function getCityFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("city") || null;
  } catch (_) {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   EVENT LISTENERS
───────────────────────────────────────────────────────────────*/

// Search form submit
DOM.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = DOM.cityInput.value.trim();
  if (city) {
    loadWeather(city);
  }
});

// Quick city pills (hero section)
document.querySelectorAll(".city-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    loadWeather(btn.dataset.city);
  });
});

// City cards (cities grid) — intercept link clicks
document.querySelectorAll(".city-card[data-city]").forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    loadWeather(card.dataset.city);
  });
});

// Retry button
DOM.retryBtn.addEventListener("click", () => {
  loadWeather(lastCity);
});

/* ─────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUT
───────────────────────────────────────────────────────────────*/

// Press "/" anywhere to focus the search input (like GitHub / Google)
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    document.activeElement !== DOM.cityInput
  ) {
    e.preventDefault();
    DOM.cityInput.focus();
    DOM.cityInput.select();
  }
});

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────────*/

function init() {
  // Set footer year
  if (DOM.footerYear) {
    DOM.footerYear.textContent = new Date().getFullYear();
  }

  // Determine startup city:
  // 1. ?city= URL param  (city pages, bookmarks)
  // 2. Default city (Berlin)
  const startCity = getCityFromURL() || CONFIG.defaultCity;
  loadWeather(startCity);
}

// Start the app when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
