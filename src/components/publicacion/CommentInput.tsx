import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useCreateComentario } from '@/features/comentario/hooks/useCreateComentario';

interface CommentInputProps {
  publicacionId: number;
  onSent?: () => void;
}

export default function CommentInput({ publicacionId, onSent }: CommentInputProps) {
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
        comentarioId: null,
      },
      {
        onSuccess: () => {
          setText('');
          onSent?.();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        borderTop: '1px solid var(--hw-divider)',
        paddingTop: 14,
        marginTop: 4,
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un comentario…"
        rows={1}
        className="text-hw-input-text placeholder:text-hw-placeholder"
        style={{
          flex: 1,
          resize: 'none',
          background: 'var(--hw-input)',
          border: '1px solid var(--hw-input-border)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: '0.82rem',
          lineHeight: 1.5,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      <Button
        size="icon"
        disabled={!canSend}
        onClick={handleSend}
        className="shrink-0 bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90 disabled:opacity-40"
        style={{ width: 36, height: 36, borderRadius: '50%' }}
        aria-label="Enviar comentario"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

