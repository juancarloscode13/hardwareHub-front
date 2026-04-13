import type { MessageResponseDto } from '@/dto/chat';
import { cn } from '@/lib/utils';

// ── Helpers ─────────────────────────────────────────────────────────────────

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

// ── Props ───────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: MessageResponseDto;
  isOwn: boolean;
  showDateLabel: boolean;
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function MessageBubble({ message, isOwn, showDateLabel }: MessageBubbleProps) {
  return (
    <>
      {showDateLabel && (
        <div className="my-3 flex justify-center">
          <span className="rounded-full bg-muted px-3 py-1 text-[0.7rem] font-medium text-muted-foreground">
            {formatDateLabel(message.sentAt)}
          </span>
        </div>
      )}

      <div className={cn('flex w-full px-6', isOwn ? 'justify-end' : 'justify-start')}>
        <div
          className={cn(
            'max-w-[min(84%,48rem)] rounded-2xl py-4 leading-relaxed shadow-sm hw-chat-bubble',
            isOwn
              ? 'bg-hw-accent text-hw-accent-fg hw-chat-bubble-own'
              : 'border border-hw-card-border bg-hw-card text-hw-title hw-chat-bubble-other',
          )}
        >
          {!isOwn && (
            <p className="mb-0.5 text-xs hw-chat-sender">
              {message.senderNombre}
            </p>
          )}

          <p
            className={cn(
              'whitespace-pre-wrap wrap-break-word text-sm',
              !isOwn && 'hw-chat-text-other',
            )}
          >
            {message.content}
          </p>

          <div
            className={cn(
              'mt-1.5 flex items-center justify-end gap-1.5 text-[0.7rem]',
              isOwn ? 'opacity-75' : 'text-muted-foreground',
            )}
          >
            <span>{formatTime(message.sentAt)}</span>
            {isOwn && (
              <span title={message.read ? 'Leido' : 'Enviado'}>{message.read ? '✓✓' : '✓'}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
