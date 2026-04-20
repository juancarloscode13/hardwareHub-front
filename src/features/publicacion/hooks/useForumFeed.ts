import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { stompClient } from '@/lib/stompClient';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { PUBLICACION_KEYS } from './usePublicacion';
import type { NuevaPublicacionEventDto } from '@/dto';

const FORUM_FEED_TOPIC = '/topic/forum.feed';


export function useForumFeed(): void {
  const qc = useQueryClient();
  const { user } = useCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    
    stompClient.activate();

    let unsubFeed: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      unsubFeed = stompClient.subscribe(FORUM_FEED_TOPIC, (frame) => {
        const evento: NuevaPublicacionEventDto = JSON.parse(frame.body);

        
        void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all });

        
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

