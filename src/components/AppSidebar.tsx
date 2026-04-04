import React from 'react';
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
  'flex items-center rounded-lg text-sm transition-colors';
const linkActive =
  'bg-sidebar-accent text-sidebar-accent-foreground font-medium';
const linkInactive =
  'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground';

// Estilos inline para garantizar el espaciado independientemente de la caché de Tailwind
const linkStyle: React.CSSProperties = {
  gap: '12px',
  padding: '12px 16px',
};

// ── Componente ────────────────────────────────────────────────────────────

export default function AppSidebar() {
  const { pathname } = useLocation();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 12px 16px', gap: '4px' }}>
      {/* Navegación */}
      <p style={{ margin: '0 0 1rem', padding: '0 1rem', fontSize: '15px', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase', opacity: 0.8 }}
         className="text-sidebar-foreground">
        Navegación
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            className={`${linkBase} ${isActive(item.href) ? linkActive : linkInactive}`}
            style={linkStyle}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ margin: '16px 0', height: '1px' }} className="bg-sidebar-border" />

      {/* Soporte */}
      <p style={{ margin: '0 0 1rem', padding: '0 1rem', fontSize: '15px', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase', opacity: 0.8 }}
         className="text-sidebar-foreground">
        Soporte
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {SUPPORT_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={`${linkBase} ${isActive(item.href) ? linkActive : linkInactive}`}
            style={linkStyle}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
