import { useQuery } from '@tanstack/react-query';
import { comentarioApi } from '@/api/endpoints/comentario.api';
import type { PaginationParams } from '@/api/types';

export const COMENTARIO_KEYS = {
  all: ['comentarios'] as const,
  list: (params?: PaginationParams) => [...COMENTARIO_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...COMENTARIO_KEYS.all, 'detail', id] as const,
  byPublicacion: (publicacionId: number) => [...COMENTARIO_KEYS.all, 'byPublicacion', publicacionId] as const,
  byComentario: (comentarioId: number) => [...COMENTARIO_KEYS.all, 'byComentario', comentarioId] as const,
};

export function useComentarios(params?: PaginationParams) {
  return useQuery({
    queryKey: COMENTARIO_KEYS.list(params),
    queryFn: () => comentarioApi.getAll(params),
  });
}

export function useComentario(id: number) {
  return useQuery({
    queryKey: COMENTARIO_KEYS.detail(id),
    queryFn: () => comentarioApi.getById(id),
    enabled: id > 0,
  });
}

export function useComentariosByPublicacion(publicacionId: number) {
  return useQuery({
    queryKey: COMENTARIO_KEYS.byPublicacion(publicacionId),
    queryFn: () => comentarioApi.getByPublicacionId(publicacionId),
    enabled: publicacionId > 0,
  });
}

export function useComentariosByComentario(comentarioId: number) {
  return useQuery({
    queryKey: COMENTARIO_KEYS.byComentario(comentarioId),
    queryFn: () => comentarioApi.getByComentarioId(comentarioId),
    enabled: comentarioId > 0,
  });
}

