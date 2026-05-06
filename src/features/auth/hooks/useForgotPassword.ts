// Hook para solicitar el email de recuperación de contraseña
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { ForgotPasswordRequestDto } from '@/dto';

/** Envía el email con el enlace de restablecimiento al correo indicado */
export function useForgotPassword() {
  return useMutation<{ message: string }, Error, ForgotPasswordRequestDto>({
    mutationFn: (data: ForgotPasswordRequestDto) => authApi.forgotPassword(data),
  });
}