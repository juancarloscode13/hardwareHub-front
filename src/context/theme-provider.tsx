// Provider que gestiona el tema oscuro/claro y lo persiste en el DOM
import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './theme-context';

export type Theme = 'light' | 'dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado del tema; inicia en oscuro por defecto
  const [theme, setTheme] = useState<Theme>('dark');

  // Sincroniza la clase CSS 'dark' en el elemento raíz cada vez que cambia el tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Alterna entre modo oscuro y claro
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
