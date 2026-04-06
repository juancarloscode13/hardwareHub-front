import { useQuery } from '@tanstack/react-query';
import { publicacionApi } from '@/api/endpoints/publicacion.api';
import type { PaginationParams } from '@/api/types';

function sanitizeDslValue(value: string): string {
  return value.trim().replace(/[;~]/g, ' ');
}

export const PUBLICACION_KEYS = {
  all: ['publicaciones'] as const,
  list: (params?: PaginationParams) => [...PUBLICACION_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...PUBLICACION_KEYS.all, 'detail', id] as const,
  reacciones: (id: number) => [...PUBLICACION_KEYS.all, 'reacciones', id] as const,
};

export function usePublicaciones(params?: PaginationParams) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.list(params),
    queryFn: () => publicacionApi.getAll(params),
  });
}

export function usePublicacion(id: number) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.detail(id),
    queryFn: () => publicacionApi.getById(id),
    enabled: id > 0,
  });
}

export function useReaccionesPublicacion(id: number) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.reacciones(id),
    queryFn: () => publicacionApi.getReacciones(id),
    enabled: id > 0,
  });
}

export function usePublicacionesByUsuario(usuarioId: number) {
  return useQuery({
    queryKey: [...PUBLICACION_KEYS.all, 'byUsuario', usuarioId] as const,
    queryFn: () => publicacionApi.getByUsuarioId(usuarioId),
    enabled: usuarioId > 0,
  });
}

export function usePublicacionesByTexto(texto: string) {
  return useQuery({
    queryKey: [...PUBLICACION_KEYS.all, 'byTexto', texto] as const,
    queryFn: () =>
      publicacionApi.getAll({
        filter: `contenidoTexto~${sanitizeDslValue(texto)}`,
        sort: 'fecha:desc',
        size: 50,
      }),
    enabled: texto.trim().length > 0,
  });
}
