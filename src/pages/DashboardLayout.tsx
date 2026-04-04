import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Cpu,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import AppSidebar from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useLogout } from '@/features/auth/hooks/useAuth';

// ── Constantes ────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 256;

// ── Helpers ───────────────────────────────────────────────────────────────

function getUserInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function getAvatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  if (!iconoPerfil) return undefined;
  // Si ya es una data-URL completa, úsala tal cual
  if (iconoPerfil.startsWith('data:')) return iconoPerfil;
  // Si es base64 puro, añade el prefijo
  return `data:image/png;base64,${iconoPerfil}`;
}

// ── Layout ────────────────────────────────────────────────────────────────

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const logout = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  const userName = user?.nombre ?? 'Usuario';
  const userEmail = user?.email ?? '';
  const avatarSrc = getAvatarSrc(user?.iconoPerfil);

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-hw-page transition-colors duration-300">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header data-slot="app-header" className="relative z-40 flex h-[68px] shrink-0 items-center justify-between border-b border-border/40 bg-hw-page px-8 transition-colors duration-300">
        {/* Izquierda: marca */}
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-hw-accent shrink-0" />
          <span className="font-heading text-[1.1rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
            HardwareHub
          </span>
        </div>

        {/* Derecha: avatar + theme toggle */}
        <div className="flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Opciones de usuario"
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--hw-card-border)',
                  background: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  padding: 0,
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={userName}
                    style={{
                      display: 'block',
                      width: 32,
                      height: 32,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1 }}>
                    {getUserInitials(user?.nombre)}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="text-sm font-semibold truncate">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/dashboard/perfil')}
                >
                  <User className="w-4 h-4" />
                  Ver perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/dashboard/perfil')}
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle fixed={false} />
        </div>
      </header>

      {/* ── Body: sidebar + contenido ───────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="relative flex shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-linear"
          style={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <div
            className="flex h-full flex-col overflow-y-auto overflow-x-hidden"
            style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}
          >
            <AppSidebar />
          </div>
        </aside>

        {/* Botón toggle — pegado al borde del sidebar, parte inferior */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute bottom-5 z-50 flex h-7 w-7 items-center justify-center rounded-md border border-hw-card-border bg-hw-card text-hw-accent shadow-md cursor-pointer transition-[left] duration-200 ease-linear hover:border-hw-accent hover:text-hw-accent"
          style={{ left: sidebarOpen ? SIDEBAR_WIDTH - 20 : 8 }}
          aria-label={sidebarOpen ? 'Minimizar sidebar' : 'Expandir sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Contenido principal */}
        <main className="relative flex-1 overflow-auto bg-hw-page transition-colors duration-300">
          {/* Glow decorativo */}
          <div className="pointer-events-none fixed right-0 top-0 h-[600px] w-[600px] rounded-full bg-hw-glow blur-[120px] transition-colors duration-300" />
          <div
            className="relative z-10 w-full"
            style={{ maxWidth: 1680, margin: '0 auto', padding: '24px 28px 32px' }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
