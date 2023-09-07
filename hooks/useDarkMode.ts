import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [theme, setTheme] = useState('light');

  const colorTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.theme = colorTheme;
  }, [colorTheme, theme]);
  return [colorTheme, setTheme];
};

export default useDarkMode;
