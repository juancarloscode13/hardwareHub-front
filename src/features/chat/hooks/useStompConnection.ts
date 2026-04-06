import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stompClient } from '@/lib/stompClient';
import { CONVERSATION_KEYS } from './useConversations';
import type { MessageResponseDto } from '@/dto/chat';

const READ_RECEIPTS_DESTINATION =
  import.meta.env.VITE_CHAT_READ_RECEIPTS_DESTINATION ?? '/user/queue/read-receipts';

/**
 * Hook que mantiene la conexión STOMP activa y escucha mensajes globalmente.
 * Se monta una sola vez en el layout del chat.
 */
export function useStompConnection() {
  const qc = useQueryClient();

  useEffect(() => {
    let unsubMessages: (() => void) | null = null;
    let unsubReceipts: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      // Canal único confirmado por backend
      unsubMessages = stompClient.subscribe('/user/queue/messages', (frame) => {
        const _msg: MessageResponseDto = JSON.parse(frame.body);
        void _msg;
        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });

      // Read receipts para refrescar unreadCount sin esperar otra acción
      unsubReceipts = stompClient.subscribe(READ_RECEIPTS_DESTINATION, () => {
        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });
    });

    stompClient.onStompError((frame) => {
      console.error('[STOMP Error]', frame.headers['message'], frame.body);
    });

    stompClient.activate();

    return () => {
      unsubMessages?.();
      unsubReceipts?.();
      removeListener();
      stompClient.deactivate();
    };
  }, [qc]);
}
