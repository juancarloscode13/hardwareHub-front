import { useState, type FC, type ReactElement } from 'react';
import type { MessageResponseDto } from '@/dto/chat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';



type MessageStatus = 'sent' | 'read';



function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Hoy';
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  if (!iconoPerfil) return undefined;
  if (iconoPerfil.startsWith('data:')) return iconoPerfil;
  return `data:image/png;base64,${iconoPerfil}`;
}

// ── Status Icons ────────────────────────────────────────────────────────────

const statusIcons: Record<MessageStatus, ReactElement> = {
  sent: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  read: (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Props ───────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: MessageResponseDto;
  isOwn: boolean;
  showDateLabel: boolean;
  isFirstMessage?: boolean;
  /** Base64 or data-URL del icono del remitente (puede ser null) */
  senderIconoPerfil?: string | null;
}

// ── Component ───────────────────────────────────────────────────────────────

const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showDateLabel,
  isFirstMessage = false,
  senderIconoPerfil = null,
}) => {
  const [hovered, setHovered] = useState(false);
  const status: MessageStatus = message.read ? 'read' : 'sent';
  const initials = getInitials(message.senderNombre);
  const imgSrc = avatarSrc(senderIconoPerfil);

  return (
    <>
      {/* Date label */}
      {showDateLabel && (
        <div className={cn('hw-chat-date-label flex justify-center', isFirstMessage && 'hw-chat-date-label-first')}>
          <span className="rounded-full bg-muted px-3 py-1.5 text-[0.7rem] font-medium text-muted-foreground">
            {formatDateLabel(message.sentAt)}
          </span>
        </div>
      )}

      {/* Row: avatar + bubble */}
      <div
        className={cn(
          'hw-chat-message-row w-full px-6',
          isOwn ? 'hw-chat-message-row-own' : 'hw-chat-message-row-other',
        )}
      >
        {/* Avatar — positioned higher: aligned to start, pushed down slightly */}
        <div
          className={cn(
            'hw-bubble-avatar-wrap',
            isOwn ? 'hw-bubble-avatar-wrap-own' : 'hw-bubble-avatar-wrap-other',
          )}
        >
          <Avatar size="default" className="hw-bubble-avatar-ring hw-bubble-avatar-xl">
            {imgSrc ? (
              <AvatarImage src={imgSrc} alt={message.senderNombre} />
            ) : null}
            <AvatarFallback className="hw-bubble-avatar-fallback">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Bubble column */}
        <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
          {/* Sender name (only for incoming messages) */}
          {!isOwn && (
            <span className="hw-bubble-sender-name">{message.senderNombre}</span>
          )}

          {/* Bubble */}
          <div
            className={cn(
              'hw-bubble',
              isOwn ? 'hw-bubble-own mt-4' : 'hw-bubble-other',
              hovered && 'hw-bubble-hovered',
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="article"
            aria-label={`Mensaje de ${isOwn ? 'ti' : message.senderNombre}: ${message.content}`}
          >
            {/* Scanline overlay */}
            <div className="hw-bubble-scanline" aria-hidden="true" />
            {/* Corner dots */}
            <div className="hw-bubble-dot hw-bubble-dot-tl" aria-hidden="true" />
            <div className="hw-bubble-dot hw-bubble-dot-br" aria-hidden="true" />
            {/* Message text */}
            <span className="hw-bubble-text">{message.content}</span>
          </div>

          {/* Time + status */}
          <div
            className={cn(
              'hw-bubble-meta',
              isOwn ? 'hw-bubble-meta-own' : 'hw-bubble-meta-other',
            )}
          >
            <time dateTime={message.sentAt}>{formatTime(message.sentAt)}</time>
            {isOwn && (
              <span
                className={cn('hw-bubble-status', status === 'read' && 'hw-bubble-status-read')}
                aria-label={status === 'read' ? 'Leído' : 'Enviado'}
              >
                {statusIcons[status]}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
