import { useQuery } from '@tanstack/react-query';
import { placaBaseApi } from '@/api/endpoints/placa-base.api';
import type { PaginationParams } from '@/api/types';

export const PLACA_BASE_KEYS = {
  all: ['placas-base'] as const,
  list: (params?: PaginationParams) => [...PLACA_BASE_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...PLACA_BASE_KEYS.all, 'detail', id] as const,
};

export function usePlacasBase(params?: PaginationParams) {
  return useQuery({
    queryKey: PLACA_BASE_KEYS.list(params),
    queryFn: () => placaBaseApi.getAll(params),
  });
}

export function usePlacaBase(id: number) {
  return useQuery({
    queryKey: PLACA_BASE_KEYS.detail(id),
    queryFn: () => placaBaseApi.getById(id),
    enabled: id > 0,
  });
}

