import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { stompClient } from '@/lib/stompClient';
import { COMENTARIO_KEYS } from '@/features/comentario/hooks/useComentario';
import type { ComentarioResponseDto, ReaccionConteoDto } from '@/dto';

export interface PublicacionRealtimeResult {
  reaccionesUpdate: ReaccionConteoDto | null;
  nuevoComentario: ComentarioResponseDto | null;
}

/**
 * Hook que escucha actualizaciones en tiempo real de una publicación concreta.
 *
 * Suscripciones activas mientras el componente viva:
 *   - /topic/publicacion.{postId}.reacciones  → actualiza contadores localmente
 *   - /topic/publicacion.{postId}.comentarios → invalida la query de comentarios
 *
 * Reutiliza el stompClient singleton. NO crea una segunda conexión WS.
 *
 * @param postId  Id de la publicación a observar (0 o negativo = inactivo).
 */
export function usePublicacionRealtime(postId: number): PublicacionRealtimeResult {
  const qc = useQueryClient();
  const [reaccionesUpdate, setReaccionesUpdate] = useState<ReaccionConteoDto | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState<ComentarioResponseDto | null>(null);

  useEffect(() => {
    if (postId <= 0) return;

    // Activa la conexión si aún no está activa (idempotente)
    stompClient.activate();

    let unsubReacciones: (() => void) | null = null;
    let unsubComentarios: (() => void) | null = null;

    const removeListener = stompClient.addConnectListener(() => {
      // ── Reacciones ────────────────────────────────────────────────────────
      unsubReacciones = stompClient.subscribe(
        `/topic/publicacion.${postId}.reacciones`,
        (frame) => {
          const data: ReaccionConteoDto = JSON.parse(frame.body);
          setReaccionesUpdate(data);
        },
      );

      // ── Comentarios ───────────────────────────────────────────────────────
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

