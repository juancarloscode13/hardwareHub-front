// Endpoints CRUD para la entidad Montaje + consulta por usuario
import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { MontajeRequestDto, MontajeResponseDto } from '@/dto';

const BASE = '/api/montajes';

export const montajeApi = {
  // Devuelve todos los montajes con paginación
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<MontajeResponseDto>>(BASE, { params }).then(({ data }) => data),

  // Obtiene un montaje por su ID
  getById: (id: number) =>
    api.get<MontajeResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  // Crea un nuevo montaje con los IDs de componentes seleccionados
  create: (data: MontajeRequestDto) =>
    api.post<MontajeResponseDto>(BASE, data).then(({ data }) => data),

  // Actualiza un montaje existente
  update: (id: number, data: MontajeRequestDto) =>
    api.put<MontajeResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  // Elimina un montaje por su ID
  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),

  // Devuelve los montajes de un usuario específico, ordenados por ID descendente
  getByUsuarioId: (usuarioId: number, params?: PaginationParams) =>
    api.get<PageResponse<MontajeResponseDto>>(BASE, {
      params: { ...params, filter: `usuarioId==${usuarioId}`, sort: 'id:desc' },
    }).then(({ data }) => data),
};
