import { useMutation, useQueryClient } from '@tanstack/react-query';
import { psuApi } from '@/api/endpoints/psu.api';
import type { PsuRequestDto } from '@/dto';
import { PSU_KEYS } from './usePsu';

export function useCreatePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PsuRequestDto) => psuApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PSU_KEYS.all }),
  });
}

export function useUpdatePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PsuRequestDto }) =>
      psuApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: PSU_KEYS.all });
      void qc.invalidateQueries({ queryKey: PSU_KEYS.detail(id) });
    },
  });
}

export function useDeletePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psuApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PSU_KEYS.all }),
  });
}

