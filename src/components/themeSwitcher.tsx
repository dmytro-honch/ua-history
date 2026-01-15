import { MoonIcon } from '@/components/icons/moonIcon';
import { SunIcon } from '@/components/icons/sunIcon';
import { useTheme } from '@/providers/themeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button className="theme-switcher" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
