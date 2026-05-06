// Endpoints para autenticación: login, registro, logout y gestión de contraseña
import { api } from '../axios';
import { cloudinaryApi } from './cloudinary.api';
import type { LoginRequestDto, RegisterRequestDto, ForgotPasswordRequestDto, ResetPasswordRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';


export const authApi = {
  // Inicia sesión con email y contraseña
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  // Registra un nuevo usuario; si incluye avatar, lo sube primero a Cloudinary
  register: async (data: RegisterRequestDto) => {
    let iconoPerfil: string | undefined;

    if (data.avatar) {
      // Sube el avatar y obtiene el public_id de Cloudinary
      const url = await cloudinaryApi.uploadImage({ file: data.avatar });
      iconoPerfil = url ?? undefined;
    }

    return api
      .post<UsuarioResponseDto>('/auth/register', {
        nombre:     data.nombre,
        email:      data.email,
        contrasena: data.contrasena,
        // Solo incluye iconoPerfil si se subió una imagen
        ...(iconoPerfil !== undefined && { iconoPerfil }),
      })
      .then(({ data }) => data);
  },

  // Cierra sesión e invalida la cookie de refresh token
  logout: () =>
    api.post<void>('/auth/logout').then(({ data }) => data),

  // Devuelve el usuario autenticado actual a partir de la cookie de sesión
  me: () =>
    api.get<UsuarioResponseDto>('/auth/me').then(({ data }) => data),

  // Envía un email con el enlace para restablecer contraseña
  forgotPassword: (data: ForgotPasswordRequestDto) =>
    api.post<{ message: string }>('/auth/forgot-password', data).then(({ data }) => data),

  // Establece una nueva contraseña usando el token del email
  resetPassword: (data: ResetPasswordRequestDto) =>
    api.post<{ message: string }>('/auth/reset-password', data).then(({ data }) => data),
};
