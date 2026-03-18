import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { MontajeRequestDto, MontajeResponseDto } from '@/dto';

const BASE = '/api/montajes';

export const montajeApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<MontajeResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<MontajeResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: MontajeRequestDto) =>
    api.post<MontajeResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: MontajeRequestDto) =>
    api.put<MontajeResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


