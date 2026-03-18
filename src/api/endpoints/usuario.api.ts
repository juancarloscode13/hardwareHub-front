import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { UsuarioRequestDto, UsuarioResponseDto } from '@/dto';

const BASE = '/api/usuarios';

export const usuarioApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<UsuarioResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<UsuarioResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: UsuarioRequestDto) =>
    api.post<UsuarioResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: UsuarioRequestDto) =>
    api.put<UsuarioResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),

  // ── Followers ──────────────────────────────────────────────────────────
  follow: (id: number, targetId: number) =>
    api.post<UsuarioResponseDto>(`${BASE}/${id}/follow/${targetId}`).then(({ data }) => data),

  unfollow: (id: number, targetId: number) =>
    api.delete<UsuarioResponseDto>(`${BASE}/${id}/follow/${targetId}`).then(({ data }) => data),

  getFollowers: (id: number) =>
    api.get<UsuarioResponseDto[]>(`${BASE}/${id}/followers`).then(({ data }) => data),

  getFollowing: (id: number) =>
    api.get<UsuarioResponseDto[]>(`${BASE}/${id}/following`).then(({ data }) => data),
};


