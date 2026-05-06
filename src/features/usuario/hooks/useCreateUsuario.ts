// Mutaciones de React Query para crear, actualizar y eliminar usuarios
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioApi, type UpdateProfilePayload } from '@/api/endpoints/usuario.api';
import type { UsuarioRequestDto } from '@/dto';
import { USUARIO_KEYS } from './useUsuario';
import { AUTH_KEYS } from '@/features/auth/hooks/useAuth';

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UsuarioRequestDto) => usuarioApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USUARIO_KEYS.all }),
  });
}

export function useUpdateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsuarioRequestDto }) =>
      usuarioApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.all });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(id) });
    },
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuarioApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USUARIO_KEYS.all }),
  });
}



export function useFollowUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, targetId }: { id: number; targetId: number }) =>
      usuarioApi.follow(id, targetId),
    onSuccess: (_res, { id, targetId }) => {
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(id) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(targetId) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.followers(targetId) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.following(id) });
    },
  });
}

export function useUnfollowUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, targetId }: { id: number; targetId: number }) =>
      usuarioApi.unfollow(id, targetId),
    onSuccess: (_res, { id, targetId }) => {
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(id) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(targetId) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.followers(targetId) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.following(id) });
    },
  });
}



export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfilePayload }) =>
      usuarioApi.updateProfile(id, data),
    onSuccess: (_res, { id }) => {
      
      void qc.invalidateQueries({ queryKey: AUTH_KEYS.me });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.detail(id) });
      void qc.invalidateQueries({ queryKey: USUARIO_KEYS.all });
    },
  });
}


