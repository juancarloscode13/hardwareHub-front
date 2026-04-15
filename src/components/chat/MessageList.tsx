import { useEffect, useRef } from 'react';
import type { MessageResponseDto } from '@/dto/chat';
import MessageBubble from './MessageBubble';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// ── Props ───────────────────────────────────────────────────────────────────

interface MessageListProps {
  messages: MessageResponseDto[];
  currentUserId: number;
  conversationId: number;
  currentUserIcon: string | null;
  otherUserIcon: string | null;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Devuelve true si dos mensajes están en días distintos */
function isDifferentDay(a: string, b: string): boolean {
  return new Date(a).toDateString() !== new Date(b).toDateString();
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function MessageList({
  messages,
  currentUserId,
  conversationId,
  currentUserIcon,
  otherUserIcon,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const isNearBottomRef = useRef(true);

  // Al cambiar de conversación, reposiciona al final y reinicia estado de auto-scroll.
  useEffect(() => {
    isNearBottomRef.current = true;
    prevLengthRef.current = 0;
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    });
  }, [conversationId]);

  // Auto-scroll al fondo solo si el usuario ya estaba cerca del final.
  useEffect(() => {
    if (messages.length > prevLengthRef.current && isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distanceToBottom < 80;
  };

  if (isLoading) {
    const skeletonWidths = ['44%', '62%', '51%', '68%', '47%', '58%'];
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1.5 py-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-12 rounded-2xl" style={{ width: skeletonWidths[i] }} />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-muted-foreground">
        <p className="text-sm">No hay mensajes todavía. ¡Empieza la conversación! 💬</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-3 py-5"
    >
      {/* Botón cargar más mensajes (historial) */}
      {hasNextPage && (
        <div className="flex justify-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Cargar mensajes anteriores'
            )}
          </Button>
        </div>
      )}

      {messages.map((msg, idx) => {
        const showDateLabel =
          idx === 0 || isDifferentDay(messages[idx - 1].sentAt, msg.sentAt);

        return (
          <div key={msg.id} className="mb-0">
            <MessageBubble
              message={msg}
              isOwn={msg.senderId === currentUserId}
              showDateLabel={showDateLabel}
              senderIconoPerfil={msg.senderId === currentUserId ? currentUserIcon : otherUserIcon}
            />
            {idx < messages.length - 1 && (
              <div aria-hidden className="hw-chat-msg-spacer" />
            )}
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
