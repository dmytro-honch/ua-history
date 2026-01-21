import { Link, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from '@/components/themeSwitcher';
import { useI18n } from '@/providers';
import { Select } from '@/components/formElements/select';
import type { LanguageKey } from '@/config/schemas';
import { capitalizeFirstChar } from '@/lib/textHelpers';
import { useState } from 'react';
import { HeaderToggle } from '@/components/headerToggle';

const defineNavClass = (path: string, pathname: string) => {
  if (!path) return 'navigation__link';

  const isActive = pathname === path || pathname.startsWith(path + '/');
  return isActive ? 'navigation__link navigation__link--active' : 'navigation__link';
};

const initState = !!localStorage.getItem('isHeaderOpened');
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(initState);
  const { pathname } = useLocation();
  const { text, setLang, lang } = useI18n();
  const { header } = text || {};

  const options = Object.entries(header.languages).map(([value, text]): { value: LanguageKey; text: string } => ({
    value: value as LanguageKey,
    text: text,
  }));

  if (!header) return null;

  const onLangChange = (value: (typeof options)[number]['value']) => {
    setLang(value);
  };

  const currentClassName = isMenuOpen ? 'page__header show' : 'page__header';

  const toggleHeader = () => {
    setIsMenuOpen((prev) => {
      if (prev) {
        localStorage.removeItem('isHeaderOpened');
        return false;
      }

      localStorage.setItem('isHeaderOpened', 'true');
      return true;
    });
  };

  return (
    <div className="page__header--container">
      <HeaderToggle isOpen={isMenuOpen} toogle={toggleHeader} />

      <header className={currentClassName}>
        <nav className="navigation__wrapper">
          <Link to="/" className={defineNavClass('/', pathname)}>
            {capitalizeFirstChar(header.nav.home)}
          </Link>
          <Link to="/history/map" className={defineNavClass('/history/map', pathname)}>
            {capitalizeFirstChar(header.nav.map)}
          </Link>
          <Link to="/history/about" className={defineNavClass('/history/about', pathname)}>
            {capitalizeFirstChar(header.nav.about)}
          </Link>
          <Link to="/contribute" className={defineNavClass('/contribute', pathname)}>
            {capitalizeFirstChar(header.nav.contribute)}
          </Link>
        </nav>

        <div className="page__header--controls">
          <Select options={options} current={lang} onChange={onLangChange} label={header.language} />
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
}
