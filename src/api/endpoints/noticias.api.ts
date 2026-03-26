import { api } from '../axios';
import type { NoticiaResponseDto } from '@/dto';

const BASE = '/api/noticias';

export const noticiasApi = {
  getAll: () =>
    api.get<NoticiaResponseDto[]>(BASE).then(({ data }) => data),
};

