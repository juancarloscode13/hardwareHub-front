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
    onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      void queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
}


