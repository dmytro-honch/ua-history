import { z } from 'zod';

const getPublicUrl = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL;
  const cleanBase = baseUrl === '/' ? '' : baseUrl;
  return `${cleanBase}${path}`;
};

export async function fetchJsonData<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const url = getPublicUrl(path);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load data from ${url}: ${response.statusText}`);
  }

  const data = await response.json();

  return schema.parse(data);
}
