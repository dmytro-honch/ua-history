import { Outlet } from 'react-router-dom';
import { Header } from './header';

export function MainLayout() {
  return (
    <div className="page bg-background">
      <Header />

      <main className="page__content">
        <Outlet />
      </main>
    </div>
  );
}
