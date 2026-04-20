


export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderNombre: string;
  content: string;
  sentAt: string; 
  read: boolean;
}


export interface ConversationResponseDto {
  id: number;
  otherUserId: number;
  otherUserNombre: string;
  otherUserIconoPerfil: string | null; 
  lastMessageContent: string | null;
  lastMessageAt: string | null; 
  unreadCount: number;
}


export interface CreateConversationRequestDto {
  targetUserId: number;
}


export interface SendMessagePayload {
  conversationId: number;
  content: string;
}


export interface ReadConversationPayload {
  conversationId: number;
}

