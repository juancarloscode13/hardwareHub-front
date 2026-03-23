import { useContext } from 'react';
import { ThemeContext } from '@/context/theme-context.ts';
import type { ThemeContextValue } from '@/context/theme-context.ts';

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }
  return ctx;
}
