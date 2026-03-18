import { useQuery } from '@tanstack/react-query';
import { almacenamientoApi } from '@/api/endpoints/almacenamiento.api';
import type { PaginationParams } from '@/api/types';

export const ALMACENAMIENTO_KEYS = {
  all: ['almacenamientos'] as const,
  list: (params?: PaginationParams) =>
    [...ALMACENAMIENTO_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...ALMACENAMIENTO_KEYS.all, 'detail', id] as const,
};

export function useAlmacenamientos(params?: PaginationParams) {
  return useQuery({
    queryKey: ALMACENAMIENTO_KEYS.list(params),
    queryFn: () => almacenamientoApi.getAll(params),
  });
}

export function useAlmacenamiento(id: number) {
  return useQuery({
    queryKey: ALMACENAMIENTO_KEYS.detail(id),
    queryFn: () => almacenamientoApi.getById(id),
    enabled: id > 0,
  });
}

