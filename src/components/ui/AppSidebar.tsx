import { NavLink, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  GitCompare,
  Newspaper,
  GraduationCap,
  HelpCircle,
  PcCaseIcon,
  Mail,
} from 'lucide-react';



const NAV_ITEMS = [
    {label: 'Foro', href: '/dashboard', icon: MessageSquare},
    {label: 'Montajes', href: '/dashboard/montajes', icon: PcCaseIcon},
    {label: 'Comparar', href: '/dashboard/comparar', icon: GitCompare},
    {label: 'Noticias', href: '/dashboard/noticias', icon: Newspaper},
    {label: 'Mensajes', href: '/dashboard/mensajes', icon: Mail},
] as const;

const SUPPORT_ITEMS = [
    {label: 'Ayuda', href: '/dashboard/ayuda', icon: HelpCircle},
    {label: 'Aprender', href: '/dashboard/aprender', icon: GraduationCap},
] as const;



const linkBase =
  'flex items-center rounded-lg text-sm transition-colors';
const linkActive =
  'bg-sidebar-accent text-sidebar-accent-foreground font-medium';
const linkInactive =
  'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground';



export default function AppSidebar() {
  const { pathname } = useLocation();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div className="hw-sidebar-container">
      {}
      <p className="hw-sidebar-section-title text-sidebar-foreground">
        Navegación
      </p>
      <nav className="hw-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            className={`${linkBase} hw-sidebar-link ${isActive(item.href) ? linkActive : linkInactive}`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hw-sidebar-divider bg-sidebar-border" />

      {/* Soporte */}
      <p className="hw-sidebar-section-title text-sidebar-foreground">
        Soporte
      </p>
      <nav className="hw-sidebar-nav">
        {SUPPORT_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={`${linkBase} hw-sidebar-link ${isActive(item.href) ? linkActive : linkInactive}`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
