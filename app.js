const popularCities = [
  "Berlin",
  "Hamburg",
  "Muenchen",
  "Koeln",
  "Frankfurt",
  "Stuttgart",
  "Duesseldorf",
  "Leipzig",
];

const weatherCodes = {
  0: ["Klarer Himmel", "Sonne"],
  1: ["Ueberwiegend klar", "Sonne"],
  2: ["Teilweise bewoelkt", "Wolken"],
  3: ["Bedeckt", "Wolken"],
  45: ["Nebel", "Nebel"],
  48: ["Reifnebel", "Nebel"],
  51: ["Leichter Nieselregen", "Regen"],
  53: ["Nieselregen", "Regen"],
  55: ["Starker Nieselregen", "Regen"],
  61: ["Leichter Regen", "Regen"],
  63: ["Regen", "Regen"],
  65: ["Starker Regen", "Regen"],
  71: ["Leichter Schnee", "Schnee"],
  73: ["Schnee", "Schnee"],
  75: ["Starker Schneefall", "Schnee"],
  80: ["Regenschauer", "Regen"],
  81: ["Regenschauer", "Regen"],
  82: ["Starke Schauer", "Gewitter"],
  95: ["Gewitter", "Gewitter"],
  96: ["Gewitter mit Hagel", "Gewitter"],
  99: ["Gewitter mit Hagel", "Gewitter"],
};

const fallbackCities = {
  Berlin: { latitude: 52.52, longitude: 13.405, name: "Berlin" },
  Hamburg: { latitude: 53.551, longitude: 9.9937, name: "Hamburg" },
  Muenchen: { latitude: 48.137, longitude: 11.575, name: "Muenchen" },
  Koeln: { latitude: 50.9375, longitude: 6.9603, name: "Koeln" },
  Duesseldorf: { latitude: 51.2277, longitude: 6.7735, name: "Duesseldorf" },
  Munich: { latitude: 48.137, longitude: 11.575, name: "Muenchen" },
  Cologne: { latitude: 50.9375, longitude: 6.9603, name: "Koeln" },
  Dusseldorf: { latitude: 51.2277, longitude: 6.7735, name: "Duesseldorf" },
};

const elements = {
  form: document.querySelector("#weather-form"),
  input: document.querySelector("#city-input"),
  note: document.querySelector("#form-note"),
  place: document.querySelector("#place-name"),
  condition: document.querySelector("#condition-text"),
  temp: document.querySelector("#current-temp"),
  feels: document.querySelector("#feels-like"),
  rain: document.querySelector("#rain-chance"),
  wind: document.querySelector("#wind-speed"),
  humidity: document.querySelector("#humidity"),
  hourly: document.querySelector("#hourly-list"),
  days: document.querySelector("#days-grid"),
  updated: document.querySelector("#updated-time"),
  cityButtons: document.querySelector("#city-buttons"),
  locationButton: document.querySelector("#location-button"),
  weatherCard: document.querySelector(".weather-card"),
  canvas: document.querySelector("#weather-scene"),
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const hourFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

popularCities.forEach((city) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = displayCityName(city);
  button.addEventListener("click", () => loadCity(city));
  elements.cityButtons.append(button);
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadCity(elements.input.value.trim());
});

elements.locationButton.addEventListener("click", () => {
  loadVisitorLocation(true);
});

async function loadVisitorLocation(isManualRequest = false) {
  if (!navigator.geolocation) {
    elements.note.textContent =
      "Ihr Browser unterstuetzt keine Standortabfrage. Bitte geben Sie eine Stadt ein.";
    return loadCity("Berlin");
  }

  setLoading(true);
  elements.note.textContent = isManualRequest
    ? "Standort wird abgefragt..."
    : "Standortwetter wird vorbereitet...";

  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const location = await getNearestLocationName(latitude, longitude);
    const forecast = await getForecast(latitude, longitude);
    renderForecast(location, forecast);
    elements.input.value = displayCityName(location.name);
    elements.note.textContent = `Wetter f\u00fcr Ihren Standort: ${displayCityName(
      location.name,
    )}.`;
  } catch (error) {
    elements.note.textContent =
      "Standort wurde nicht erlaubt. Es wird stattdessen Berlin angezeigt.";
    console.error(error);
    await loadCity("Berlin");
  } finally {
    setLoading(false);
  }
}

