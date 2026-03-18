import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { CpuRequestDto, CpuResponseDto } from '@/dto';

const BASE = '/api/cpus';

export const cpuApi = {
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<CpuResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<CpuResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: CpuRequestDto) =>
    api.post<CpuResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: CpuRequestDto) =>
    api.put<CpuResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};


