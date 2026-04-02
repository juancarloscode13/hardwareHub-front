import { NavLink, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  GitCompare,
  Newspaper,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';

// ── Nav items ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Foro',     href: '/dashboard',           icon: MessageSquare },
  { label: 'Comparar', href: '/dashboard/comparar',  icon: GitCompare },
  { label: 'Noticias', href: '/dashboard/noticias',  icon: Newspaper },
  { label: 'Aprender', href: '/dashboard/aprender',  icon: GraduationCap },
] as const;

const SUPPORT_ITEMS = [
  { label: 'Ayuda', href: '/dashboard/ayuda', icon: HelpCircle },
] as const;

// ── Clases de nav link ────────────────────────────────────────────────────

const linkBase =
  'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors';
const linkActive =
  'bg-sidebar-accent text-sidebar-accent-foreground font-medium';
const linkInactive =
  'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground';

// ── Componente ────────────────────────────────────────────────────────────

export default function AppSidebar() {
  const { pathname } = useLocation();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div className="flex flex-col gap-1 p-2 pt-4">
      {/* Navegación */}
      <p className="px-2 py-1 text-xs font-medium text-sidebar-foreground/70">
        Navegación
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            className={`${linkBase} ${isActive(item.href) ? linkActive : linkInactive}`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="my-2 h-px bg-sidebar-border" />

      {/* Soporte */}
      <p className="px-2 py-1 text-xs font-medium text-sidebar-foreground/70">
        Soporte
      </p>
      <nav className="flex flex-col gap-0.5">
        {SUPPORT_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={`${linkBase} ${isActive(item.href) ? linkActive : linkInactive}`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
