import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { PlacaBaseRequestDto, PlacaBaseResponseDto } from '@/dto';

const BASE = '/api/placas-base';

export const placaBaseApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<PlacaBaseResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<PlacaBaseResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: PlacaBaseRequestDto) =>
    api.post<PlacaBaseResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: PlacaBaseRequestDto) =>
    api.put<PlacaBaseResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


