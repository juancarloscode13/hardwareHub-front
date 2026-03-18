import { useQuery } from '@tanstack/react-query';
import { cajaApi } from '@/api/endpoints/caja.api';
import type { PaginationParams } from '@/api/types';

export const CAJA_KEYS = {
  all: ['cajas'] as const,
  list: (params?: PaginationParams) => [...CAJA_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...CAJA_KEYS.all, 'detail', id] as const,
};

export function useCajas(params?: PaginationParams) {
  return useQuery({
    queryKey: CAJA_KEYS.list(params),
    queryFn: () => cajaApi.getAll(params),
  });
}

export function useCaja(id: number) {
  return useQuery({
    queryKey: CAJA_KEYS.detail(id),
    queryFn: () => cajaApi.getById(id),
    enabled: id > 0,
  });
}

