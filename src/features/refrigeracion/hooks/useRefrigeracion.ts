import { useQuery } from '@tanstack/react-query';
import { refrigeracionApi } from '@/api/endpoints/refrigeracion.api';
import type { PaginationParams } from '@/api/types';

export const REFRIGERACION_KEYS = {
  all: ['refrigeraciones'] as const,
  list: (params?: PaginationParams) => [...REFRIGERACION_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...REFRIGERACION_KEYS.all, 'detail', id] as const,
};

export function useRefrigeraciones(params?: PaginationParams) {
  return useQuery({
    queryKey: REFRIGERACION_KEYS.list(params),
    queryFn: () => refrigeracionApi.getAll(params),
  });
}

export function useRefrigeracion(id: number) {
  return useQuery({
    queryKey: REFRIGERACION_KEYS.detail(id),
    queryFn: () => refrigeracionApi.getById(id),
    enabled: id > 0,
  });
}

