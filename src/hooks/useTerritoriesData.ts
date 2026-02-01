import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getTerritoryUrl } from '../config/data';
import type { GeoJSONFeature, GeoJSONFeatureCollection } from '@/lib/mapRenderer';

export type GeoJSONData = GeoJSONFeature | GeoJSONFeatureCollection;

/**
 * Fetch GeoJSON from Cloudflare R2
 */
async function fetchTerritory(filename: string): Promise<GeoJSONData> {
  const url = getTerritoryUrl(filename);

  const response = await fetch(url, {
    // Enable CORS for cross-origin requests to Cloudflare
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`Failed to load territory ${filename}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Hook for loading territory GeoJSON data from Cloudflare R2
 *
 * @param filename - GeoJSON filename (e.g., '1.geojson', '2.geojson')
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: ukraine, isLoading } = useTerritoryData('1.geojson');
 * const { data: europe } = useTerritoryData('2.geojson');
 * ```
 */
export function useTerritoryData(
  filename: string,
  options?: {
    enabled?: boolean;
  }
): UseQueryResult<GeoJSONData, Error> {
  return useQuery({
    queryKey: ['territory', filename],
    queryFn: () => fetchTerritory(filename),
    // Cache for 1 hour (territories rarely change)
    gcTime: 1000 * 60 * 60,
    // Consider data fresh for 30 minutes
    staleTime: 1000 * 60 * 30,
    // Retry 3 times on failure
    retry: 3,
    // Optional: disable query
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook for loading multiple territories at once
 *
 * @example
 * ```tsx
 * const { ukraine, europe, isLoading } = useTerritories();
 * ```
 */
export function useTerritories() {
  const ukraineQuery = useTerritoryData('1.geojson');
  const europeQuery = useTerritoryData('2.geojson');

  return {
    ukraine: ukraineQuery.data as GeoJSONFeatureCollection | undefined,
    europe: europeQuery.data as GeoJSONFeatureCollection | undefined,
    isLoading: ukraineQuery.isLoading || europeQuery.isLoading,
    isError: ukraineQuery.isError || europeQuery.isError,
    error: ukraineQuery.error || europeQuery.error,
    // Individual queries for more control
    ukraineQuery,
    europeQuery,
  };
}
