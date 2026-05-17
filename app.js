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
  2: ["Teilweise bewoelkt", "clouds"],
  3: ["Bedeckt", "clouds"],
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
  source: document.querySelector("#location-source"),
  story: document.querySelector("#weather-story"),
  sceneIcon: document.querySelector("#scene-weather-icon"),
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
  loadPreciseLocation(true);
});

elements.weatherCard.addEventListener("pointermove", (event) => {
  const box = elements.weatherCard.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  elements.weatherCard.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
  elements.weatherCard.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
});

elements.weatherCard.addEventListener("pointerleave", () => {
  elements.weatherCard.style.setProperty("--tilt-x", "0deg");
  elements.weatherCard.style.setProperty("--tilt-y", "0deg");
});

async function loadAutomaticLocation() {
  setLoading(true);
  elements.source.textContent = "Standort wird erkannt";
  elements.note.textContent = "Genauer Standort wird zuerst abgefragt...";

  try {
    await loadPreciseLocation(false);
  } catch (error) {
    console.error(error);
    await loadApproximateLocation();
  } finally {
    setLoading(false);
  }
}

async function loadPreciseLocation(isManualRequest = false) {
  if (!navigator.geolocation) {
    throw new Error("Geolocation not supported");
  }

  setLoading(true);
  elements.note.textContent = isManualRequest
    ? "Genauer Standort wird abgefragt..."
    : elements.note.textContent;

  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const location = await getNearestLocationName(latitude, longitude);
    const forecast = await getForecast(latitude, longitude);
    renderForecast(location, forecast, "precise");
    elements.input.value = displayCityName(location.name);
    elements.note.textContent = `Genauer Standort: ${displayCityName(
      location.name,
    )}.`;
  } catch (error) {
    if (isManualRequest) {
      elements.note.textContent =
        "Der genaue Standort wurde nicht erlaubt. Das ungef\u00e4hre Standortwetter bleibt aktiv.";
      console.error(error);
      return;
    }
    throw error;
  } finally {
    setLoading(false);
  }
}

async function loadApproximateLocation() {
  elements.source.textContent = "Ungef\u00e4hr erkannt";
  elements.note.textContent =
    "Genauer Standort wurde nicht erlaubt. Ungef\u00e4hre Erkennung wird genutzt...";

  try {
    const location = await getApproximateLocation();
    const forecast = await getForecast(location.latitude, location.longitude);
    renderForecast(location, forecast, "approximate");
    elements.input.value = displayCityName(location.name);
    elements.note.textContent = `Ungef\u00e4hr erkannt: ${displayCityName(location.name)}.`;
  } catch (error) {
    console.error(error);
    elements.note.textContent =
      "Standort konnte nicht erkannt werden. Berlin wird als Standard angezeigt.";
    await loadCity("Berlin");
  }
}

async function loadCity(city) {
  if (!city) return;

  setLoading(true);
  elements.note.textContent = "Die aktuelle Vorhersage wird gesucht...";

  try {
    const location = await getLocation(normalizeCity(city));
    const forecast = await getForecast(location.latitude, location.longitude);
    renderForecast(location, forecast, "search");
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
      enableHighAccuracy: true,
      maximumAge: 120000,
      timeout: 15000,
    });
  });
}

