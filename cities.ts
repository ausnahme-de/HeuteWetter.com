// lib/cities.ts
// Central city registry. Add new cities here to automatically get:
// - Indexable city page at /wetter/[slug]
// - Internal linking
// - SEO metadata
// - Sitemap entries

export interface City {
  slug: string;           // URL slug, e.g. "berlin"
  name: string;           // Display name, e.g. "Berlin"
  nameGenitive: string;   // German genitive, e.g. "Berlins"
  state: string;          // Federal state
  lat: number;
  lon: number;
  timezone: string;
  population: number;     // For ranking/linking logic
  description: string;    // SEO meta description snippet
  localFact: string;      // Unique local content for each city page
}

export const CITIES: City[] = [
  {
    slug: 'berlin',
    name: 'Berlin',
    nameGenitive: 'Berlins',
    state: 'Berlin',
    lat: 52.5200,
    lon: 13.4050,
    timezone: 'Europe/Berlin',
    population: 3645000,
    description: 'Aktuelles Wetter in Berlin – Temperatur, Regen, Wind und 7-Tage-Vorhersage für die Bundeshauptstadt.',
    localFact: 'Berlin liegt im Nordostdeutschen Tiefland und hat ein gemäßigt-kontinentales Klima mit warmen Sommern und kalten Wintern.',
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    nameGenitive: 'Hamburgs',
    state: 'Hamburg',
    lat: 53.5753,
    lon: 10.0153,
    timezone: 'Europe/Berlin',
    population: 1841000,
    description: 'Wetter Hamburg heute – aktuelle Temperatur, Regenvorhersage und Windstärke für die Hansestadt.',
    localFact: 'Hamburg liegt an der Elbe und ist für sein maritimes Klima bekannt – mit häufigem Wind und vergleichsweise viel Niederschlag.',
  },
  {
    slug: 'muenchen',
    name: 'München',
    nameGenitive: 'Münchens',
    state: 'Bayern',
    lat: 48.1351,
    lon: 11.5820,
    timezone: 'Europe/Berlin',
    population: 1488000,
    description: 'Wetter München – Vorhersage für heute, morgen und 7 Tage. Temperatur, Sonnenstunden und Alpine Wetterlage.',
    localFact: 'München liegt am Alpenrand und profitiert von über 1.700 Sonnenstunden pro Jahr – mehr als Hamburg oder Berlin.',
  },
  {
    slug: 'koeln',
    name: 'Köln',
    nameGenitive: 'Kölns',
    state: 'Nordrhein-Westfalen',
    lat: 50.9333,
    lon: 6.9500,
    timezone: 'Europe/Berlin',
    population: 1084000,
    description: 'Wetter Köln aktuell – Temperaturen, Niederschlag und Wind am Rhein. 7-Tage-Vorhersage für Köln.',
    localFact: 'Köln am Rhein hat ein ozeanisches Klima mit milden Wintern und mäßig warmen Sommern.',
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt',
    nameGenitive: 'Frankfurts',
    state: 'Hessen',
    lat: 50.1109,
    lon: 8.6821,
    timezone: 'Europe/Berlin',
    population: 773000,
    description: 'Wetter Frankfurt am Main – aktuelle Wetterdaten, Stundentabelle und Wochenvorhersage.',
    localFact: 'Frankfurt am Main gilt als wärmste Großstadt Deutschlands und hat besonders heiße Sommer durch den Wärmeinseleffekt.',
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    nameGenitive: 'Stuttgarts',
    state: 'Baden-Württemberg',
    lat: 48.7758,
    lon: 9.1829,
    timezone: 'Europe/Berlin',
    population: 634830,
    description: 'Wetter Stuttgart heute und die nächsten 7 Tage – Kessel-Klima, Temperatur und Regenradar.',
    localFact: 'Stuttgart liegt in einem Talkessel, was zu Inversionslagen und smogähnlichen Bedingungen im Winter führen kann.',
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    nameGenitive: 'Düsseldorfs',
    state: 'Nordrhein-Westfalen',
    lat: 51.2217,
    lon: 6.7762,
    timezone: 'Europe/Berlin',
    population: 619477,
    description: 'Wetter Düsseldorf – Vorhersage für die Landeshauptstadt NRW. Temperatur, Wind und Regen am Rhein.',
    localFact: 'Düsseldorf am Rhein hat ein typisch atlantisch geprägtes Klima mit milden, feuchten Wintern und mäßig warmen Sommern.',
  },
  {
    slug: 'leipzig',
    name: 'Leipzig',
    nameGenitive: 'Leipzigs',
    state: 'Sachsen',
    lat: 51.3397,
    lon: 12.3731,
    timezone: 'Europe/Berlin',
    population: 601519,
    description: 'Wetter Leipzig aktuell – Temperatur, Sonnenstunden und 7-Tage-Prognose für die Messestadt.',
    localFact: 'Leipzig hat ein kontinentales Klima mit vergleichsweise geringen Niederschlägen und heißen Sommern.',
  },
  {
    slug: 'nuernberg',
    name: 'Nürnberg',
    nameGenitive: 'Nürnbergs',
    state: 'Bayern',
    lat: 49.4521,
    lon: 11.0767,
    timezone: 'Europe/Berlin',
    population: 515543,
    description: 'Wetter Nürnberg – aktuelle Wettervorhersage, Temperatur und Wind für die Franken-Metropole.',
    localFact: 'Nürnberg liegt im Mittelfränkischen Becken und hat ein etwas trockeneres kontinentales Klima als andere bayerische Städte.',
  },
  {
    slug: 'dresden',
    name: 'Dresden',
    nameGenitive: 'Dresdens',
    state: 'Sachsen',
    lat: 51.0504,
    lon: 13.7373,
    timezone: 'Europe/Berlin',
    population: 554649,
    description: 'Wetter Dresden – Vorhersage für das Elbtal, Temperatur, Niederschlag und Sonnenschein.',
    localFact: 'Dresden liegt im Elbtal und hat mit dem Elbsandsteingebirge in der Nähe interessante Wetterphänomene durch Föhn und Stau.',
  },
  {
    slug: 'hannover',
    name: 'Hannover',
    nameGenitive: 'Hannovers',
    state: 'Niedersachsen',
    lat: 52.3759,
    lon: 9.7320,
    timezone: 'Europe/Berlin',
    population: 535932,
    description: 'Wetter Hannover aktuell – Temperaturen, Regenprognose und Windwerte für Niedersachsens Landeshauptstadt.',
    localFact: 'Hannover hat ein ozeanisch geprägtes Klima und liegt zentral in Norddeutschland zwischen den Küsteneinflüssen und dem Kontinentalklima des Ostens.',
  },
  {
    slug: 'bremen',
    name: 'Bremen',
    nameGenitive: 'Bremens',
    state: 'Bremen',
    lat: 53.0793,
    lon: 8.8017,
    timezone: 'Europe/Berlin',
    population: 563000,
    description: 'Wetter Bremen – aktuelle Wetterinformationen für das Stadtstaat an der Weser.',
    localFact: 'Bremen hat ein maritimes Klima mit viel Wind und Regen durch die Nähe zur Nordsee.',
  },
];

// Quick lookup by slug
export const CITY_MAP: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c])
);

// Top cities for internal linking on city pages
export const TOP_CITIES = CITIES.filter((c) => c.population > 700000);

// For static generation
export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return CITY_MAP[slug];
}
