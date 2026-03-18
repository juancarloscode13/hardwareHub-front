import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { RefrigeracionRequestDto, RefrigeracionResponseDto } from '@/dto';

const BASE = '/api/refrigeraciones';

export const refrigeracionApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<RefrigeracionResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<RefrigeracionResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: RefrigeracionRequestDto) =>
    api.post<RefrigeracionResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: RefrigeracionRequestDto) =>
    api.put<RefrigeracionResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


