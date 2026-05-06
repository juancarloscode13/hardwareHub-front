// Hooks de React Query para gestionar conversaciones del chat
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { chatApi } from '@/api/endpoints/chat.api';

// Claves de React Query para las conversaciones
export const CONVERSATION_KEYS = {
  all:  ['conversations'] as const,
  list: () => [...CONVERSATION_KEYS.all, 'list'] as const,
};

/** Carga las conversaciones activas del usuario autenticado */
export function useConversations() {
  return useQuery({
    queryKey: CONVERSATION_KEYS.list(),
    queryFn: () => chatApi.getConversations(),
  });
}

/** Crea o recupera una conversación con otro usuario e invalida la lista */
export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetUserId: number) => chatApi.createConversation(targetUserId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
    },
  });
}

/** Marca todos los mensajes de una conversación como leídos */
export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
    },
  });
}
