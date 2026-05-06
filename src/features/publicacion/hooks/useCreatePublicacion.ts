// Mutaciones de React Query para crear, actualizar, eliminar publicaciones y gestionar reacciones
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publicacionApi } from '@/api/endpoints/publicacion.api';
import type { PublicacionRequestDto, ReaccionRequestDto } from '@/dto';
import { PUBLICACION_KEYS } from './usePublicacion';

/** Crea una nueva publicación e invalida la lista */
export function useCreatePublicacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PublicacionRequestDto) => publicacionApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all }),
  });
}

/** Actualiza una publicación existente */
export function useUpdatePublicacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PublicacionRequestDto }) =>
      publicacionApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all });
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.detail(id) });
    },
  });
}

/** Elimina una publicación por ID */
export function useDeletePublicacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publicacionApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.all }),
  });
}

/** Añade o actualiza la reacción del usuario a una publicación */
export function useAddReaccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReaccionRequestDto }) =>
      publicacionApi.addOrUpdateReaction(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.reacciones(id) });
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.detail(id) });
    },
  });
}

/** Elimina la reacción del usuario de una publicación */
export function useRemoveReaccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, usuarioId }: { id: number; usuarioId: number }) =>
      publicacionApi.removeReaction(id, usuarioId),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.reacciones(id) });
      void qc.invalidateQueries({ queryKey: PUBLICACION_KEYS.detail(id) });
    },
  });
}
