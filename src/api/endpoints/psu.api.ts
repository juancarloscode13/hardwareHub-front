import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { PsuRequestDto, PsuResponseDto } from '@/dto';

const BASE = '/api/psus';

export const psuApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<PsuResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<PsuResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: PsuRequestDto) =>
    api.post<PsuResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: PsuRequestDto) =>
    api.put<PsuResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


