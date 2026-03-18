import { useQuery } from '@tanstack/react-query';
import { ramApi } from '@/api/endpoints/ram.api';
import type { PaginationParams } from '@/api/types';

export const RAM_KEYS = {
  all: ['rams'] as const,
  list: (params?: PaginationParams) => [...RAM_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...RAM_KEYS.all, 'detail', id] as const,
};

export function useRams(params?: PaginationParams) {
  return useQuery({
    queryKey: RAM_KEYS.list(params),
    queryFn: () => ramApi.getAll(params),
  });
}

export function useRam(id: number) {
  return useQuery({
    queryKey: RAM_KEYS.detail(id),
    queryFn: () => ramApi.getById(id),
    enabled: id > 0,
  });
}

