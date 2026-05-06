// Endpoints CRUD para la entidad GPU
import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { GpuRequestDto, GpuResponseDto } from '@/dto';

const BASE = '/api/gpus';

export const gpuApi = {
  // Devuelve todas las GPUs con soporte de paginación y filtros
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<GpuResponseDto>>(BASE, { params }).then(({ data }) => data),

  // Obtiene una GPU por su ID
  getById: (id: number) =>
    api.get<GpuResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  // Crea una nueva GPU
  create: (data: GpuRequestDto) =>
    api.post<GpuResponseDto>(BASE, data).then(({ data }) => data),

  // Actualiza una GPU existente
  update: (id: number, data: GpuRequestDto) =>
    api.put<GpuResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  // Elimina una GPU por su ID
  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),
};
