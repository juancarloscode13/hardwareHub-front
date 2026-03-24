import { api } from '../axios';
import type { LoginRequestDto, RegisterRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';

export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  /**
   * Registro de nuevo usuario.
   * Envía los datos como multipart/form-data para soportar avatar (File).
   * Si el backend no acepta multipart, adaptar a JSON eliminando el avatar.
   */
  register: (data: RegisterRequestDto) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('email', data.email);
    formData.append('contrasena', data.contrasena);
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    return api
      .post<UsuarioResponseDto>('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => data);
  },

  logout: () =>
    api.post<void>('/auth/logout').then(({ data }) => data),

  me: () =>
    api.get<UsuarioResponseDto>('/auth/me').then(({ data }) => data),
};


