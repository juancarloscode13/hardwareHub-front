import { useState, useEffect } from 'react';
import { MessageCirclePlus } from 'lucide-react';
import { useUsuarios } from '@/features/usuario/hooks/useUsuario';
import { useCreateConversation } from '@/features/chat/hooks/useConversations';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { UsuarioResponseDto } from '@/dto';
import type { ConversationResponseDto } from '@/dto/chat';



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  if (!iconoPerfil) return undefined;
  if (iconoPerfil.startsWith('data:')) return iconoPerfil;
  return `data:image/png;base64,${iconoPerfil}`;
}

function sanitizeDslValue(value: string): string {
  return value.trim().replace(/[;~]/g, ' ');
}

// ── Props ─────────────────────────────────────────────────────────────────

interface StartChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Callback opcional al crear la conversación. Si no se provee, navega a /mensajes. */
  onConversationCreated?: (conv: ConversationResponseDto) => void;
}

// ── Componente ────────────────────────────────────────────────────────────

/**
 * Dialog para buscar un usuario e iniciar una conversación con él.
 *
 * - Búsqueda reactiva con debounce (400 ms)
 * - Excluye al usuario autenticado de los resultados
 * - Llama a createConversation al seleccionar → crea o recupera la existente
 */
export default function StartChatDialog({
  open,
  onOpenChange,
  onConversationCreated,
}: StartChatDialogProps) {
  const { user: currentUser } = useCurrentUser();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce: espera 400 ms tras el último keystroke antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Resetear estado al cerrar el dialog sin usar setState en efecto
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery('');
      setDebouncedQuery('');
    }
    onOpenChange(next);
  };

  const { data: usersData, isLoading: usersLoading } = useUsuarios(
    debouncedQuery.trim().length >= 2
      ? { filter: `nombre~${sanitizeDslValue(debouncedQuery)}`, size: 20 }
      : undefined,
  );

  const createConversation = useCreateConversation();

  const handleSelect = (usuario: UsuarioResponseDto) => {
    createConversation.mutate(usuario.id, {
      onSuccess: (conv) => {
        onOpenChange(false);
        onConversationCreated?.(conv);
      },
    });
  };

  // Excluir al propio usuario de los resultados
  const results = (usersData?.content ?? []).filter((u) => u.id !== currentUser?.id);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="hw-start-chat-dialog">
        <DialogHeader className="hw-start-chat-dialog-header">
          <DialogTitle>
            <span className="hw-dialog-title-icon">
              <MessageCirclePlus className="h-5 w-5 text-hw-accent" />
              Nuevo mensaje
            </span>
          </DialogTitle>
          <DialogDescription>
            Busca un usuario para iniciar una conversación.
          </DialogDescription>
        </DialogHeader>

        {/* Input de búsqueda */}
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="hw-start-chat-dialog-input"
          placeholder="Buscar por nombre…"
        />

        {/* Resultados */}
        <div className="hw-search-results hw-start-chat-dialog-results">
          {/* Estado vacío: query muy corta */}
          {debouncedQuery.length < 2 && (
            <p className="text-hw-subtitle text-center pt-8 text-[0.85rem]">
              Escribe al menos 2 caracteres para buscar.
            </p>
          )}

          {/* Cargando */}
          {debouncedQuery.length >= 2 && usersLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="hw-skeleton-list-row">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}

          {/* Sin resultados */}
          {debouncedQuery.length >= 2 && !usersLoading && results.length === 0 && (
            <p className="text-hw-subtitle text-center pt-8 text-[0.85rem]">
              No se encontraron usuarios con ese nombre.
            </p>
          )}

          {/* Lista de usuarios */}
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => handleSelect(u)}
              disabled={createConversation.isPending}
              className="hw-user-result-btn hw-user-result-btn-hover"
            >
              <Avatar size="sm">
                {avatarSrc(u.iconoPerfil) ? (
                  <AvatarImage src={avatarSrc(u.iconoPerfil)} alt={u.nombre} />
                ) : null}
                <AvatarFallback>{getInitials(u.nombre)}</AvatarFallback>
              </Avatar>
              <span className="text-hw-title text-[0.88rem] font-medium">
                {u.nombre}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


