import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownRight } from 'lucide-react';
import type { ComentarioResponseDto } from '@/dto';
import { useUsuario } from '@/features/usuario/hooks/useUsuario';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { timeAgo } from '@/lib/date-helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CommentInput from './CommentInput';



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  return iconoPerfil ?? undefined;
}

// ── ReplyItem — comentario de respuesta (sin más nivel de anidado) ─────────

function ReplyItem({ comentario }: { comentario: ComentarioResponseDto }) {
  const navigate = useNavigate();
  const { data: autor, isLoading } = useUsuario(comentario.usuarioId);

  if (isLoading) {
    return (
      <div className="hw-comment-row-sm">
        <Skeleton className="h-6 w-6 rounded-full shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <Skeleton className="h-2.5 w-20 rounded" />
          <Skeleton className="h-2.5 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="hw-comment-row-sm">
      <button
        onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
        className="shrink-0 cursor-pointer hw-btn-reset"
      >
        <Avatar size="sm">
          {avatarSrc(autor?.iconoPerfil) ? (
            <AvatarImage src={avatarSrc(autor?.iconoPerfil)} alt={autor?.nombre ?? ''} />
          ) : null}
          <AvatarFallback>{getInitials(autor?.nombre)}</AvatarFallback>
        </Avatar>
      </button>

      <div className="hw-comment-body">
        <div className="hw-comment-meta">
          <button
            onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
            className="text-hw-title font-heading cursor-pointer hover:underline hw-comment-name-sm"
          >
            {autor?.nombre ?? 'Usuario'}
          </button>
          <span className="text-hw-subtitle text-[0.67rem]">
            {timeAgo(comentario.fecha)}
          </span>
        </div>
        <p className="text-hw-title/80 hw-comment-text-sm">
          {comentario.textoContenido}
        </p>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface CommentItemProps {
  comentario: ComentarioResponseDto;
  /** Respuestas directas a este comentario */
  replies?: ComentarioResponseDto[];
  publicacionId: number;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function CommentItem({ comentario, replies = [], publicacionId }: CommentItemProps) {
  const navigate = useNavigate();
  const { data: autor, isLoading } = useUsuario(comentario.usuarioId);
  const { user: currentUser } = useCurrentUser();
  const [replyOpen, setReplyOpen] = useState(false);

  const isOwnComment = !!currentUser && currentUser.id === comentario.usuarioId;

  if (isLoading) {
    return (
      <div className="hw-comment-row">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Comentario principal ────────────────────────────────────── */}
      <div className="hw-comment-row">
        {/* Avatar */}
        <button
          onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
          className="shrink-0 cursor-pointer hw-btn-reset"
          aria-label={`Ver perfil de ${autor?.nombre ?? 'usuario'}`}
        >
          <Avatar size="default">
            {avatarSrc(autor?.iconoPerfil) ? (
              <AvatarImage src={avatarSrc(autor?.iconoPerfil)} alt={autor?.nombre ?? ''} />
            ) : null}
            <AvatarFallback>{getInitials(autor?.nombre)}</AvatarFallback>
          </Avatar>
        </button>

        {/* Content */}
        <div className="hw-comment-body">
          <div className="hw-comment-meta">
            <button
              onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
              className="text-hw-title font-heading cursor-pointer hover:underline hw-comment-name"
            >
              {autor?.nombre ?? 'Usuario'}
            </button>
            <span className="text-hw-subtitle text-[0.7rem]">
              {timeAgo(comentario.fecha)}
            </span>
          </div>
          <p className="text-hw-title hw-comment-text">
            {comentario.textoContenido}
          </p>

          {/* Botón Responder — solo si no es el propio autor */}
          {!isOwnComment && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setReplyOpen((v) => !v)}
              className="self-start text-hw-subtitle hover:text-hw-accent hw-reply-btn"
            >
              <CornerDownRight className="h-3 w-3" />
              {replyOpen ? 'Cancelar' : `Responder${replies.length > 0 ? ` (${replies.length})` : ''}`}
            </Button>
          )}
        </div>
      </div>

      {}
      {replies.length > 0 && (
        <div className="hw-reply-thread">
          {replies.map((r) => (
            <ReplyItem key={r.id} comentario={r} />
          ))}
        </div>
      )}

      {}
      {replyOpen && (
        <div className="hw-reply-input-wrap">
          <CommentInput
            publicacionId={publicacionId}
            comentarioId={comentario.id}
            placeholder={`Respondiendo a ${autor?.nombre ?? 'este comentario'}…`}
            onCancel={() => setReplyOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

