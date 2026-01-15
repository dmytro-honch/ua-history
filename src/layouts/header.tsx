import { Link, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from '@/components/themeSwitcher';
import { useI18n } from '@/providers';
import type { ChangeEvent } from 'react';

const defineNavClass = (path: string, pathname: string) => {
  if (!path) return 'navigation__link';

  const isActive = pathname === path || pathname.startsWith(path + '/');
  return isActive ? 'navigation__link navigation__link--active' : 'navigation__link';
};

export function Header() {
  const { pathname } = useLocation();
  const { text, setLang, lang } = useI18n();
  const { header } = text || {};

  if (!header) return null;

  const onLangChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLang(event.target.value as 'uk-UA');
  };

  return (
    <header className="page__header--wrapper" id="app-header">
      <div className="page__header page__content--fixed">
        <Link to="/" className="logo">
          Ukraine History
        </Link>

        <nav className="navigation__wrapper">
          <Link to="/" className={defineNavClass('/', pathname)}>
            {header.nav.home}
          </Link>
          <Link to="/history/map" className={defineNavClass('/history/map', pathname)}>
            {header.nav.map}
          </Link>
          <Link to="/history/about" className={defineNavClass('/history/about', pathname)}>
            {header.nav.about}
          </Link>
          <Link to="/contribute" className={defineNavClass('/contribute', pathname)}>
            {header.nav.contribute}
          </Link>
        </nav>

        <div className="page__header--controls">
          <select onChange={onLangChange} name="language" value={lang}>
            {Object.entries(header.languages).map(([langKey, text]) => (
              <option key={langKey} value={langKey} disabled={lang === langKey}>
                {text as string}
              </option>
            ))}
          </select>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
