import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comentarioApi } from '@/api/endpoints/comentario.api';
import type { ComentarioRequestDto } from '@/dto';
import { COMENTARIO_KEYS } from './useComentario';

export function useCreateComentario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ComentarioRequestDto) => comentarioApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: COMENTARIO_KEYS.all }),
  });
}

export function useUpdateComentario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ComentarioRequestDto }) =>
      comentarioApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: COMENTARIO_KEYS.all });
      void qc.invalidateQueries({ queryKey: COMENTARIO_KEYS.detail(id) });
    },
  });
}

export function useDeleteComentario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => comentarioApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: COMENTARIO_KEYS.all }),
  });
}

