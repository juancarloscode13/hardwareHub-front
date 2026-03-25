import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { UsuarioRol } from '@/dto';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si se especifica, solo usuarios con ese rol exacto pueden acceder. */
  requiredRole?: UsuarioRol;
}

/**
 * Guardia de ruta que protege el acceso según autenticación y rol.
 *
 * Orden de decisión (estricto):
 * 1. isLoading  → null       (evita falso negativo mientras resuelve /auth/me)
 * 2. !isAuth    → /login     (sesión no activa)
 * 3. rol incorrecto → /      (autenticado pero sin el rol requerido)
 * 4. todo ok   → children
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}

