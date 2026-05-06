// Claves y hooks de React Query para consultar publicaciones del foro
import { useQuery } from '@tanstack/react-query';
import { publicacionApi } from '@/api/endpoints/publicacion.api';
import type { PaginationParams } from '@/api/types';

// Escapa caracteres especiales del DSL de filtrado para evitar inyecciones
function sanitizeDslValue(value: string): string {
  return value.trim().replace(/[;~]/g, ' ');
}

// Claves estructuradas para invalidar queries de publicaciones
export const PUBLICACION_KEYS = {
  all:       ['publicaciones'] as const,
  list:      (params?: PaginationParams) => [...PUBLICACION_KEYS.all, 'list', params] as const,
  detail:    (id: number)               => [...PUBLICACION_KEYS.all, 'detail', id] as const,
  reacciones: (id: number)              => [...PUBLICACION_KEYS.all, 'reacciones', id] as const,
};

/** Devuelve la lista paginada de publicaciones */
export function usePublicaciones(params?: PaginationParams) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.list(params),
    queryFn: () => publicacionApi.getAll(params),
  });
}

/** Devuelve una publicación por su ID */
export function usePublicacion(id: number) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.detail(id),
    queryFn: () => publicacionApi.getById(id),
    enabled: id > 0,
  });
}

/** Devuelve el conteo de reacciones de una publicación */
export function useReaccionesPublicacion(id: number) {
  return useQuery({
    queryKey: PUBLICACION_KEYS.reacciones(id),
    queryFn: () => publicacionApi.getReacciones(id),
    enabled: id > 0,
  });
}

/** Devuelve las publicaciones creadas por un usuario */
export function usePublicacionesByUsuario(usuarioId: number) {
  return useQuery({
    queryKey: [...PUBLICACION_KEYS.all, 'byUsuario', usuarioId] as const,
    queryFn: () => publicacionApi.getByUsuarioId(usuarioId),
    enabled: usuarioId > 0,
  });
}

/** Busca publicaciones por contenido de texto (usando DSL del backend) */
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
