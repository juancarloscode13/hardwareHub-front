import { useQuery } from '@tanstack/react-query';
import { montajeApi } from '@/api/endpoints/montaje.api';
import type { PaginationParams } from '@/api/types';

export const MONTAJE_KEYS = {
  all: ['montajes'] as const,
  list: (params?: PaginationParams) => [...MONTAJE_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...MONTAJE_KEYS.all, 'detail', id] as const,
};

export function useMontajes(params?: PaginationParams) {
  return useQuery({
    queryKey: MONTAJE_KEYS.list(params),
    queryFn: () => montajeApi.getAll(params),
  });
}

export function useMontaje(id: number) {
  return useQuery({
    queryKey: MONTAJE_KEYS.detail(id),
    queryFn: () => montajeApi.getById(id),
    enabled: id > 0,
  });
}

