import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get('skymart_theme', 'dark'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storage.set('skymart_theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
