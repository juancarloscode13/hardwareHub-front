import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { UsuarioRol } from '@/dto';

interface ProtectedRouteProps {
  children: React.ReactNode;
  
  requiredRole?: UsuarioRol;
}


export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}

