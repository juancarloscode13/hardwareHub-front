import type { ConversationResponseDto } from '@/dto/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';



function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null): string | undefined {
  return iconoPerfil ?? undefined;
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

  /* ── Vista colapsada: solo avatar con tooltip ─────────────────────── */
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className={cn(
                'hw-chat-conversation-item relative flex w-full items-center justify-center rounded-xl transition-colors cursor-pointer',
                isActive
                  ? 'bg-(--hw-accent)/10 ring-1 ring-(--hw-accent)/30'
                  : 'hover:bg-muted/60',
              )}
            >
              {avatar}
              {conversation.unreadCount > 0 && (
                <span className="hw-unread-badge hw-unread-badge-collapsed bg-hw-accent text-hw-accent-fg">
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p className="font-medium">{conversation.otherUserNombre}</p>
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
        'hw-chat-conversation-item hw-chat-conversation-item-expanded flex w-full items-center gap-3 min-w-0 rounded-xl px-4 text-left transition-colors cursor-pointer overflow-hidden',
        isActive
          ? 'bg-(--hw-accent)/10 ring-1 ring-(--hw-accent)/30'
          : 'hover:bg-muted/60',
      )}
    >
      {avatar}

      {/* Info */}
      <div className="hw-chat-conversation-item-content ml-1.5 flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-hw-title min-w-0 flex-1">
            {conversation.otherUserNombre}
          </span>
          <span className="shrink-0 text-[0.65rem] text-muted-foreground">
            {formatLastMessageTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground min-w-0 flex-1 max-w-[20ch]">
            {conversation.lastMessageContent ?? 'Sin mensajes'}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="hw-unread-badge hw-unread-badge-expanded bg-hw-accent text-hw-accent-fg">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
