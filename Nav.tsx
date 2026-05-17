'use client';
// src/components/Nav.tsx
// Client component for interactivity (search, theme toggle)

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CITIES } from '@/lib/cities';
import type { GeoResult } from '@/lib/weather';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Nav() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(typeof CITIES[0] | GeoResult)[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  // Read initial theme from DOM (set by ThemeScript)
  useEffect(() => {
    const t = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    setTheme(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
    localStorage.setItem('hw-theme', next);
    setTheme(next);
  };

  // Search: first check local cities, then Open-Meteo geocoding
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setOpen(false); return; }
    const q = debouncedQuery.toLowerCase();

    // Local matches first (instant)
    const local = CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
    );
    if (local.length) {
      setResults(local);
      setOpen(true);
    }

    // Fetch geocoding in background
    setLoading(true);
    fetch(`/api/weather?action=geo&q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results?.length) {
          // Merge — prefer local matches at top
          const geoOnly = data.results.filter(
            (r: GeoResult) => !CITIES.find((c) => c.name.toLowerCase() === r.name.toLowerCase())
          );
          setResults([...local, ...geoOnly.slice(0, 3)]);
          setOpen(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((result: typeof CITIES[0] | GeoResult) => {
    // If it's a known local city, navigate to our city page
    const local = CITIES.find(
      (c) => c.name.toLowerCase() === ('name' in result ? result.name.toLowerCase() : '')
    );
    if (local) {
      router.push(`/wetter/${local.slug}`);
    } else if ('lat' in result) {
      // For external geo results, use their coords — fall back to search page
      const r = result as GeoResult;
      router.push(`/wetter/${r.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
    setQuery('');
    setOpen(false);
  }, [router]);

  // Keyboard navigation
  const [activeIdx, setActiveIdx] = useState(-1);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { handleSelect(results[activeIdx]); }
    if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1); }
  };

  return (
    <header className="nav" role="banner">
      <div className="container">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="Heute Wetter – Startseite">
            <span aria-hidden>⛅</span>
            Heute<span>Wetter</span>
          </Link>

          {/* Search */}
          <div className="search-wrap" ref={wrapRef} role="search">
            <span className="search-icon" aria-hidden>🔍</span>
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Stadt suchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Stadt suchen"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls="search-listbox"
              autoComplete="off"
              spellCheck={false}
            />
            {open && results.length > 0 && (
              <ul
                className="search-results"
                role="listbox"
                id="search-listbox"
                aria-label="Suchergebnisse"
              >
                {results.map((r, i) => {
                  const name = 'name' in r ? r.name : (r as any).name;
                  const sub = 'state' in r
                    ? `${(r as any).state}, Deutschland`
                    : `${'admin1' in r ? (r as any).admin1 + ', ' : ''}${'country' in r ? (r as any).country : ''}`;
                  return (
                    <li
                      key={i}
                      role="option"
                      aria-selected={i === activeIdx}
                      className="search-result-item"
                      style={{ background: i === activeIdx ? 'var(--bg-raised)' : undefined }}
                      onMouseDown={() => handleSelect(r)}
                    >
                      <span style={{ fontSize: '1rem' }}>📍</span>
                      <span>
                        <span className="city-name">{name}</span>
                        <br />
                        <span className="city-sub">{sub}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}
              title={theme === 'dark' ? 'Hell' : 'Dunkel'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
