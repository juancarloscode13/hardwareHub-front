// Endpoints para publicaciones del foro: CRUD + reacciones + filtrado por usuario
import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type {
  PublicacionRequestDto,
  ReaccionRequestDto,
  PublicacionResponseDto,
  ReaccionConteoDto,
} from '@/dto';

const BASE = '/api/publicaciones';

export const publicacionApi = {
  // Devuelve todas las publicaciones con paginación y filtros
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<PublicacionResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<PublicacionResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: PublicacionRequestDto) =>
    api.post<PublicacionResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: PublicacionRequestDto) =>
    api.put<PublicacionResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),

  // ── Reactions ──────────────────────────────────────────────────────────
  // Añade o actualiza la reacción del usuario en una publicación
  addOrUpdateReaction: (id: number, data: ReaccionRequestDto) =>
    api.post<ReaccionConteoDto>(`${BASE}/${id}/reaccion`, data).then(({ data }) => data),

  // Elimina la reacción del usuario de una publicación
  removeReaction: (id: number, usuarioId: number) =>
    api.delete<void>(`${BASE}/${id}/reaccion/${usuarioId}`).then(({ data }) => data),

  // Devuelve el conteo de reacciones de una publicación
  getReacciones: (id: number) =>
    api.get<ReaccionConteoDto>(`${BASE}/${id}/reacciones`).then(({ data }) => data),

  // ── By User (dynamic filter) ──────────────────────────────────────────
  // Devuelve las publicaciones de un usuario concreto, ordenadas por fecha descendente
  getByUsuarioId: (usuarioId: number, params?: PaginationParams) =>
    api.get<PageResponse<PublicacionResponseDto>>(BASE, {
      params: { ...params, filter: `usuarioId==${usuarioId}`, sort: 'fecha:desc' },
    }).then(({ data }) => data),
};
