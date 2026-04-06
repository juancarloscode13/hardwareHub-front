import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ConversationResponseDto } from '@/dto/chat';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useStompConnection } from '@/features/chat/hooks/useStompConnection';
import { cn } from '@/lib/utils';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import StartChatDialog from './StartChatDialog';

// ── Componente ──────────────────────────────────────────────────────────────

/**
 * Layout principal del sistema de mensajería.
 *
 * Panel izquierdo: sidebar colapsable con lista de conversaciones
 * Panel derecho: ventana de chat activa
 *
 * "Si re-renderiza sin motivo, has fallado como desarrollador."
 */
export default function ChatLayout() {
  const { user } = useCurrentUser();
  const location = useLocation();

  // Si se navega desde el perfil de un usuario, la conversación llega en location.state
  const initialConversation =
    (location.state as { initialConversation?: ConversationResponseDto } | null)
      ?.initialConversation ?? null;

  const [activeConversation, setActiveConversation] = useState<ConversationResponseDto | null>(
    initialConversation,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Activar la conexión STOMP mientras el layout esté montado
  useStompConnection();

  // Solo se puede minimizar si hay conversación seleccionada
  const canCollapse = activeConversation !== null;
  const isCollapsed = sidebarCollapsed && canCollapse;

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-0 overflow-hidden rounded-2xl border border-hw-card-border bg-hw-card shadow-(--hw-card-shadow)">
      {/* ── Panel izquierdo: Sidebar de conversaciones ─────────────────── */}
      <div
        className={cn(
          'shrink-0 min-h-0 overflow-hidden border-r border-hw-card-border transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width]',
          isCollapsed ? 'w-[68px]' : 'w-80',
        )}
      >
        <ConversationList
          collapsed={isCollapsed}
          activeConversationId={activeConversation?.id ?? null}
          onSelect={setActiveConversation}
          onNewConversation={() => setDialogOpen(true)}
          onToggleCollapse={canCollapse ? () => setSidebarCollapsed((prev) => !prev) : undefined}
        />
      </div>

      {/* ── Panel derecho: Ventana de chat ─────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatWindow
          conversation={activeConversation}
          currentUserId={user?.id ?? 0}
        />
      </div>

      {/* ── Dialog: Iniciar nueva conversación ──────────────────────────── */}
      <StartChatDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConversationCreated={(conv) => setActiveConversation(conv)}
      />
    </div>
  );
}
