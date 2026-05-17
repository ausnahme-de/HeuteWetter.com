// src/app/not-found.tsx
import Link from 'next/link';
import { CITIES } from '@/lib/cities';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌧️</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
        Diese Seite gibt es leider nicht. Vielleicht suchst du nach dem Wetter in einer bestimmten Stadt?
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <Link href="/" className="btn btn-primary">Zur Startseite</Link>
      </div>
      <p className="section-title" style={{ marginBottom: '1rem' }}>Beliebte Städte</p>
      <div className="city-link-grid" style={{ justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {CITIES.slice(0, 8).map((c) => (
          <Link key={c.slug} href={`/wetter/${c.slug}`} className="city-link-pill">
            📍 {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
