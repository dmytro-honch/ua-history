/**
 * Data source configuration
 *
 * Territories (large GeoJSON files) are hosted on Cloudflare R2
 * Other data (i18n, events) remains in /public/data/
 */

// Cloudflare R2 public URL for territories (via custom domain)
const CLOUDFLARE_R2_URL = 'https://ukr.fyi';

export const config = {
  // Territories hosted on Cloudflare R2 (large files)
  territories: {
    baseUrl: import.meta.env.VITE_TERRITORIES_URL || CLOUDFLARE_R2_URL,
    // For local development, you can override with:
    // VITE_TERRITORIES_URL=/data/territories
  },

  // Local data (i18n, events) - stays in /public/data/
  local: {
    baseUrl: import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL,
  },
} as const;

/**
 * Get full URL for territory file
 */
export const getTerritoryUrl = (filename: string): string => {
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${config.territories.baseUrl}/territories/${cleanFilename}`;
};

/**
 * Get full URL for local data (i18n, events)
 */
export const getLocalDataUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.local.baseUrl}/${cleanPath}`;
};

/**
 * Get i18n JSON URL
 */
export const getI18nUrl = (locale: string): string => {
  return getLocalDataUrl(`data/i18n/${locale}.json`);
};
