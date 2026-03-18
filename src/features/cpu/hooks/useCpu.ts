import { useQuery } from '@tanstack/react-query';
import { cpuApi } from '@/api/endpoints/cpu.api';
import type { PaginationParams } from '@/api/types';

export const CPU_KEYS = {
  all: ['cpus'] as const,
  list: (params?: PaginationParams) => [...CPU_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...CPU_KEYS.all, 'detail', id] as const,
};

export function useCpus(params?: PaginationParams) {
  return useQuery({
    queryKey: CPU_KEYS.list(params),
    queryFn: () => cpuApi.getAll(params),
  });
}

export function useCpu(id: number) {
  return useQuery({
    queryKey: CPU_KEYS.detail(id),
    queryFn: () => cpuApi.getById(id),
    enabled: id > 0,
  });
}

