import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { RegisterRequestDto } from '@/dto';
import type { UsuarioResponseDto } from '@/dto';

export function useRegister() {
  return useMutation<UsuarioResponseDto, Error, RegisterRequestDto>({
    mutationFn: (data: RegisterRequestDto) => authApi.register(data),
  });
}

