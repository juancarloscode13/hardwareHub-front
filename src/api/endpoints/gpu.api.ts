import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { GpuRequestDto, GpuResponseDto } from '@/dto';

const BASE = '/api/gpus';

export const gpuApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<GpuResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<GpuResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: GpuRequestDto) =>
    api.post<GpuResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: GpuRequestDto) =>
    api.put<GpuResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


