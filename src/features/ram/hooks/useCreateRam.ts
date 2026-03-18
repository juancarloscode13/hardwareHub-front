import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ramApi } from '@/api/endpoints/ram.api';
import type { RamRequestDto } from '@/dto';
import { RAM_KEYS } from './useRam';

export function useCreateRam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RamRequestDto) => ramApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: RAM_KEYS.all }),
  });
}

export function useUpdateRam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RamRequestDto }) =>
      ramApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: RAM_KEYS.all });
      void qc.invalidateQueries({ queryKey: RAM_KEYS.detail(id) });
    },
  });
}

export function useDeleteRam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ramApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: RAM_KEYS.all }),
  });
}

