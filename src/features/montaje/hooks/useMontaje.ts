// Claves y hooks de React Query para consultar montajes
import { useQuery } from '@tanstack/react-query';
import { montajeApi } from '@/api/endpoints/montaje.api';
import type { PaginationParams } from '@/api/types';

// Claves estructuradas para invalidar queries relacionados con montajes
export const MONTAJE_KEYS = {
  all:       ['montajes'] as const,
  list:      (params?: PaginationParams) => [...MONTAJE_KEYS.all, 'list', params] as const,
  detail:    (id: number)               => [...MONTAJE_KEYS.all, 'detail', id] as const,
  byUsuario: (usuarioId: number)        => [...MONTAJE_KEYS.all, 'byUsuario', usuarioId] as const,
};

/** Devuelve la lista paginada de montajes */
export function useMontajes(params?: PaginationParams) {
  return useQuery({
    queryKey: MONTAJE_KEYS.list(params),
    queryFn: () => montajeApi.getAll(params),
  });
}

/** Devuelve un montaje por su ID */
export function useMontaje(id: number) {
  return useQuery({
    queryKey: MONTAJE_KEYS.detail(id),
    queryFn: () => montajeApi.getById(id),
    enabled: id > 0, // No ejecutar si el ID no es válido
  });
}

/** Devuelve los montajes creados por un usuario específico */
export function useMontajesByUsuario(usuarioId: number) {
  return useQuery({
    queryKey: MONTAJE_KEYS.byUsuario(usuarioId),
    queryFn: () => montajeApi.getByUsuarioId(usuarioId),
    enabled: usuarioId > 0,
  });
}
