import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { FabricanteRequestDto, FabricanteResponseDto } from '@/dto';

const BASE = '/api/fabricantes';

export const fabricanteApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<FabricanteResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<FabricanteResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: FabricanteRequestDto) =>
    api.post<FabricanteResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: FabricanteRequestDto) =>
    api.put<FabricanteResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


