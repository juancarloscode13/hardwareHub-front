// Hook personalizado para acceder al tema desde cualquier componente
import { useContext } from 'react';
import { ThemeContext } from '@/context/theme-context.ts';
import type { ThemeContextValue } from '@/context/theme-context.ts';

/** Devuelve { theme, toggleTheme }. Lanza error si se usa fuera de ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }
  return ctx;
}
