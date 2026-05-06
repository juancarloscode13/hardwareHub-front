// Hook para registrar un nuevo usuario en el sistema
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { RegisterRequestDto } from '@/dto';
import type { UsuarioResponseDto } from '@/dto';

/** Mutación de registro: sube el avatar a Cloudinary si se proporciona y crea el usuario */
export function useRegister() {
  return useMutation<UsuarioResponseDto, Error, RegisterRequestDto>({
    mutationFn: (data: RegisterRequestDto) => authApi.register(data),
  });
}
