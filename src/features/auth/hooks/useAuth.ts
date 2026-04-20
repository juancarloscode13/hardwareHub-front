import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { LoginRequestDto, LoginResponseDto } from '@/dto';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};



export function useMe() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.me,
    retry: false,
  });
}



export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponseDto, Error, LoginRequestDto>({
    mutationFn: (data: LoginRequestDto) => authApi.login(data),
    onSuccess: (_response: LoginResponseDto) => {
      
      
      
      
      
      
      void queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      
      
      queryClient.clear();
    },
  });
}


