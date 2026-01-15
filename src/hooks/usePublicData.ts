import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

const getPublicUrl = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL;
  const cleanBase = baseUrl === '/' ? '' : baseUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${cleanBase}/${cleanPath}`;
};

async function fetchAndValidate<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const url = getPublicUrl(path);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching ${path}: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return schema.parse(json);
}

export function usePublicData<T>(path: string, schema: z.ZodType<T>): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ['public-data', path],
    queryFn: () => fetchAndValidate(path, schema),
    gcTime: 1000 * 60 * 60,
  });
}