async function getApproximateLocation() {
  const providers = [
    async () => {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("ipapi failed");
      const data = await response.json();
      if (!data.latitude || !data.longitude) throw new Error("ipapi incomplete");
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.city || "Ihr Standort",
      };
    },
    async () => {
      const response = await fetch("https://ipwho.is/");
      if (!response.ok) throw new Error("ipwho failed");
      const data = await response.json();
      if (!data.success || !data.latitude || !data.longitude) {
        throw new Error("ipwho incomplete");
      }
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.city || "Ihr Standort",
      };
    },
  ];

  for (const provider of providers) {
    try {
      return await provider();
    } catch (error) {
      console.warn(error);
    }
  }

  throw new Error("No location provider worked");
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
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "7",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/dwd-icon?${params}`);

  if (!response.ok) throw new Error("Forecast request failed");
  return response.json();
}

function renderForecast(location, forecast, source = "search") {
  const current = forecast.current;
  const [condition] = weatherCodes[current.weather_code] ?? ["Wechselhaftes Wetter", "Wetter"];

  elements.place.textContent = displayCityName(location.name);
  elements.condition.textContent = condition;
  elements.temp.textContent = Math.round(current.temperature_2m);
  elements.feels.textContent = `${Math.round(current.apparent_temperature)}\u00b0C`;
  elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.sceneIcon.className = `scene-weather-icon weather-visual ${getWeatherVisualClass(
    current.weather_code,
  )}`;

  const currentHourIndex = nearestHourIndex(forecast.hourly.time, current.time);
  const rainChance = forecast.hourly.precipitation_probability[currentHourIndex] ?? 0;
  elements.rain.textContent = `${rainChance}%`;
  elements.source.textContent = getSourceLabel(source);
  elements.story.textContent = buildWeatherStory(
    condition,
    current.temperature_2m,
    rainChance,
    current.wind_speed_10m,
    source,
  );

  renderHourly(forecast.hourly, currentHourIndex);
  renderDaily(forecast.daily);
  drawScene(current.weather_code, current.temperature_2m);

  elements.updated.textContent = `Aktualisiert um ${hourFormatter.format(new Date(current.time))}`;
  document.title = `${displayCityName(location.name)} Wetter heute | Haute Wetter Deutschland`;
}

function getSourceLabel(source) {
  if (source === "precise") return "Genauer Standort aktiv";
  if (source === "approximate") return "Ungef\u00e4hr erkannt";
  return "Stadt-Suche";
}

function buildWeatherStory(condition, temperature, rainChance, windSpeed, source) {
  const rainText =
    rainChance >= 60
      ? "Regenschirm einplanen."
      : rainChance >= 30
        ? "Regen ist moeglich."
        : "Regen ist eher unwahrscheinlich.";
  const windText = windSpeed >= 35 ? "Es wird windig." : "Der Wind bleibt moderat.";
  const sourceText =
    source === "approximate"
      ? "Die automatische Erkennung ist ungef\u00e4hr; f\u00fcr mehr Genauigkeit den Standort erlauben."
      : "Die Werte werden regelmaessig aktualisiert.";

  return `${condition}, etwa ${Math.round(temperature)}\u00b0C. ${rainText} ${windText} ${sourceText}`;
}

function weatherIconMarkup(weatherCode) {
  const visualClass = getWeatherVisualClass(weatherCode);
  return `
    <span class="weather-symbol weather-visual ${visualClass}" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;
}

function getWeatherVisualClass(weatherCode) {
  if ([0, 1].includes(weatherCode)) return "sunny";
  if ([2, 3].includes(weatherCode)) return "clouds";
  if ([45, 48].includes(weatherCode)) return "fog";
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(weatherCode)) return "rain";
  if ([82, 95, 96, 99].includes(weatherCode)) return "storm";
  if ([71, 73, 75].includes(weatherCode)) return "snow";
  return "clouds";
}

function renderHourly(hourly, startIndex) {
  elements.hourly.innerHTML = "";
  const hours = hourly.time.slice(startIndex, startIndex + 6);

  hours.forEach((time, offset) => {
    const index = startIndex + offset;
    const card = document.createElement("article");
    card.className = "hour-card";
    card.innerHTML = `
      <span>${hourFormatter.format(new Date(time))}</span>
      ${weatherIconMarkup(hourly.weather_code[index])}
      <strong>${Math.round(hourly.temperature_2m[index])}\u00b0C</strong>
      <span>Regen ${hourly.precipitation_probability[index] ?? 0}%</span>
    `;
    elements.hourly.append(card);
  });
}

