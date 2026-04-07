import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChat } from '@/features/chat/hooks/useChat';
import type { ConversationResponseDto } from '@/dto/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  if (!iconoPerfil) return undefined;
  if (iconoPerfil.startsWith('data:')) return iconoPerfil;
  return `data:image/png;base64,${iconoPerfil}`;
}

// ── Props ───────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  conversation: ConversationResponseDto | null;
  currentUserId: number;
}

interface ActiveChatWindowProps {
  conversation: ConversationResponseDto;
  currentUserId: number;
}

// ── Estado activo (con hooks de chat) ─────────────────────────────────────

function ActiveChatWindow({ conversation, currentUserId }: ActiveChatWindowProps) {
  const {
    messages,
    sendMessage,
    markAsRead,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChat(conversation.id);

  const lastReadRequestSignatureRef = useRef('');

  // Marcar como leído cuando existan mensajes ajenos pendientes en la conversación activa.
  useEffect(() => {
    const unreadIncomingIds = messages
      .filter((m) => m.senderId !== currentUserId && !m.read)
      .map((m) => m.id)
      .sort((a, b) => a - b);

    if (unreadIncomingIds.length === 0) {
      lastReadRequestSignatureRef.current = '';
      return;
    }

    const signature = unreadIncomingIds.join(',');
    if (signature === lastReadRequestSignatureRef.current) return;

    lastReadRequestSignatureRef.current = signature;
    markAsRead(currentUserId);
  }, [messages, currentUserId, markAsRead]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header del chat */}
      <div className="flex shrink-0 items-center gap-3 border-b border-hw-card-border bg-hw-card px-5 py-3.5">
        {/* Forzamos separación entre avatar y nombre con un wrapper inline */}
        <div style={{ marginRight: '10px', marginLeft: '6px' }}>
          <Avatar size="default">
            {avatarSrc(conversation.otherUserIconoPerfil) ? (
              <AvatarImage
                src={avatarSrc(conversation.otherUserIconoPerfil)!}
                alt={conversation.otherUserNombre}
              />
            ) : null}
            <AvatarFallback>{getInitials(conversation.otherUserNombre)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-sm font-semibold text-hw-title">{conversation.otherUserNombre}</p>
        </div>
      </div>

      {/* Mensajes */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        conversationId={conversation.id}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  // Vista vacía: sin conversación seleccionada
  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-muted-foreground">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <MessageSquare className="h-10 w-10" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-hw-title">Tus mensajes</p>
          <p className="mt-1 text-sm">Selecciona una conversación para empezar a chatear</p>
        </div>
      </div>
    );
  }

  return <ActiveChatWindow conversation={conversation} currentUserId={currentUserId} />;
}
