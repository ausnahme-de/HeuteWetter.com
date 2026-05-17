// src/app/api/weather/route.ts
// API route for client-side geocoding search
// Proxies Open-Meteo geocoding to avoid any CORS issues
// No API key needed

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Fast edge function for geocoding

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const q = searchParams.get('q');

  if (action === 'geo' && q) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=de&format=json`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();

      return NextResponse.json(
        { results: data.results ?? [] },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    } catch {
      return NextResponse.json({ results: [] }, { status: 200 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
