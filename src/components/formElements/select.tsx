import type { LanguageKey } from '@/config/schemas';
import { useI18n } from '@/providers';

export const LanguageSelect = () => {
  const { lang, setLang, text } = useI18n();

  return (
    <div className="relative inline-block w-48">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>

      <div className="relative">
        <select id="language-select" value={lang} onChange={(e) => setLang(e.target.value as LanguageKey)} className="">
          <option value="uk-UA">{text.header.languages['uk-UA']}</option>
          <option value="en-US">{text.header.languages['en-US']}</option>
        </select>

        <div className="">*</div>
      </div>
    </div>
  );
};
