// Contexto de React para el tema de la aplicación (claro/oscuro)
import { createContext } from 'react';
import type { Theme } from './theme-provider';

/** Valor que expone el contexto del tema */
export interface ThemeContextValue {
  theme: Theme;          // Tema actual: 'light' | 'dark'
  toggleTheme: () => void; // Función para alternar entre temas
}

// El valor inicial es undefined; se lanza error si se usa fuera del provider
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
