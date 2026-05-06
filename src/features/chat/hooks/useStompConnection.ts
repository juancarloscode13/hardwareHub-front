// Hook que mantiene la conexión STOMP global para actualizar conversaciones en tiempo real
// Se monta una sola vez en el layout del dashboard
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stompClient } from '@/lib/stompClient';
import { CONVERSATION_KEYS } from './useConversations';
import type { MessageResponseDto } from '@/dto/chat';

// Destino para recibir confirmaciones de lectura vía WebSocket
const READ_RECEIPTS_DESTINATION =
  import.meta.env.VITE_CHAT_READ_RECEIPTS_DESTINATION ?? '/user/queue/read-receipts';

/**
 * Activa la conexión STOMP y suscribe los canales de mensajes y recibos de lectura.
 * Invalida la lista de conversaciones al recibir cualquier evento para mantenerla actualizada.
 */
export function useStompConnection() {
  const qc = useQueryClient();

  useEffect(() => {
    let unsubMessages: (() => void) | null = null;
    let unsubReceipts: (() => void) | null = null;

    // Registrar suscripciones una vez que STOMP confirme la conexión
    const removeListener = stompClient.addConnectListener(() => {
      // Canal de nuevos mensajes: refresca las conversaciones para actualizar el badge
      unsubMessages = stompClient.subscribe('/user/queue/messages', (frame) => {
        const _msg: MessageResponseDto = JSON.parse(frame.body);
        void _msg;
        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });

      // Canal de recibos de lectura: refresca para limpiar contadores de no leídos
      unsubReceipts = stompClient.subscribe(READ_RECEIPTS_DESTINATION, () => {
        void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      });
    });

    stompClient.onStompError((frame) => {
      console.error('[STOMP Error]', frame.headers['message'], frame.body);
    });

    stompClient.activate();

    // Cleanup: desuscribir y desconectar al desmontar
    return () => {
      unsubMessages?.();
      unsubReceipts?.();
      removeListener();
      stompClient.deactivate();
    };
  }, [qc]);
}
