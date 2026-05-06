// Endpoint para obtener las noticias tecnológicas (solo lectura, sin CRUD)
import { api } from '../axios';
import type { NoticiaResponseDto } from '@/dto';

const BASE = '/api/noticias';

export const noticiasApi = {
  // Devuelve el listado completo de noticias agregadas desde fuentes externas
  getAll: () =>
    api.get<NoticiaResponseDto[]>(BASE).then(({ data }) => data),
};
