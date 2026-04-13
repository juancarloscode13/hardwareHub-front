import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { ResetPasswordRequestDto } from '@/dto';
export function useResetPassword() {
  return useMutation<{ message: string }, Error, ResetPasswordRequestDto>({
    mutationFn: (data: ResetPasswordRequestDto) => authApi.resetPassword(data),
  });
}