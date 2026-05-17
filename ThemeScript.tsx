// src/components/ThemeScript.tsx
// Inlined script that runs before React hydration to set theme class
// This prevents the "flash of wrong theme"

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('hw-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.add(theme);
      } catch(e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
