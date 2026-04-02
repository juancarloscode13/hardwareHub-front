import { useState, useRef, useCallback } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

const SIDEBAR_WIDTH_KEY = 'hw-sidebar-width';
const DEFAULT_WIDTH = 256;
const MIN_WIDTH = 180;
const MAX_WIDTH = 400;

// ── Helpers ───────────────────────────────────────────────────────────────

function getUserInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

// ── Layout ────────────────────────────────────────────────────────────────

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const logout = useLogout();

  // Estado del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return stored ? Number(stored) : DEFAULT_WIDTH;
  });

  // Refs para drag-to-resize
  const sidebarRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      isDragging.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      function onMouseMove(ev: MouseEvent) {
        if (!isDragging.current || !sidebar) return;
        const newW = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, startWidth.current + (ev.clientX - startX.current)),
        );
        // Mutación directa → cero re-renders durante el drag
        sidebar.style.width = `${newW}px`;
      }

      function onMouseUp() {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        const finalW = sidebar?.offsetWidth ?? sidebarWidth;
        setSidebarWidth(finalW);
        localStorage.setItem(SIDEBAR_WIDTH_KEY, String(finalW));
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [sidebarWidth],
  );

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  const userName = user?.nombre ?? 'Usuario';
  const userEmail = user?.email ?? '';

  return (
    /*
     * Contenedor raíz: columna flex que ocupa exactamente el viewport.
     * NO usa position:fixed — el header y el sidebar viven en flujo normal.
     */
    <div className="flex h-svh flex-col overflow-hidden bg-hw-page transition-colors duration-300">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-40 flex h-[68px] shrink-0 items-center justify-between border-b border-border/40 bg-hw-page px-6 transition-colors duration-300">
        {/* Izquierda: marca */}
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-hw-accent shrink-0" />
          <span className="font-heading text-[1.1rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
            HardwareHub
          </span>
        </div>

        {/* Derecha: avatar + theme toggle */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-hw-accent"
                aria-label="Opciones de usuario"
              >
                <Avatar size="default">
                  <AvatarFallback className="text-xs">
                    {getUserInitials(user?.nombre)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
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
          ref={sidebarRef}
          className="relative flex shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-linear"
          style={{ width: sidebarOpen ? sidebarWidth : 0 }}
        >
          {/*
           * Wrapper interior con ancho fijo: evita que el contenido
           * se comprima mientras la transición reduce el aside a 0.
           */}
          <div
            className="flex h-full flex-col overflow-y-auto overflow-x-hidden"
            style={{ width: sidebarWidth, minWidth: sidebarWidth }}
          >
            <AppSidebar />
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute inset-y-0 right-0 w-1 cursor-col-resize hover:bg-hw-accent/40 transition-colors z-10"
          />
        </aside>

        {/* Botón toggle — pegado al borde derecho del sidebar */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute bottom-5 z-50 flex h-7 w-7 items-center justify-center rounded-md border border-hw-card-border bg-hw-card text-hw-accent shadow-md hover:bg-hw-icon-bg cursor-pointer"
          style={{
            left: sidebarOpen ? sidebarWidth - 14 : 0,
            transition: 'left 200ms ease-linear',
          }}
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
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
