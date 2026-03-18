import { api } from '../axios';
import type { LoginRequestDto } from '@/dto';
import type { LoginResponseDto, UsuarioResponseDto } from '@/dto';

export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then(({ data }) => data),

  logout: () =>
    api.post<void>('/auth/logout').then(({ data }) => data),

  me: () =>
    api.get<UsuarioResponseDto>('/auth/me').then(({ data }) => data),
};


