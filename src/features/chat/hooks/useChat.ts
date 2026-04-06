import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { chatApi } from '@/api/endpoints/chat.api';
import type { PageResponse } from '@/api/types';
import { stompClient } from '@/lib/stompClient';
import type { MessageResponseDto, SendMessagePayload, ReadConversationPayload } from '@/dto/chat';
import { CONVERSATION_KEYS } from './useConversations';

// ── Query keys ──────────────────────────────────────────────────────────────

export const MESSAGE_KEYS = {
  all: ['messages'] as const,
  byConversation: (id: number) => [...MESSAGE_KEYS.all, id] as const,
};

const PAGE_SIZE = 20;
const READ_RECEIPTS_DESTINATION =
  import.meta.env.VITE_CHAT_READ_RECEIPTS_DESTINATION ?? '/user/queue/read-receipts';

type ReadReceiptPayload = {
  conversationId?: number;
  messageIds?: number[];
};

function upsertMessage(list: MessageResponseDto[], incoming: MessageResponseDto): MessageResponseDto[] {
  const idx = list.findIndex((m) => m.id === incoming.id);
  if (idx === -1) return [...list, incoming];

  const prev = list[idx];
  const nextItem = { ...prev, ...incoming };
  if (
    prev.read === nextItem.read &&
    prev.content === nextItem.content &&
    prev.sentAt === nextItem.sentAt &&
    prev.senderId === nextItem.senderId
  ) {
    return list;
  }

  const next = [...list];
  next[idx] = nextItem;
  return next;
}

function markIncomingAsRead(list: MessageResponseDto[], readerUserId: number): MessageResponseDto[] {
  let changed = false;
  const next = list.map((m) => {
    if (m.senderId !== readerUserId && !m.read) {
      changed = true;
      return { ...m, read: true };
    }
    return m;
  });
  return changed ? next : list;
}

function markReadByIds(list: MessageResponseDto[], idSet: Set<number>): MessageResponseDto[] {
  let changed = false;
  const next = list.map((m) => {
    if (idSet.has(m.id) && !m.read) {
      changed = true;
      return { ...m, read: true };
    }
    return m;
  });
  return changed ? next : list;
}

// ── useChat ─────────────────────────────────────────────────────────────────

/**
 * Hook principal del chat.
 *
 * Combina:
 * - Historial paginado (useInfiniteQuery) → datos del servidor
 * - Mensajes en tiempo real (STOMP) → estado local
 */