function renderDaily(daily) {
  elements.days.innerHTML = "";

  daily.time.forEach((time, index) => {
    const [condition] = weatherCodes[daily.weather_code[index]] ?? ["Wetter", "Wetter"];
    const card = document.createElement("article");
    card.className = "day-card";
    card.innerHTML = `
      <span>${dateFormatter.format(new Date(time))}</span>
      ${weatherIconMarkup(daily.weather_code[index])}
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
  const stormy = [82, 95, 96, 99].includes(weatherCode);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, stormy ? "#253b57" : rainy ? "#7197a9" : cloudy ? "#9fc7d5" : "#66c7ed");
  sky.addColorStop(0.56, stormy ? "#45617c" : rainy ? "#a9c1c8" : "#b9e0df");
  sky.addColorStop(1, rainy || stormy ? "#d8ddd0" : "#ffe4a6");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(width - 112, 62, 8, width - 112, 62, 140);
  glow.addColorStop(0, snowy || stormy ? "rgba(255,255,255,0.9)" : "rgba(255,231,126,0.95)");
  glow.addColorStop(0.42, "rgba(255,213,106,0.26)");
  glow.addColorStop(1, "rgba(255,213,106,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.fillStyle = snowy || stormy ? "#eef9ff" : "#f8d56a";
  context.beginPath();
  context.arc(width - 90, 70, 42, 0, Math.PI * 2);
  context.fill();

  drawCloud(context, 94, 78, cloudy || rainy || stormy ? 1 : 0.64, 1.05);
  drawCloud(context, 266, 104, rainy || stormy ? 0.96 : 0.64, 1.2);
  drawCloud(context, 452, 84, cloudy ? 0.9 : 0.48, 0.92);

  if (rainy || snowy) {
    context.strokeStyle = snowy ? "#ffffff" : stormy ? "#9ad7ff" : "#356d86";
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

  if (stormy) {
    context.fillStyle = "#ffd56a";
    context.beginPath();
    context.moveTo(width - 190, 74);
    context.lineTo(width - 144, 74);
    context.lineTo(width - 174, 120);
    context.lineTo(width - 132, 120);
    context.lineTo(width - 210, 190);
    context.lineTo(width - 174, 132);
    context.lineTo(width - 214, 132);
    context.closePath();
    context.fill();
  }

  const backHill = context.createLinearGradient(0, 150, 0, height);
  backHill.addColorStop(0, "#4a8e74");
  backHill.addColorStop(1, "#1f5648");
  context.fillStyle = backHill;
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(0, 178);
  context.bezierCurveTo(140, 142, 238, 198, 372, 166);
  context.bezierCurveTo(492, 138, 548, 184, width, 150);
  context.lineTo(width, height);
  context.fill();

  const frontHill = context.createLinearGradient(0, 178, 0, height);
  frontHill.addColorStop(0, "#2f745c");
  frontHill.addColorStop(1, "#143e37");
  context.fillStyle = frontHill;
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(0, 206);
  context.bezierCurveTo(122, 180, 244, 218, 360, 196);
  context.bezierCurveTo(486, 172, 552, 210, width, 184);
  context.lineTo(width, height);
  context.fill();
}

function drawCloud(context, x, y, opacity, scale = 1) {
  context.save();
  context.globalAlpha = opacity;
  context.translate(x, y);
  context.scale(scale, scale);
  const cloud = context.createLinearGradient(0, -58, 0, 44);
  cloud.addColorStop(0, "#ffffff");
  cloud.addColorStop(1, "#dbecef");
  context.fillStyle = cloud;
  context.shadowColor = "rgba(21, 48, 58, 0.18)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 10;
  context.beginPath();
  context.arc(0, 0, 34, Math.PI * 0.85, Math.PI * 1.95);
  context.arc(36, -22, 36, Math.PI, Math.PI * 2);
  context.arc(78, 0, 32, Math.PI * 1.15, Math.PI * 0.15);
  context.lineTo(78, 28);
  context.lineTo(0, 28);
  context.closePath();
  context.fill();
  context.restore();
}

loadAutomaticLocation();
