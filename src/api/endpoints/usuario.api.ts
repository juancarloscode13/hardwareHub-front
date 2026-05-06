// Endpoints para usuarios: CRUD, actualización de perfil y sistema de seguidores
import { api } from '../axios';
import type { PageResponse, PaginationParams } from '../types';
import type { UsuarioRequestDto, UsuarioResponseDto } from '@/dto';

const BASE = '/api/usuarios';

/** Payload específico para actualizar el perfil propio (incluye avatar) */
export interface UpdateProfilePayload {
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
  iconoPerfil?: string | null; // public_id de Cloudinary, null para eliminar la foto
}

export const usuarioApi = {
  // Devuelve todos los usuarios con paginación
  getAll: (params?: PaginationParams) =>
    api.get<PageResponse<UsuarioResponseDto>>(BASE, { params }).then(({ data }) => data),

  getById: (id: number) =>
    api.get<UsuarioResponseDto>(`${BASE}/${id}`).then(({ data }) => data),

  create: (data: UsuarioRequestDto) =>
    api.post<UsuarioResponseDto>(BASE, data).then(({ data }) => data),

  update: (id: number, data: UsuarioRequestDto) =>
    api.put<UsuarioResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  /** PUT que incluye iconoPerfil para actualizar perfil propio */
  updateProfile: (id: number, data: UpdateProfilePayload) =>
    api.put<UsuarioResponseDto>(`${BASE}/${id}`, data).then(({ data }) => data),

  deleteById: (id: number) =>
    api.delete<void>(`${BASE}/${id}`).then(({ data }) => data),

  // ── Followers ──────────────────────────────────────────────────────────
  // Sigue a otro usuario
  follow: (id: number, targetId: number) =>
    api.post<UsuarioResponseDto>(`${BASE}/${id}/follow/${targetId}`).then(({ data }) => data),

  // Deja de seguir a otro usuario
  unfollow: (id: number, targetId: number) =>
    api.delete<UsuarioResponseDto>(`${BASE}/${id}/follow/${targetId}`).then(({ data }) => data),

  // Obtiene la lista de seguidores de un usuario
  getFollowers: (id: number) =>
    api.get<UsuarioResponseDto[]>(`${BASE}/${id}/followers`).then(({ data }) => data),

  // Obtiene la lista de usuarios a los que sigue un usuario
  getFollowing: (id: number) =>
    api.get<UsuarioResponseDto[]>(`${BASE}/${id}/following`).then(({ data }) => data),
};
