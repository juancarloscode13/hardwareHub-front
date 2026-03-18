import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { RamRequestDto, RamResponseDto } from '@/dto';

const BASE = '/api/rams';

export const ramApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<RamResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<RamResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: RamRequestDto) =>
    api.post<RamResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: RamRequestDto) =>
    api.put<RamResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


