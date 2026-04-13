import type { ConversationResponseDto } from '@/dto/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null): string | undefined {
  if (!iconoPerfil) return undefined;
  if (iconoPerfil.startsWith('data:')) return iconoPerfil;
  return `data:image/png;base64,${iconoPerfil}`;
}

function formatLastMessageTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// ── Props ───────────────────────────────────────────────────────────────────

interface ConversationListItemProps {
  conversation: ConversationResponseDto;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function ConversationListItem({
  conversation,
  isActive,
  collapsed,
  onClick,
}: ConversationListItemProps) {
  const avatar = (
    <Avatar size="default" className="shrink-0">
      {avatarSrc(conversation.otherUserIconoPerfil) ? (
        <AvatarImage
          src={avatarSrc(conversation.otherUserIconoPerfil)!}
          alt={conversation.otherUserNombre}
        />
      ) : null}
      <AvatarFallback>{getInitials(conversation.otherUserNombre)}</AvatarFallback>
    </Avatar>
  );

  // Avatar específico para la vista colapsada: forzamos marginLeft inline
  const avatarCollapsed = (
    <Avatar size="default" className="shrink-0" style={{ marginLeft: '8px' }}>
      {avatarSrc(conversation.otherUserIconoPerfil) ? (
        <AvatarImage
          src={avatarSrc(conversation.otherUserIconoPerfil)!}
          alt={conversation.otherUserNombre}
        />
      ) : null}
      <AvatarFallback>{getInitials(conversation.otherUserNombre)}</AvatarFallback>
    </Avatar>
  );

  /* ── Vista colapsada: solo avatar con tooltip ─────────────────────── */
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className={cn(
                // Cambiamos a justify-start para controlar el espaciado interno desde la izquierda
                'relative flex w-full items-center justify-start rounded-xl p-2 transition-colors cursor-pointer',
                isActive
                  ? 'bg-(--hw-accent)/10 ring-1 ring-(--hw-accent)/30'
                  : 'hover:bg-muted/60',
              )}
              // Forzamos padding interno a la izquierda para separar el avatar del borde
              style={{ paddingLeft: '10px' }}
            >
              {avatarCollapsed}
              {conversation.unreadCount > 0 && (
                <span
                  className="flex items-center justify-center rounded-full bg-hw-accent text-hw-accent-fg font-bold"
                  // Forzamos posicionamiento y tamaño desde estilo inline para evitar que el badge se corte
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    height: 18,
                    minWidth: 18,
                    paddingLeft: 6,
                    paddingRight: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    lineHeight: '18px',
                    zIndex: 2,
                  }}
                >
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p className="font-medium">{conversation.otherUserNombre}</p>
            {conversation.lastMessageContent && (
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {conversation.lastMessageContent}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  /* ── Vista expandida (original) ───────────────────────────────────── */
  return (
    <button
      onClick={onClick}
      className={cn(
        // añadir min-w-0 para permitir que los hijos flexibles se encojan y el texto se trunque
        'flex w-full items-center gap-3 min-w-0 rounded-xl px-6 py-2.5 text-left transition-colors cursor-pointer',
        isActive
          ? 'bg-(--hw-accent)/10 ring-1 ring-(--hw-accent)/30'
          : 'hover:bg-muted/60',
      )}
      // forzamos inline para evitar overrides que rompan el comportamiento
      style={{ minWidth: 0, overflow: 'hidden' }}
    >
      {avatar}

      {/* Info */}
      {/* Forzamos un pequeño margen izquierdo en el contenedor de texto para separar el avatar
          aunque las utilidades de gap no surtan efecto en algún contexto */}
      <div className="flex min-w-0 flex-1 flex-col" style={{ minWidth: 0, marginLeft: '8px' }}>
        <div className="flex items-center justify-between gap-2">
          <span
            className="truncate text-sm font-semibold text-hw-title min-w-0 flex-1"
            // forzamos inline styles críticos para garantizar truncado incluso si hay overrides globales
            style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {conversation.otherUserNombre}
          </span>
          <span className="shrink-0 text-[0.65rem] text-muted-foreground">
            {formatLastMessageTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className="truncate text-xs text-muted-foreground min-w-0 flex-1"
            // forzamos truncado y además acotamos preview para que no sea excesivamente largo
            style={{ flex: '1 1 0%', minWidth: 0, maxWidth: '20ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {conversation.lastMessageContent ?? 'Sin mensajes'}
          </span>
          {conversation.unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full bg-hw-accent text-hw-accent-fg font-bold"
              style={{ height: 20, minWidth: 20, paddingLeft: 6, paddingRight: 6, fontSize: '0.65rem', marginRight: 6 }}
            >
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

