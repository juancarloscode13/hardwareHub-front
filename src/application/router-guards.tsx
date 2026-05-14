import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteLoadingScreen } from '@/components/RouteLoadingScreen';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

type RouteGuardProps = {
  children: ReactNode;
};

/** Redirige a /dashboard o /admin si el usuario ya está autenticado */
export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useCurrentUser();
  if (isLoading) {
    return (
      <RouteLoadingScreen
        title="Preparando la página"
        description="Estamos comprobando si ya tienes una sesión activa."
      />
    );
  }
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

/** Redirige a /login si no autenticado, o a /admin si es administrador */
export function UserDashboardRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useCurrentUser();
  if (isLoading) {
    return (
      <RouteLoadingScreen
        title="Cargando dashboard"
        description="Estamos recuperando tu sesión antes de entrar al panel principal."
      />
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
