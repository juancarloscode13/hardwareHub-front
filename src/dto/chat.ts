// ── Chat DTOs ────────────────────────────────────────────────────────────────

/** Mensaje individual en una conversación */
export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderNombre: string;
  content: string;
  sentAt: string; // ISO 8601
  read: boolean;
}

/** Resumen de conversación (lista lateral) */
export interface ConversationResponseDto {
  id: number;
  otherUserId: number;
  otherUserNombre: string;
  otherUserIconoPerfil: string | null; // base64
  lastMessageContent: string | null;
  lastMessageAt: string | null; // ISO 8601
  unreadCount: number;
}

/** Payload para crear/recuperar una conversación */
export interface CreateConversationRequestDto {
  targetUserId: number;
}

/** Payload que se envía vía STOMP para un nuevo mensaje */
export interface SendMessagePayload {
  conversationId: number;
  content: string;
}

/** Payload que se envía vía STOMP para marcar leído */
export interface ReadConversationPayload {
  conversationId: number;
}

