import { createContext, useContext, useEffect, useState } from 'react';
import uk from 'data/i18n/uk.json';
import en from 'data/i18n/en.json';

const languages = {
  'uk-UA': uk,
  'en-US': en,
};

export type LangugeKey = keyof typeof languages;
type Languge = typeof uk;

type I18nProviderProps = {
  children: React.ReactNode;
  defaultKey?: LangugeKey;
  storageKey?: string;
};

type I18nProviderState = {
  lang: LangugeKey;
  text: Languge;
  setLang: (theme: LangugeKey) => void;
};

const initialState: I18nProviderState = {
  lang: 'uk-UA',
  text: uk,
  setLang: () => null,
};

const I18nProviderContext = createContext<I18nProviderState>(initialState);

export function I18nProvider({ children, defaultKey = 'uk-UA', storageKey = 'language', ...props }: I18nProviderProps) {
  const defaultLangKey = (localStorage.getItem(storageKey) || defaultKey) as LangugeKey;
  const [langKey, setLangKey] = useState<LangugeKey>(() => defaultLangKey);

  useEffect(() => {
    const root = window.document.documentElement;

    if (root.lang === '') {
      const systemTheme = window.navigator.language;

      root.lang = systemTheme;
      return;
    }

    root.lang = langKey;
  }, [langKey]);

  const value = {
    lang: langKey,
    setLang: (langKey: LangugeKey) => {
      localStorage.setItem(storageKey, langKey);
      setLangKey(langKey);
    },
    text: languages[langKey],
  };

  return (
    <I18nProviderContext.Provider {...props} value={value}>
      {children}
    </I18nProviderContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nProviderContext);

  if (context === undefined) throw new Error('useI18n must be used within a I18nProvider');

  return context;
};
