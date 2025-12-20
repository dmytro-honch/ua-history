import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, I18nProvider } from '@/providors';
import { MainLayout } from '@/layouts/mainLayout';
import { HomePage } from '@/routes/history/homePage';
import { MapPage } from '@/routes/history/mapPage';
import { AboutPage } from '@/routes/history/aboutPage';
import { ContributePage } from '@/routes/contribute/contributePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'history',
        children: [
          {
            path: 'map',
            element: <MapPage />,
          },
          {
            path: 'about',
            element: <AboutPage />,
          },
        ],
      },
      {
        path: 'contribute',
        element: <ContributePage />,
      },
    ],
  },
]);

function App() {
  return (
    <I18nProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
