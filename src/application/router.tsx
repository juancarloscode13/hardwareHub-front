import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/pages/DashboardLayout';
import AdminPage from '@/pages/AdminPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

// ── Sub-páginas del dashboard ─────────────────────────────────────────────
import ForoPage from '@/pages/dashboard/ForoPage';
import PerfilPage from '@/pages/dashboard/PerfilPage';
import AyudaPage from '@/pages/dashboard/AyudaPage';
import CompararPage from '@/pages/dashboard/CompararPage';
import NoticiasPage from '@/pages/dashboard/NoticiasPage';
import AprenderPage from '@/pages/dashboard/AprenderPage';
import UsuarioDetallePage from '@/pages/dashboard/UsuarioDetallePage';
import MensajesPage from '@/pages/dashboard/MensajesPage';
import MontajesPage from '@/pages/dashboard/MontajesPage';
import CreateMontajePage from '@/pages/dashboard/CreateMontajePage';


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
  {
    path: '/reset-password',
    element: (
      <PublicOnlyRoute>
        <ResetPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  // Protegida: cualquier usuario autenticado (layout con sidebar + sub-rutas)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,          element: <ForoPage /> },
      { path: 'perfil',       element: <PerfilPage /> },
      { path: 'ayuda',        element: <AyudaPage /> },
      { path: 'comparar',     element: <CompararPage /> },
      { path: 'noticias',     element: <NoticiasPage /> },
      { path: 'aprender',     element: <AprenderPage /> },
      { path: 'usuario/:id',  element: <UsuarioDetallePage /> },
      { path: 'mensajes',     element: <MensajesPage /> },
      { path: 'montajes',       element: <MontajesPage /> },
      { path: 'montajes/crear',  element: <CreateMontajePage /> },
    ],
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


