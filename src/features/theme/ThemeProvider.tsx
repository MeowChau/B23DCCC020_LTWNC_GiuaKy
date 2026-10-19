import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';
import { applyTheme, readTheme } from './theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(readTheme);
  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    [],
  );
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
