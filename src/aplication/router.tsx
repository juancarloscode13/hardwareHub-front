import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';


// ── Guard inverso ─────────────────────────────────────────────────────────
// Redirige a /dashboard si el usuario ya está autenticado.
// Evita que un usuario logueado vea /login o /registro.
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────
export default createBrowserRouter([
  // Pública
  {
    path: '/',
    element: <LandingPage />,
  },
  // Pública con guard inverso
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/registro',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  // Protegida: cualquier usuario autenticado
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  // Protegida: solo ROL_ADMIN
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ROL_ADMIN">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
  // anadir rutas
]);


