import { useQuery } from '@tanstack/react-query';
import { fabricanteApi } from '@/api/endpoints/fabricante.api';
import type { PaginationParams } from '@/api/types';

export const FABRICANTE_KEYS = {
  all: ['fabricantes'] as const,
  list: (params?: PaginationParams) => [...FABRICANTE_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...FABRICANTE_KEYS.all, 'detail', id] as const,
};

export function useFabricantes(params?: PaginationParams) {
  return useQuery({
    queryKey: FABRICANTE_KEYS.list(params),
    queryFn: () => fabricanteApi.getAll(params),
  });
}

export function useFabricante(id: number) {
  return useQuery({
    queryKey: FABRICANTE_KEYS.detail(id),
    queryFn: () => fabricanteApi.getById(id),
    enabled: id > 0,
  });
}

