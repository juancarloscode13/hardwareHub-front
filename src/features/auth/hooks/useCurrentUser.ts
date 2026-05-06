// Hook que expone el usuario autenticado con flags de estado derivados
import { useMe } from './useAuth';
import type { UsuarioResponseDto } from '@/dto';

/**
 * Devuelve el usuario actual, si está autenticado y si es administrador.
 * isLoading es true mientras se carga la sesión inicial.
 */
export function useCurrentUser(): {
  user: UsuarioResponseDto | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
} {
  const { data: user, isLoading, isFetching } = useMe();

  return {
    user,
    isAuthenticated: user !== undefined,
    isAdmin: user?.rol === 'ROL_ADMIN',
    // Considera cargando también si está fetcheando y aún no hay datos (primera carga)
    isLoading: isLoading || (isFetching && user === undefined),
  };
}
