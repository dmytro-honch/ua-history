import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { internationalizationSchema, type Internationalization, AVAILABLE_LANGUAGES, type LanguageKey, isLanguageKey } from '@/config/schemas';
import { fetchJsonData } from '@/lib/loadData';

type I18nContextType = {
  lang: LanguageKey;
  text: Internationalization;
  setLang: (lang: LanguageKey) => void;
  isLoading: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

type I18nProviderProps = {
  children: React.ReactNode;
  defaultLang?: LanguageKey;
  storageKey?: string;
};

export function I18nProvider({ children, defaultLang = 'uk-UA', storageKey = 'app-language' }: I18nProviderProps) {
  const [lang, setLangState] = useState<LanguageKey>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored && isLanguageKey(stored) ? (stored as LanguageKey) : defaultLang;
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['i18n', lang],
    queryFn: () => {
      const fileName = AVAILABLE_LANGUAGES[lang];
      return fetchJsonData<Internationalization>(`/data/i18n/${fileName}.json`, internationalizationSchema);
    },
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(storageKey, lang);
  }, [lang, storageKey]);

  const setLang = (newLang: LanguageKey) => {
    setLangState(newLang);
  };

  if (isLoading) {
    return <div>Завантаження перекладів...</div>;
  }

  if (error) {
    throw new Error((error as Error).message);
  }

  return <I18nContext.Provider value={{ lang, setLang, text: data!, isLoading }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }
  return context;
};
