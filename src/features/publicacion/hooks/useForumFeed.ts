// Hook que suscribe el feed del foro en tiempo real vía WebSocket
// Invalida publicaciones al recibir eventos de nuevas publicaciones
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { stompClient } from '@/lib/stompClient';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { PUBLICACION_KEYS } from './usePublicacion';
import type { NuevaPublicacionEventDto } from '@/dto';

// Destino del topic para recibir eventos de nuevas publicaciones
const FORUM_FEED_TOPIC = '/topic/forum.feed';

/**
 * Mantiene una suscripción al feed de publicaciones del foro.
 * Invalida la lista de publicaciones y muestra toast when una nueva.
 * No dispara notificación para publicaciones del usuario autenticado.
 */
export function useForumFeed(): void {
  const qc = useQueryClient();
  const { user } = useCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    // Activar STOMP si no está activo ya
    stompClient.activate();

    let unsubFeed: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      unsubFeed = stompClient.subscribe(FORUM_FEED_TOPIC, (frame) => {
        const evento: NuevaPublicacionEventDto = JSON.parse(frame.body);

        // Invalidar lista de publicaciones para traer la nueva
        void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all });

        // Mostrar notificación si NO es del usuario autenticado
        if (userId === undefined || evento.usuarioId !== userId) {
          const autorNombre = evento.autorNombre ?? 'un usuario';
          toast.info(`Nueva publicación de ${autorNombre}`, {
            description: evento.preview ?? 'Haz clic para verla en el feed.',
          });
        }
      });
    });

    return () => {
      unsubFeed?.();
      removeListener();
    };
  }, [qc, userId]);
}
