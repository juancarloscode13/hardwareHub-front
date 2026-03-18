import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { CajaRequestDto, CajaResponseDto } from '@/dto';

const BASE = '/api/cajas';

export const cajaApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<CajaResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<CajaResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: CajaRequestDto) =>
    api.post<CajaResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: CajaRequestDto) =>
    api.put<CajaResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


