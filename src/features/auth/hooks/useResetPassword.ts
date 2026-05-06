// Hook para restablecer la contraseña usando el token del email de recuperación
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { ResetPasswordRequestDto } from '@/dto';

/** Establece una nueva contraseña validando el token temporal del email */
export function useResetPassword() {
  return useMutation<{ message: string }, Error, ResetPasswordRequestDto>({
    mutationFn: (data: ResetPasswordRequestDto) => authApi.resetPassword(data),
  });
}