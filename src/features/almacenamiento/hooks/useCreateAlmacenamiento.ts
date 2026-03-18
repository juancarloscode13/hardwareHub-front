import { useMutation, useQueryClient } from '@tanstack/react-query';
import { almacenamientoApi } from '@/api/endpoints/almacenamiento.api';
import type { AlmacenamientoRequestDto } from '@/dto';
import { ALMACENAMIENTO_KEYS } from './useAlmacenamiento';

export function useCreateAlmacenamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AlmacenamientoRequestDto) => almacenamientoApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ALMACENAMIENTO_KEYS.all }),
  });
}

export function useUpdateAlmacenamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AlmacenamientoRequestDto }) =>
      almacenamientoApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: ALMACENAMIENTO_KEYS.all });
      void qc.invalidateQueries({ queryKey: ALMACENAMIENTO_KEYS.detail(id) });
    },
  });
}

export function useDeleteAlmacenamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => almacenamientoApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ALMACENAMIENTO_KEYS.all }),
  });
}

