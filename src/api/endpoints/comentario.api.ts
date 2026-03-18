import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { ComentarioRequestDto, ComentarioResponseDto } from '@/dto';

const BASE = '/api/comentarios';

export const comentarioApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<ComentarioResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<ComentarioResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: ComentarioRequestDto) =>
    api.post<ComentarioResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: ComentarioRequestDto) =>
    api.put<ComentarioResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


