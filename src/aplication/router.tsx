import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LandingPage from '@/pages/LandingPage';
import TermsPage from '@/pages/TermsPage';
import DashboardPage from '@/pages/DashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

// ── Stub temporal ─────────────────────────────────────────────────────────
const AdminPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-hw-page">
    <p className="font-heading text-2xl text-hw-title">Admin (en construcción)</p>
  </div>
);

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
  // Pública: términos y condiciones (accesible sin autenticación, abre en nueva pestaña desde registro)
  {
    path: '/terminos',
    element: <TermsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
  // anadir rutas
]);


