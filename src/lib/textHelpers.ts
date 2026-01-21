import { type LanguageKey, type LanguageVal, AVAILABLE_LANGUAGES } from '@/config/schemas';

export const capitalizeFirstChar = (text: string) => text[0].toUpperCase() + text.slice(1);

export const fromIsoLangToKeyLang = (key: LanguageKey): LanguageVal => AVAILABLE_LANGUAGES[key];
