// Endpoints para el sistema de chat: conversaciones y mensajes
import { api } from '../axios';
import type { PageResponse } from '../types';
import type {
  ConversationResponseDto,
  MessageResponseDto,
  CreateConversationRequestDto,
} from '@/dto/chat';

const BASE = '/api/conversations';

export const chatApi = {
  // Devuelve todas las conversaciones del usuario autenticado
  getConversations: () =>
    api.get<ConversationResponseDto[]>(BASE).then(({ data }) => data),

  // Devuelve los mensajes de una conversación con paginación (más antiguos primero)
  getMessages: (conversationId: number, page = 0, size = 20) =>
    api
      .get<PageResponse<MessageResponseDto>>(`${BASE}/${conversationId}/messages`, {
        params: { page, size },
      })
      .then(({ data }) => data),

  /** Crea o recupera una conversación con otro usuario */
  createConversation: (targetUserId: number) =>
    api
      .post<ConversationResponseDto>(BASE, { targetUserId } satisfies CreateConversationRequestDto)
      .then(({ data }) => data),

  /** Marca todos los mensajes de la conversación como leídos */
  markAsRead: (conversationId: number) =>
    api.patch<void>(`${BASE}/${conversationId}/read`).then(({ data }) => data),
};
