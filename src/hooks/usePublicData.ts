import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';
import { getLocalDataUrl, getI18nUrl } from '../config/data';

/**
 * Fetch and validate local data (i18n, events)
 * For territories, use useTerritoryData hook instead
 */
async function fetchAndValidate<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const url = getLocalDataUrl(path);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching ${path}: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return schema.parse(json);
}

/**
 * Hook for loading local public data with Zod validation
 * Used for i18n and other local JSON files
 *
 * @example
 * ```tsx
 * const { data: translations } = usePublicData('data/i18n/uk.json', i18nSchema);
 * ```
 */
export function usePublicData<T>(path: string, schema: z.ZodType<T>): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ['public-data', path],
    queryFn: () => fetchAndValidate(path, schema),
    gcTime: 1000 * 60 * 60,
  });
}

/**
 * Hook specifically for i18n data
 *
 * @example
 * ```tsx
 * const { data: translations } = useI18nData('uk', i18nSchema);
 * ```
 */
export function useI18nData<T>(locale: string, schema: z.ZodType<T>): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ['i18n', locale],
    queryFn: async () => {
      const url = getI18nUrl(locale);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching i18n/${locale}.json: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      return schema.parse(json);
    },
    gcTime: 1000 * 60 * 60,
    staleTime: Infinity,
  });
}
