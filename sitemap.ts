// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { CITIES } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://heute-wetter.de';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
    },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${base}/wetter/${city.slug}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: city.population > 1000000 ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
