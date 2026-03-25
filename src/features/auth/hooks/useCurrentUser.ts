import { useMe } from './useAuth';
import type { UsuarioResponseDto } from '@/dto';

/**
 * Fuente de verdad única para el estado de autenticación.
 * Envuelve useMe() y expone una API limpia y reutilizable.
 *
 * No introduce Context, estado local ni llamadas HTTP adicionales.
 * React Query actúa como caché global — equivalente a estado global sin createContext.
 */
export function useCurrentUser(): {
  user: UsuarioResponseDto | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
} {
  const { data: user, isLoading } = useMe();

  return {
    user,
    isAuthenticated: user !== undefined,
    isAdmin: user?.rol === 'ROL_ADMIN',
    isLoading,
  };
}

