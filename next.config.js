/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable ISR globally; each city page revalidates independently
  // No external image domains needed (using inline SVG icons)
  experimental: {
    // Improve build performance
  },
  // Compress responses
  compress: true,
  // Power-by header removal for cleaner responses
  poweredByHeader: false,
  // Strict headers for security and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  // Redirects for common German spelling variants
  async redirects() {
    return [
      { source: '/wetter/münchen', destination: '/wetter/muenchen', permanent: true },
      { source: '/wetter/koeln', destination: '/wetter/koeln', permanent: false },
      { source: '/wetter/frankfurt-am-main', destination: '/wetter/frankfurt', permanent: true },
    ];
  },
};

module.exports = nextConfig;
