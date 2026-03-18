import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placaBaseApi } from '@/api/endpoints/placa-base.api';
import type { PlacaBaseRequestDto } from '@/dto';
import { PLACA_BASE_KEYS } from './usePlacaBase';

export function useCreatePlacaBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PlacaBaseRequestDto) => placaBaseApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PLACA_BASE_KEYS.all }),
  });
}

export function useUpdatePlacaBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PlacaBaseRequestDto }) =>
      placaBaseApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: PLACA_BASE_KEYS.all });
      void qc.invalidateQueries({ queryKey: PLACA_BASE_KEYS.detail(id) });
    },
  });
}

export function useDeletePlacaBase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => placaBaseApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PLACA_BASE_KEYS.all }),
  });
}

