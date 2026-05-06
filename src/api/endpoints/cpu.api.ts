// Endpoints CRUD para la entidad CPU
import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { CpuRequestDto, CpuResponseDto } from '@/dto';

const BASE = '/api/cpus';

export const cpuApi = {
  // Devuelve todas las CPUs con soporte de paginación y filtros
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<CpuResponseDto>>(BASE, { params }).then(({ data }) => data),

  // Obtiene una CPU por su ID
  getById: (id: number) =>
    api.get<CpuResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  // Crea una nueva CPU
  create: (data: CpuRequestDto) =>
    api.post<CpuResponseDto>(BASE, data).then(({ data }) => data),

  // Actualiza una CPU existente
  update: (id: number, data: CpuRequestDto) =>
    api.put<CpuResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  // Elimina una CPU por su ID
  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};
