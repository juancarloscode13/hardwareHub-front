import { useState } from 'react';
import { Search, MessageCirclePlus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useConversations } from '@/features/chat/hooks/useConversations';
import type { ConversationResponseDto } from '@/dto/chat';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConversationListItem from './ConversationListItem';
import { cn } from '@/lib/utils';

// ── Props ───────────────────────────────────────────────────────────────────

interface ConversationListProps {
  activeConversationId: number | null;
  collapsed: boolean;
  onSelect: (conversation: ConversationResponseDto) => void;
  onNewConversation: () => void;
  onToggleCollapse?: () => void;
}

// ── Componente ──────────────────────────────────────────────────────────────

export default function ConversationList({
  activeConversationId,
  collapsed,
  onSelect,
  onNewConversation,
  onToggleCollapse,
}: ConversationListProps) {
  const { data: conversations, isLoading } = useConversations();
  const [search, setSearch] = useState('');

  const filtered = (conversations ?? []).filter((c) =>
    c.otherUserNombre.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          'hw-chat-sidebar-header flex shrink-0 items-center gap-1 border-b border-hw-card-border py-3',
          collapsed
            ? 'hw-chat-sidebar-header-collapsed flex-col justify-center px-3'
            : 'hw-chat-sidebar-header-expanded justify-between px-5',
        )}
      >
        {!collapsed && (
          <h2 className="hw-chat-sidebar-title min-w-0 flex-1 font-heading">
            Mensajes
          </h2>
        )}

        <div className={cn('hw-chat-sidebar-actions flex shrink-0 items-center', collapsed && 'flex-col')}>
          {/* Toggle collapse */}
          {onToggleCollapse && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-hw-title"
                    aria-label={collapsed ? 'Expandir panel' : 'Minimizar panel'}
                  >
                    {collapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                  <TooltipContent side={collapsed ? 'right' : 'bottom'} sideOffset={8}>
                  {collapsed ? 'Expandir panel' : 'Minimizar panel'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* New conversation button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onNewConversation}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-hw-accent transition-colors hover:bg-muted"
                  aria-label="Nueva conversación"
                >
                  <MessageCirclePlus className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? 'right' : 'bottom'} sideOffset={8}>
                Nueva conversación
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Buscador (oculto cuando está colapsado) */}
      {!collapsed && (
        <div className="hw-chat-sidebar-search mt-2 shrink-0 px-5 pb-3 pt-2">
          <InputGroup className="h-9 rounded-xl pl-2">
            <InputGroupAddon
              align="inline-start"
              className="hw-chat-sidebar-search-addon text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversación…"
              className="hw-chat-sidebar-search-input h-full text-sm"
            />
          </InputGroup>
        </div>
      )}

      {/* Lista */}
      <div
        className={cn(
          'hw-chat-sidebar-list min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        {isLoading ? (
          <div className={cn('flex flex-col gap-2 pt-1', collapsed ? 'items-center px-1' : 'px-1')}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 rounded-xl',
                  collapsed ? 'justify-center p-2' : 'px-3 py-2.5',
                )}
              >
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                {!collapsed && (
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            {collapsed ? '' : search ? 'Sin resultados' : 'No hay conversaciones'}
          </div>
        ) : (
          <div className={cn('flex flex-col', collapsed ? 'gap-1' : 'gap-1')}>
            {filtered.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                collapsed={collapsed}
                onClick={() => onSelect(conv)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
