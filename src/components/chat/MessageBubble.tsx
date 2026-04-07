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
            // base visual del bubble
            'max-w-[min(84%,48rem)] rounded-2xl py-4 leading-relaxed shadow-sm',
            isOwn
              ? 'bg-hw-accent text-hw-accent-fg'
              : 'border border-hw-card-border bg-hw-card text-hw-title',
          )}
          // forzamos padding y forma via inline styles; menos alargado (minWidth reducido) y radios más suaves
          style={
            isOwn
              ? { paddingLeft: 20, paddingRight: 20, minWidth: '10rem', borderRadius: 20, borderBottomRightRadius: 6 }
              : { paddingLeft: 20, paddingRight: 20, minWidth: '10rem', borderRadius: 20, borderBottomLeftRadius: 6 }
          }
        >
          {!isOwn && (
            // forzamos estilo inline para garantizar negrita y color, evitando overrides globales
            <p
              className="mb-0.5 text-xs"
              style={{ fontWeight: 700, color: 'var(--hw-title)', opacity: 0.95 }}
            >
              {message.senderNombre}
            </p>
          )}

          {/* si es mensaje recibido, forzamos color más oscuro inline para evitar overrides */}
          <p
            className="whitespace-pre-wrap wrap-break-word text-sm"
            style={!isOwn ? { color: 'var(--hw-title)', opacity: 0.95 } : undefined}
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
