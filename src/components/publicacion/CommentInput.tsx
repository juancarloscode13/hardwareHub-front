// Componente CommentInput: encapsula logica y presentacion de foro/publicaciones.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useCreateComentario } from '@/features/comentario/hooks/useCreateComentario';

interface CommentInputProps {
  publicacionId: number;
  
  comentarioId?: number | null;
  
  placeholder?: string;
  
  onCancel?: () => void;
  onSent?: () => void;
}

export default function CommentInput({
  publicacionId,
  comentarioId = null,
  placeholder = 'Escribe un comentario…',
  onCancel,
  onSent,
}: CommentInputProps) {
  const { user } = useCurrentUser();
  const createComentario = useCreateComentario();
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0 && !createComentario.isPending;

  const handleSend = () => {
    if (!canSend || !user) return;
    createComentario.mutate(
      {
        textoContenido: text.trim(),
        publicacionId,
        usuarioId: user.id,
        likes: 0,
        comentarioId: comentarioId ?? null,
      },
      {
        onSuccess: () => {
          setText('');
          onSent?.();
          onCancel?.();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  return (
    <div className={`hw-comment-input-wrap ${onCancel ? '' : 'hw-comment-input-wrap--border'}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        autoFocus={!!onCancel}
        className="text-hw-input-text placeholder:text-hw-placeholder hw-comment-textarea"
      />
      {onCancel && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="shrink-0 hw-comment-send-btn"
          aria-label="Cancelar respuesta"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        size="icon"
        disabled={!canSend}
        onClick={handleSend}
        className="shrink-0 bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90 disabled:opacity-40 hw-comment-send-btn"
        aria-label="Enviar comentario"
      >
        <Send className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}



