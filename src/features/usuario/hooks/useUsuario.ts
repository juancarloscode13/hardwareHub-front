import { useQuery } from '@tanstack/react-query';
import { usuarioApi } from '@/api/endpoints/usuario.api';
import type { PaginationParams } from '@/api/types';

export const USUARIO_KEYS = {
  all: ['usuarios'] as const,
  list: (params?: PaginationParams) => [...USUARIO_KEYS.all, 'list', params] as const,
  detail: (id: number) => [...USUARIO_KEYS.all, 'detail', id] as const,
  followers: (id: number) => [...USUARIO_KEYS.all, 'followers', id] as const,
  following: (id: number) => [...USUARIO_KEYS.all, 'following', id] as const,
};

export function useUsuarios(params?: PaginationParams) {
  return useQuery({
    queryKey: USUARIO_KEYS.list(params),
    queryFn: () => usuarioApi.getAll(params),
  });
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: USUARIO_KEYS.detail(id),
    queryFn: () => usuarioApi.getById(id),
    enabled: id > 0,
  });
}

export function useFollowers(id: number) {
  return useQuery({
    queryKey: USUARIO_KEYS.followers(id),
    queryFn: () => usuarioApi.getFollowers(id),
    enabled: id > 0,
  });
}

export function useFollowing(id: number) {
  return useQuery({
    queryKey: USUARIO_KEYS.following(id),
    queryFn: () => usuarioApi.getFollowing(id),
    enabled: id > 0,
  });
}

