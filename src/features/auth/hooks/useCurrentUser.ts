import { useMe } from './useAuth';
import type { UsuarioResponseDto } from '@/dto';

/**
 * Fuente de verdad única para el estado de autenticación.
 * Envuelve useMe() y expone una API limpia y reutilizable.
 *
 * ── Por qué se combina isLoading con isFetching ────────────────────────
 * TanStack Query v5: isLoading = isPending && isFetching.
 * isPending = (status === 'pending'), es decir, NUNCA se ha resuelto con éxito.
 *
 * Problema: tras un login, /auth/me estaba previamente en estado 'error' (401
 * antes de autenticarse). Al llamar invalidateQueries, la query refetchea pero
 * su status sigue siendo 'error' (no 'pending'), por lo que isLoading = false
 * aunque el fetch esté en vuelo y data sea undefined.
 *
 * Consecuencia sin este fix:
 *   ProtectedRoute → isLoading=false, isAuthenticated=false → <Navigate to="/login">
 *   /auth/me completa → PublicOnlyRoute ve isAuthenticated=true → <Navigate to="/dashboard">
 *   El admin acaba en /dashboard en lugar de /admin.
 *
 * Fix: considerar "cargando" también cuando isFetching=true y no hay datos válidos.
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
    // Esperar también cuando hay un refetch en vuelo sin datos válidos aún
    // (cubre el caso error→refetch tras invalidateQueries post-login)
    isLoading: isLoading || (isFetching && user === undefined),
  };
}

