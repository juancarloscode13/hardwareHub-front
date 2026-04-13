import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth.api';
import type { ForgotPasswordRequestDto } from '@/dto';
export function useForgotPassword() {
  return useMutation<{ message: string }, Error, ForgotPasswordRequestDto>({
    mutationFn: (data: ForgotPasswordRequestDto) => authApi.forgotPassword(data),
  });
}