export function useChat(conversationId: number) {
  const qc = useQueryClient();

  // ── Mensajes en tiempo real (estado local, NO en TanStack Query) ────────
  const [realtimeMessages, setRealtimeMessages] = useState<MessageResponseDto[]>([]);

  // ── Historial paginado ──────────────────────────────────────────────────
  const historyQuery = useInfiniteQuery({
    queryKey: MESSAGE_KEYS.byConversation(conversationId),
    queryFn: ({ pageParam = 0 }) =>
      chatApi.getMessages(conversationId, pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    initialPageParam: 0,
    enabled: conversationId > 0,
  });

  // ── Suscripción STOMP (mensajes + read receipts) ───────────────────────
  useEffect(() => {
    if (conversationId <= 0) return;

    let unsubMessages: (() => void) | null = null;
    let unsubReceipts: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      unsubMessages = stompClient.subscribe('/user/queue/messages', (frame) => {
        const msg: MessageResponseDto = JSON.parse(frame.body);

        if (msg.conversationId === conversationId) {
          // Upsert local (alta + actualización de estado read)
          setRealtimeMessages((prev) => upsertMessage(prev, msg));

          // Upsert en historial cacheado para reflejar updates en caliente
          qc.setQueryData<InfiniteData<PageResponse<MessageResponseDto>>>(
            MESSAGE_KEYS.byConversation(conversationId),
            (old) => {
              if (!old) return old;
              let changed = false;

              const pages = old.pages.map((page) => {
                const hasMsg = page.content.some((m) => m.id === msg.id);
                if (!hasMsg) return page;

                changed = true;
                return {
                  ...page,
                  content: page.content.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
                };
              });

              return changed ? { ...old, pages } : old;
            },
          );
        }

        // Siempre refrescar lista lateral (lastMessage/unreadCount)
        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });

      // Receipt explícito emitido por backend al ejecutar chat.read
      unsubReceipts = stompClient.subscribe(READ_RECEIPTS_DESTINATION, (frame) => {
        const payload: ReadReceiptPayload = JSON.parse(frame.body);
        if (payload.conversationId !== conversationId || !payload.messageIds?.length) return;

        const idSet = new Set(payload.messageIds);

        setRealtimeMessages((prev) => markReadByIds(prev, idSet));

        qc.setQueryData<InfiniteData<PageResponse<MessageResponseDto>>>(
          MESSAGE_KEYS.byConversation(conversationId),
          (old) => {
            if (!old) return old;
            let changed = false;
            const pages = old.pages.map((page) => {
              const nextContent = page.content.map((m) => {
                if (!idSet.has(m.id) || m.read) return m;
                changed = true;
                return { ...m, read: true };
              });
              return changed ? { ...page, content: nextContent } : page;
            });
            return changed ? { ...old, pages } : old;
          },
        );

        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });
    });

    return () => {
      unsubMessages?.();
      unsubReceipts?.();
      removeListener();
    };
  }, [conversationId, qc]);

  // ── Enviar mensaje ──────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (content: string) => {
      if (!conversationId || !content.trim()) return;
      const payload: SendMessagePayload = { conversationId, content: content.trim() };
      stompClient.publish('/app/chat.send', payload as unknown as Record<string, unknown>);
    },
    [conversationId],
  );

  // ── Marcar como leído (vía STOMP + optimistic local) ──────────────────
  const markAsRead = useCallback((currentUserId: number) => {
    if (!conversationId) return;

    const payload: ReadConversationPayload = { conversationId };
    stompClient.publish('/app/chat.read', payload as unknown as Record<string, unknown>);

    // Optimistic: conversación activa a 0 no leídos en la lista lateral
    qc.setQueryData(CONVERSATION_KEYS.list(), (old: unknown) => {
      if (!Array.isArray(old)) return old;
      return old.map((conv) => {
        if (!conv || typeof conv !== 'object') return conv;
        const c = conv as Record<string, unknown>;
        if (c.id !== conversationId) return conv;
        return { ...c, unreadCount: 0 };
      });
    });

    // Optimistic: marcar solo mensajes entrantes como leídos
    qc.setQueryData<InfiniteData<PageResponse<MessageResponseDto>>>(
      MESSAGE_KEYS.byConversation(conversationId),
      (old) => {
        if (!old) return old;
        let changed = false;
        const pages = old.pages.map((page) => {
          const nextContent = page.content.map((m) => {
            if (m.senderId === currentUserId || m.read) return m;
            changed = true;
            return { ...m, read: true };
          });
          return changed ? { ...page, content: nextContent } : page;
        });
        return changed ? { ...old, pages } : old;
      },
    );

    setRealtimeMessages((prev) => markIncomingAsRead(prev, currentUserId));
  }, [conversationId, qc]);

  // ── Mensajes combinados: historial (invertido para ASC) + realtime ─────
  const historyMessages: MessageResponseDto[] =
    historyQuery.data?.pages.flatMap((page) => page.content).reverse() ?? [];

  // Filtrar duplicados realtime que ya aparezcan en el historial
  const historyIdSet = new Set(historyMessages.map((m) => m.id));
  const filteredRealtime = realtimeMessages.filter(
    (m) => m.conversationId === conversationId && !historyIdSet.has(m.id),
  );

  const allMessages = [...historyMessages, ...filteredRealtime];

  return {
    messages: allMessages,
    sendMessage,
    markAsRead,
    isLoading: historyQuery.isLoading,
    isFetchingNextPage: historyQuery.isFetchingNextPage,
    hasNextPage: historyQuery.hasNextPage ?? false,
    fetchNextPage: historyQuery.fetchNextPage,
  };
}
