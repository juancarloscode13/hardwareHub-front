import { useQuery } from '@tanstack/react-query';
import { psuApi } from '@/api/endpoints/psu.api';
import type { PaginationParams } from '@/api/types';

export const PSU_KEYS = {
  all: ['psus'] as const,
  list: (params?: PaginationParams) => [...PSU_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...PSU_KEYS.all, 'detail', id] as const,
};

export function usePsus(params?: PaginationParams) {
  return useQuery({
    queryKey: PSU_KEYS.list(params),
    queryFn: () => psuApi.getAll(params),
  });
}

export function usePsu(id: number) {
  return useQuery({
    queryKey: PSU_KEYS.detail(id),
    queryFn: () => psuApi.getById(id),
    enabled: id > 0,
  });
}

