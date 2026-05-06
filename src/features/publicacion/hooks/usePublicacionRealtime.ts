// Hook que suscribe eventos WebSocket de reacciones y comentarios en una publicación específica
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { stompClient } from '@/lib/stompClient';
import { COMENTARIO_KEYS } from '@/features/comentario/hooks/useComentario';
import type { ComentarioResponseDto, ReaccionConteoDto } from '@/dto';

/** Resultado de la suscripción: últimas actualizaciones de reacciones y comentarios */
export interface PublicacionRealtimeResult {
  reaccionesUpdate: ReaccionConteoDto | null;  // Último conteo de reacciones o null
  nuevoComentario: ComentarioResponseDto | null; // Último comentario o null
}

/**
 * Suscribe a eventos WebSocket de una publicación específica.
 * Devuelve los últimos cambios y invalida la query de comentarios para que CommentsDialog se refresque.
 */
export function usePublicacionRealtime(postId: number): PublicacionRealtimeResult {
  const qc = useQueryClient();
  const [reaccionesUpdate, setReaccionesUpdate] = useState<ReaccionConteoDto | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState<ComentarioResponseDto | null>(null);

  useEffect(() => {
    if (postId <= 0) return;

    // Activar conexión STOMP
    stompClient.activate();

    let unsubReacciones: (() => void) | null = null;
    let unsubComentarios: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      // Suscribir a cambios de reacciones de la publicación
      unsubReacciones = stompClient.subscribe(
        `/topic/publicacion.${postId}.reacciones`,
        (frame) => {
          const data: ReaccionConteoDto = JSON.parse(frame.body);
          setReaccionesUpdate(data);
        },
      );

      // Suscribir a nuevos comentarios en la publicación
      unsubComentarios = stompClient.subscribe(
        `/topic/publicacion.${postId}.comentarios`,
        (frame) => {
          const data: ComentarioResponseDto = JSON.parse(frame.body);
          setNuevoComentario(data);
          // Invalida la query para que CommentsDialog refresque si está abierto
          void qc.invalidateQueries({
            queryKey: COMENTARIO_KEYS.byPublicacion(postId),
          });
        },
      );
    });

    return () => {
      unsubReacciones?.();
      unsubComentarios?.();
      removeListener();
    };
  }, [postId, qc]);

  return { reaccionesUpdate, nuevoComentario };
}
