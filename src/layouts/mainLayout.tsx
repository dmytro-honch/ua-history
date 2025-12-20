import { Outlet } from 'react-router-dom';
import { Header } from './header';

export function MainLayout() {
  return (
    <div className="page bg-background">
      <Header />

      <main className="page__content">
        <Outlet />
      </main>

      <footer className="page__footer" id="app-footer">
        <p>An open-source, crowdsourced interactive library of Ukrainian history</p>
      </footer>
    </div>
  );
}
