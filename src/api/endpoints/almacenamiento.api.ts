import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { AlmacenamientoRequestDto } from '@/dto';
import type { AlmacenamientoResponseDto } from '@/dto';

const BASE = '/api/almacenamientos';

export const almacenamientoApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<AlmacenamientoResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<AlmacenamientoResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: AlmacenamientoRequestDto) =>
    api.post<AlmacenamientoResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: AlmacenamientoRequestDto) =>
    api.put<AlmacenamientoResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


