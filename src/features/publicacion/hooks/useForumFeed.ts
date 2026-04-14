import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { stompClient } from '@/lib/stompClient';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { PUBLICACION_KEYS } from './usePublicacion';
import type { NuevaPublicacionEventDto } from '@/dto';

const FORUM_FEED_TOPIC = '/topic/forum.feed';

/**
 * Hook que se suscribe al topic global del foro en tiempo real.
 *
 * - Invalida el listado de publicaciones al recibir una nueva entrada.
 * - Muestra un toast de sonner con el autor, excepto si el autor es el
 *   usuario logueado (un artista no aplaude su propia obra).
 * - Reutiliza el stompClient singleton; NO crea una segunda conexión WS.
 *
 * Montar una sola vez por sesión del foro (p.ej. en ForoPage).
 */
export function useForumFeed(): void {
  const qc = useQueryClient();
  const { user } = useCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    // Activa la conexión si aún no está activa (idempotente)
    stompClient.activate();

    let unsubFeed: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      unsubFeed = stompClient.subscribe(FORUM_FEED_TOPIC, (frame) => {
        const evento: NuevaPublicacionEventDto = JSON.parse(frame.body);

        // Refrescar el feed de publicaciones
        void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all });

        // No notificar al propio autor de su publicación
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

