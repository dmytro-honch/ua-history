import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { useState } from 'react';

const initState = !!localStorage.getItem('isHeaderOpened');
export function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(initState);
  const mainClassNames = isMenuOpen ? 'page bg-background header-active' : 'page bg-background';

  return (
    <div className={mainClassNames}>
      <Header isShow={isMenuOpen} handleToggle={setIsMenuOpen} />

      <main className="page__content">
        <Outlet />
      </main>
    </div>
  );
}
