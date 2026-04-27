import { api } from '../axios';
import { cloudinaryApi } from './cloudinary.api';
import type { LoginRequestDto, RegisterRequestDto, ForgotPasswordRequestDto, ResetPasswordRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';


export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  register: async (data: RegisterRequestDto) => {
    let iconoPerfil: string | undefined;

    if (data.avatar) {
      const url = await cloudinaryApi.uploadImage({ file: data.avatar });
      iconoPerfil = url ?? undefined;
    }

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
