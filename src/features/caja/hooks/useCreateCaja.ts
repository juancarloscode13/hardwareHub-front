import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cajaApi } from '@/api/endpoints/caja.api';
import type { CajaRequestDto } from '@/dto';
import { CAJA_KEYS } from './useCaja';

export function useCreateCaja() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CajaRequestDto) => cajaApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAJA_KEYS.all }),
  });
}

export function useUpdateCaja() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CajaRequestDto }) =>
      cajaApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: CAJA_KEYS.all });
      void qc.invalidateQueries({ queryKey: CAJA_KEYS.detail(id) });
    },
  });
}

export function useDeleteCaja() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cajaApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAJA_KEYS.all }),
  });
}

