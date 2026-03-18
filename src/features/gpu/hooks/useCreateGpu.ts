import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gpuApi } from '@/api/endpoints/gpu.api';
import type { GpuRequestDto } from '@/dto';
import { GPU_KEYS } from './useGpu';

export function useCreateGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GpuRequestDto) => gpuApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: GPU_KEYS.all }),
  });
}

export function useUpdateGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GpuRequestDto }) =>
      gpuApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: GPU_KEYS.all });
      void qc.invalidateQueries({ queryKey: GPU_KEYS.detail(id) });
    },
  });
}

export function useDeleteGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gpuApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: GPU_KEYS.all }),
  });
}

