// DTOs del sistema de chat en tiempo real (WebSocket STOMP)

/** Mensaje individual dentro de una conversación */
export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderNombre: string;
  content: string;
  sentAt: string;  // ISO 8601
  read: boolean;   // true si el receptor ya leyó el mensaje
}

/** Conversación entre dos usuarios con resumen del último mensaje */
export interface ConversationResponseDto {
  id: number;
  otherUserId: number;
  otherUserNombre: string;
  otherUserIconoPerfil: string | null;
  lastMessageContent: string | null;
  lastMessageAt: string | null;  // ISO 8601
  unreadCount: number;           // Mensajes no leídos para el usuario actual
}

/** Payload para crear o recuperar una conversación con otro usuario */
export interface CreateConversationRequestDto {
  targetUserId: number;
}

/** Payload STOMP para enviar un mensaje */
export interface SendMessagePayload {
  conversationId: number;
  content: string;
}

/** Payload STOMP para marcar como leídos los mensajes de una conversación */
export interface ReadConversationPayload {
  conversationId: number;
}
