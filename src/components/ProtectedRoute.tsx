// Componente ProtectedRoute: encapsula logica y presentacion de aplicacion.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteLoadingScreen } from '@/components/RouteLoadingScreen';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { UsuarioRol } from '@/dto';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si se especifica, el usuario también debe tener este rol */
  requiredRole?: UsuarioRol;
}

/**
 * Envuelve rutas privadas. Mientras carga la sesión no renderiza nada.
 * Redirige a /login si no autenticado, o a / si no tiene el rol requerido.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <RouteLoadingScreen
        title="Verificando acceso"
        description="Estamos validando tu sesión antes de mostrar el contenido privado."
      />
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}



