import { useQuery } from '@tanstack/react-query';
import { gpuApi } from '@/api/endpoints/gpu.api';
import type { PaginationParams } from '@/api/types';

export const GPU_KEYS = {
  all: ['gpus'] as const,
  list: (params?: PaginationParams) => [...GPU_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...GPU_KEYS.all, 'detail', id] as const,
};

export function useGpus(params?: PaginationParams) {
  return useQuery({
    queryKey: GPU_KEYS.list(params),
    queryFn: () => gpuApi.getAll(params),
  });
}

export function useGpu(id: number) {
  return useQuery({
    queryKey: GPU_KEYS.detail(id),
    queryFn: () => gpuApi.getById(id),
    enabled: id > 0,
  });
}

