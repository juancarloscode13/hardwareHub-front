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
  addOrUpdateReaction: (id: number, data: ReaccionRequestDto) =>
    api.post<ReaccionConteoDto>(`${BASE}/${id}/reaccion`, data).then(({ data }) => data),

  removeReaction: (id: number, usuarioId: number) =>
    api.delete<void>(`${BASE}/${id}/reaccion/${usuarioId}`).then(({ data }) => data),

  getReacciones: (id: number) =>
    api.get<ReaccionConteoDto>(`${BASE}/${id}/reacciones`).then(({ data }) => data),
};


