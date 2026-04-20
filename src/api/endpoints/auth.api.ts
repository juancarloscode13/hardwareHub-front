import { api } from '../axios';
import type { LoginRequestDto, RegisterRequestDto, ForgotPasswordRequestDto, ResetPasswordRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';


function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); 
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  
  register: async (data: RegisterRequestDto) => {
    const iconoPerfil = data.avatar ? await fileToBase64(data.avatar) : undefined;

    return api
      .post<UsuarioResponseDto>('/auth/register', {
        nombre:     data.nombre,
        email:      data.email,
        contrasena: data.contrasena,
        ...(iconoPerfil !== undefined && { iconoPerfil }),
      })
      .then(({ data }) => data);
  },

  logout: () =>
    api.post<void>('/auth/logout').then(({ data }) => data),

  me: () =>
    api.get<UsuarioResponseDto>('/auth/me').then(({ data }) => data),

  forgotPassword: (data: ForgotPasswordRequestDto) =>
    api.post<{ message: string }>('/auth/forgot-password', data).then(({ data }) => data),

  resetPassword: (data: ResetPasswordRequestDto) =>
    api.post<{ message: string }>('/auth/reset-password', data).then(({ data }) => data),
};
