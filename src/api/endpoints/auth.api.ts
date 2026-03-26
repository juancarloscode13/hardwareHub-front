import { api } from '../axios';
import type { LoginRequestDto, RegisterRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';

// ── Helper: File → base64 sin el prefijo "data:…;base64," ────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // solo la parte base64 pura
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  /**
   * Registro de nuevo usuario.
   * El backend espera @RequestBody JSON:
   *   { nombre, email, contrasena, iconoPerfil? }
   * iconoPerfil es byte[] en Java → base64 string en JSON.
   */
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
};
