import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refrigeracionApi } from '@/api/endpoints/refrigeracion.api';
import type { RefrigeracionRequestDto } from '@/dto';
import { REFRIGERACION_KEYS } from './useRefrigeracion';

export function useCreateRefrigeracion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RefrigeracionRequestDto) => refrigeracionApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: REFRIGERACION_KEYS.all }),
  });
}

export function useUpdateRefrigeracion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RefrigeracionRequestDto }) =>
      refrigeracionApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: REFRIGERACION_KEYS.all });
      void qc.invalidateQueries({ queryKey: REFRIGERACION_KEYS.detail(id) });
    },
  });
}

export function useDeleteRefrigeracion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => refrigeracionApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REFRIGERACION_KEYS.all }),
  });
}