async function loadCity(city) {
  if (!city) return;

  setLoading(true);
  elements.note.textContent = "Die aktuelle Vorhersage wird gesucht...";

  try {
    const location = await getLocation(normalizeCity(city));
    const forecast = await getForecast(location.latitude, location.longitude);
    renderForecast(location, forecast);
    elements.input.value = displayCityName(location.name);
    elements.note.textContent = `Wetter f\u00fcr ${displayCityName(location.name)}, Deutschland.`;
  } catch (error) {
    elements.note.textContent =
      "Diese Stadt wurde nicht gefunden. Versuchen Sie Berlin, Hamburg, Muenchen oder eine andere deutsche Stadt.";
    console.error(error);
  } finally {
    setLoading(false);
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 600000,
      timeout: 10000,
    });
  });
}

async function getNearestLocationName(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    language: "de",
    format: "json",
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`);

  if (!response.ok) {
    return { latitude, longitude, name: "Ihr Standort" };
  }

  const data = await response.json();
  const match = data.results?.[0];

  return {
    latitude,
    longitude,
    name: match?.name ?? "Ihr Standort",
  };
}

async function getLocation(city) {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "de",
    format: "json",
    countryCode: "DE",
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

  if (!response.ok) throw new Error("Location lookup failed");

  const data = await response.json();
  const match = data.results?.[0] ?? fallbackCities[city];

  if (!match) throw new Error("City not found");

  return {
    latitude: match.latitude,
    longitude: match.longitude,
    name: match.name,
  };
}

async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone: "Europe/Berlin",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "7",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) throw new Error("Forecast request failed");
  return response.json();
}

function renderForecast(location, forecast) {
  const current = forecast.current;
  const [condition] = weatherCodes[current.weather_code] ?? ["Wechselhaftes Wetter", "Wetter"];

  elements.place.textContent = displayCityName(location.name);
  elements.condition.textContent = condition;
  elements.temp.textContent = Math.round(current.temperature_2m);
  elements.feels.textContent = `${Math.round(current.apparent_temperature)}\u00b0C`;
  elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;

  const currentHourIndex = nearestHourIndex(forecast.hourly.time, current.time);
  const rainChance = forecast.hourly.precipitation_probability[currentHourIndex] ?? 0;
  elements.rain.textContent = `${rainChance}%`;

  renderHourly(forecast.hourly, currentHourIndex);
  renderDaily(forecast.daily);
  drawScene(current.weather_code, current.temperature_2m);

  elements.updated.textContent = `Aktualisiert um ${hourFormatter.format(new Date(current.time))}`;
  document.title = `${displayCityName(location.name)} Wetter heute | Haute Wetter Deutschland`;
}

function renderHourly(hourly, startIndex) {
  elements.hourly.innerHTML = "";
  const hours = hourly.time.slice(startIndex, startIndex + 6);

  hours.forEach((time, offset) => {
    const index = startIndex + offset;
    const [, symbol] = weatherCodes[hourly.weather_code[index]] ?? ["Wetter", "Wetter"];
    const card = document.createElement("article");
    card.className = "hour-card";
    card.innerHTML = `
      <span>${hourFormatter.format(new Date(time))}</span>
      <span class="weather-symbol">${symbol}</span>
      <strong>${Math.round(hourly.temperature_2m[index])}\u00b0C</strong>
      <span>Regen ${hourly.precipitation_probability[index] ?? 0}%</span>
    `;
    elements.hourly.append(card);
  });
}

function renderDaily(daily) {
  elements.days.innerHTML = "";

  daily.time.forEach((time, index) => {
    const [condition, symbol] = weatherCodes[daily.weather_code[index]] ?? ["Wetter", "Wetter"];
    const card = document.createElement("article");
    card.className = "day-card";
    card.innerHTML = `
      <span>${dateFormatter.format(new Date(time))}</span>
      <span class="weather-symbol">${symbol}</span>
      <strong>${Math.round(daily.temperature_2m_max[index])}\u00b0 / ${Math.round(
        daily.temperature_2m_min[index],
      )}\u00b0C</strong>
      <span>${condition}</span>
      <span>Regen bis ${daily.precipitation_probability_max[index] ?? 0}%</span>
    `;
    elements.days.append(card);
  });
}

function nearestHourIndex(times, currentTime) {
  const target = new Date(currentTime).getTime();
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const distance = Math.abs(new Date(time).getTime() - target);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function setLoading(isLoading) {
  elements.weatherCard.classList.toggle("is-loading", isLoading);
}

function normalizeCity(city) {
  return city
    .replaceAll("ü", "ue")
    .replaceAll("Ü", "Ue")
    .replaceAll("ö", "oe")
    .replaceAll("Ö", "Oe")
    .replaceAll("ä", "ae")
    .replaceAll("Ä", "Ae")
    .replaceAll("ß", "ss");
}

function displayCityName(city) {
  return city
    .replaceAll("Muenchen", "M\u00fcnchen")
    .replaceAll("Munich", "M\u00fcnchen")
    .replaceAll("Koeln", "K\u00f6ln")
    .replaceAll("Cologne", "K\u00f6ln")
    .replaceAll("Duesseldorf", "D\u00fcsseldorf")
    .replaceAll("Dusseldorf", "D\u00fcsseldorf");
}

function drawScene(weatherCode, temperature) {
  const canvas = elements.canvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const rainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const cloudy = [2, 3, 45, 48].includes(weatherCode);
  const snowy = [71, 73, 75].includes(weatherCode);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, rainy ? "#7f9aa8" : cloudy ? "#a9c6cf" : "#7fc5dd");
  sky.addColorStop(1, rainy ? "#d7ddd8" : "#f1e5b5");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#f8d56a";
  context.beginPath();
  context.arc(width - 90, 70, 42, 0, Math.PI * 2);
  context.fill();

  drawCloud(context, 120, 80, cloudy || rainy ? 1 : 0.72);
  drawCloud(context, 295, 105, rainy ? 0.95 : 0.62);
  drawCloud(context, 470, 86, cloudy ? 0.85 : 0.45);

  if (rainy || snowy) {
    context.strokeStyle = snowy ? "#ffffff" : "#356d86";
    context.lineWidth = snowy ? 2 : 3;
    for (let i = 0; i < 34; i += 1) {
      const x = 40 + i * 17;
      const y = 132 + ((i * 19) % 64);
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(snowy ? x + 1 : x - 8, y + 24);
      context.stroke();
    }
  }

  context.fillStyle = "#315f48";
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(0, 190);
  context.bezierCurveTo(140, 160, 220, 205, 350, 176);
  context.bezierCurveTo(480, 148, 545, 188, width, 160);
  context.lineTo(width, height);
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "700 18px Inter, sans-serif";
  context.fillText(`${Math.round(temperature)}\u00b0C in Deutschland`, 28, 214);
}

function drawCloud(context, x, y, opacity) {
  context.save();
  context.globalAlpha = opacity;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(x, y, 34, Math.PI * 0.85, Math.PI * 1.95);
  context.arc(x + 36, y - 22, 36, Math.PI, Math.PI * 2);
  context.arc(x + 78, y, 32, Math.PI * 1.15, Math.PI * 0.15);
  context.lineTo(x + 78, y + 28);
  context.lineTo(x, y + 28);
  context.closePath();
  context.fill();
  context.restore();
}

loadVisitorLocation();
