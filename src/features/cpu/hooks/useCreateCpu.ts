import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cpuApi } from '@/api/endpoints/cpu.api';
import type { CpuRequestDto } from '@/dto';
import { CPU_KEYS } from './useCpu';

export function useCreateCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CpuRequestDto) => cpuApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CPU_KEYS.all }),
  });
}

export function useUpdateCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CpuRequestDto }) =>
      cpuApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: CPU_KEYS.all });
      void qc.invalidateQueries({ queryKey: CPU_KEYS.detail(id) });
    },
  });
}

export function useDeleteCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cpuApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CPU_KEYS.all }),
  });
}

