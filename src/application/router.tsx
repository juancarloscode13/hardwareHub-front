// Configuración de rutas de la aplicación con React Router v6
// Incluye rutas públicas, dashboard privado y zona de admin
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage        from '@/pages/LoginPage';
import RegisterPage     from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import LandingPage      from '@/pages/LandingPage';
import DashboardLayout  from '@/pages/DashboardLayout';
import AdminPage        from '@/pages/AdminPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

import ForoPage          from '@/pages/dashboard/ForoPage';
import PerfilPage        from '@/pages/dashboard/PerfilPage';
import AyudaPage         from '@/pages/dashboard/AyudaPage';
import CompararPage      from '@/pages/dashboard/CompararPage';
import NoticiasPage      from '@/pages/dashboard/NoticiasPage';
import AprenderPage      from '@/pages/dashboard/AprenderPage';
import UsuarioDetallePage from '@/pages/dashboard/UsuarioDetallePage';
import MensajesPage      from '@/pages/dashboard/MensajesPage';
import MontajesPage      from '@/pages/dashboard/MontajesPage';
import CreateMontajePage from '@/pages/dashboard/CreateMontajePage';

/** Redirige a /dashboard o /admin si el usuario ya está autenticado */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useCurrentUser();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

/** Redirige a /login si no autenticado, o a /admin si es administrador */
function UserDashboardRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useCurrentUser();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default createBrowserRouter([
  // ── Rutas públicas ────────────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },
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
  {
    path: '/reset-password',
    element: (
      <PublicOnlyRoute>
        <ResetPasswordPage />
      </PublicOnlyRoute>
    ),
  },

  // ── Dashboard de usuario ──────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: (
      <UserDashboardRoute>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </UserDashboardRoute>
    ),
    children: [
      { index: true,               element: <ForoPage /> },
      { path: 'perfil',            element: <PerfilPage /> },
      { path: 'ayuda',             element: <AyudaPage /> },
      { path: 'comparar',          element: <CompararPage /> },
      { path: 'noticias',          element: <NoticiasPage /> },
      { path: 'aprender',          element: <AprenderPage /> },
      { path: 'usuario/:id',       element: <UsuarioDetallePage /> },
      { path: 'mensajes',          element: <MensajesPage /> },
      { path: 'montajes',          element: <MontajesPage /> },
      { path: 'montajes/crear',    element: <CreateMontajePage /> },
    ],
  },

  // ── Zona de administración ────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ROL_ADMIN">
        <AdminPage />
      </ProtectedRoute>
    ),
  },

  // Ruta catch-all: redirige a la landing
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
