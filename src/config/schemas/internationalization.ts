import { z } from 'zod';

export const internationalizationSchema = z.object({
  header: z.object({
    language: z.string(),
    languages: z.object({
      'uk-UA': z.string(),
      'en-US': z.string(),
    }),
    nav: z.object({
      home: z.string(),
      map: z.string(),
      about: z.string(),
      contribute: z.string(),
    }),
  }),
  keys: z.object({
    json: z.object({
      'uk-UA': z.string(),
      'en-US': z.string(),
    }),
  }),
  footer: z.object({
    copyright: z.string(),
  }),
  dates: z.object({
    ac: z.string(),
    bc: z.string(),
  }),
  map: z.object({
    controls: z.object({
      'era-select-label': z.string(),
    }),
  }),
});

export type Internationalization = z.infer<typeof internationalizationSchema>;

export const AVAILABLE_LANGUAGES = {
  'uk-UA': 'uk',
  'en-US': 'en',
} as const;

export type LanguageKey = keyof typeof AVAILABLE_LANGUAGES;
export type LanguageVal = (typeof AVAILABLE_LANGUAGES)[LanguageKey];

export function isLanguageKey(key: string): key is LanguageKey {
  return key in AVAILABLE_LANGUAGES;
}
