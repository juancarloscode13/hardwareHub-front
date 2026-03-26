import { useQuery } from '@tanstack/react-query';
import { noticiasApi } from '@/api/endpoints/noticias.api';

export const NOTICIAS_KEYS = {
  all:  ['noticias'] as const,
  list: () => [...NOTICIAS_KEYS.all, 'list'] as const,
};

export function useNoticias() {
  return useQuery({
    queryKey: NOTICIAS_KEYS.list(),
    queryFn:  noticiasApi.getAll,
    staleTime: 5 * 60 * 1_000, // 5 minutos — noticias externas, no cambian tan rápido
  });
}

