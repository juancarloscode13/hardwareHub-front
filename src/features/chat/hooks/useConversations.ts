import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { chatApi } from '@/api/endpoints/chat.api';



export const CONVERSATION_KEYS = {
  all: ['conversations'] as const,
  list: () => [...CONVERSATION_KEYS.all, 'list'] as const,
};



export function useConversations() {
  return useQuery({
    queryKey: CONVERSATION_KEYS.list(),
    queryFn: () => chatApi.getConversations(),
  });
}



export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetUserId: number) => chatApi.createConversation(targetUserId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
    },
  });
}



export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
    },
  });
}

