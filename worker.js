/**
 * Cloudflare Worker for Café El Gato geo-blocking
 *
 * This worker detects if the connection comes from allowed countries.
 * If it's NOT from an allowed country, it redirects to the geo-blocking page.
 * If it's from an allowed country, it allows access to the main store.
 *
 * Features:
 * - Country-based geo-blocking
 * - Path-based bypass configuration
 * - Header-based bypass (X-Allow-Bypass: true)
 * - Redirect loop prevention
 */

export default {
  async fetch(request, env) {
    // Configuration
    const ALLOWED_COUNTRIES = ['ES']; // Spain - add more countries like ['ES', 'PT', 'FR']
    const GEO_BLOCK_URL = 'https://ouch.cafeelgato.com';

    // Paths that bypass geo-blocking (accessible from any country)
    const BYPASS_PATHS = [
      // '/api',        // API endpoints
      // '/webhook',    // Webhooks
      // '/health',     // Health checks
      // '/status',     // Status pages
      // Add more paths as needed
    ];

    // Get visitor information
    const country = request.cf?.country;
    const url = new URL(request.url);
    const path = url.pathname;

    // Check for bypass header
    const bypassHeader = request.headers.get('X-Allow-Bypass');
    const hasValidBypassHeader = bypassHeader === 'true';

    // If bypass header is present and valid, allow access regardless of country
    if (hasValidBypassHeader) {
      return fetch(request);
    }

    // Check if current path should bypass geo-blocking
    const shouldBypass = BYPASS_PATHS.some(bypassPath =>
      path.startsWith(bypassPath)
    );

    // If path should bypass geo-blocking, allow access regardless of country
    if (shouldBypass) {
      return fetch(request);
    }

    // Apply geo-blocking to all other paths (/* - everything else)
    if (!ALLOWED_COUNTRIES.includes(country)) {
      // Avoid redirect loop if already on geo-blocking page
      if (!url.hostname.includes('ouch.cafeelgato.com')) {
        return Response.redirect(GEO_BLOCK_URL, 302);
      }
    }

    // If from allowed country or already on geo-blocking page, continue normally
    return fetch(request);
  }
}
