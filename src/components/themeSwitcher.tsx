import { useTheme } from '@/providers/themeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button className="theme-switcher round-button" onClick={toggleTheme} aria-label="Toggle theme">
      <svg
        className={theme}
        viewBox="0 0 32 32"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 3 16 L 29 16" className="line-1" />
        <path d="M 6 6 L 26 26" className="line-2" />
        <path d="M 16 3 L 16 29" className="line-1" />
        <path d="M 6 26 L 26 6" className="line-2" />

        <path d="M 16 8 A 8 8 0 1 1 15.99 8 Z" className="circle" />
        <path d="M 16 8 C 10 12, 11 23, 23.5 20" className="semicircle" />
      </svg>
    </button>
  );
}
