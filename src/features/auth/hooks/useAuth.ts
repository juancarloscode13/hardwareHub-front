import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { LoginRequestDto, LoginResponseDto } from '@/dto';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.me,
    retry: false,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponseDto, Error, LoginRequestDto>({
    mutationFn: (data: LoginRequestDto) => authApi.login(data),
    onSuccess: (_response: LoginResponseDto) => {
      // Las cookies access_token y refresh_token se setean automáticamente
      // por el navegador gracias a withCredentials: true.
      //
      // _response.role (UsuarioRol) está disponible para el componente
      // que llame a login.mutate(data, { onSuccess: (response) => ... })
      // y quiera redirigir según el rol sin lógica de navegación aquí.
      void queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Las cookies se borran automáticamente por el backend (Max-Age=0).
      // Limpiamos toda la caché de React Query.
      queryClient.clear();
    },
  });
}


