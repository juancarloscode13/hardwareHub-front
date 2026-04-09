import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useCreateComentario } from '@/features/comentario/hooks/useCreateComentario';

interface CommentInputProps {
  publicacionId: number;
  /** Si se pasa, se crea como respuesta a ese comentario */
  comentarioId?: number | null;
  /** Placeholder personalizado */
  placeholder?: string;
  /** Muestra botón cancelar (para uso inline en respuestas) */
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
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        borderTop: onCancel ? 'none' : '1px solid var(--hw-divider)',
        paddingTop: onCancel ? 0 : 14,
        marginTop: onCancel ? 0 : 4,
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        autoFocus={!!onCancel}
        className="text-hw-input-text placeholder:text-hw-placeholder"
        style={{
          flex: 1,
          resize: 'none',
          background: 'var(--hw-input)',
          border: '1px solid var(--hw-input-border)',
          borderRadius: 10,
          padding: '8px 12px',
          fontSize: '0.8rem',
          lineHeight: 1.5,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      {onCancel && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="shrink-0"
          style={{ width: 32, height: 32, borderRadius: '50%' }}
          aria-label="Cancelar respuesta"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        size="icon"
        disabled={!canSend}
        onClick={handleSend}
        className="shrink-0 bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90 disabled:opacity-40"
        style={{ width: 32, height: 32, borderRadius: '50%' }}
        aria-label="Enviar comentario"
      >
        <Send className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}



