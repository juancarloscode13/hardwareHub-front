import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownRight } from 'lucide-react';
import type { ComentarioResponseDto } from '@/dto';
import { useUsuario } from '@/features/usuario/hooks/useUsuario';
import { timeAgo } from '@/lib/date-helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CommentInput from './CommentInput';

// ── Helpers ───────────────────────────────────────────────────────────────

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

// ── ReplyItem — comentario de respuesta (sin más nivel de anidado) ─────────

function ReplyItem({ comentario }: { comentario: ComentarioResponseDto }) {
  const navigate = useNavigate();
  const { data: autor, isLoading } = useUsuario(comentario.usuarioId);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Skeleton className="h-6 w-6 rounded-full shrink-0" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <Skeleton className="h-2.5 w-20 rounded" />
          <Skeleton className="h-2.5 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <button
        onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
        className="shrink-0 cursor-pointer"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <Avatar size="sm">
          {avatarSrc(autor?.iconoPerfil) ? (
            <AvatarImage src={avatarSrc(autor?.iconoPerfil)} alt={autor?.nombre ?? ''} />
          ) : null}
          <AvatarFallback>{getInitials(autor?.nombre)}</AvatarFallback>
        </Avatar>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <button
            onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
            className="text-hw-title font-heading cursor-pointer hover:underline"
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.76rem', fontWeight: 600 }}
          >
            {autor?.nombre ?? 'Usuario'}
          </button>
          <span className="text-hw-subtitle" style={{ fontSize: '0.67rem' }}>
            {timeAgo(comentario.fecha)}
          </span>
        </div>
        <p
          className="text-hw-title/80"
          style={{ fontSize: '0.78rem', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}
        >
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
  const [replyOpen, setReplyOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* ── Comentario principal ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <button
          onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
          className="shrink-0 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <button
              onClick={() => navigate(`/dashboard/usuario/${comentario.usuarioId}`)}
              className="text-hw-title font-heading cursor-pointer hover:underline"
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.8rem', fontWeight: 600 }}
            >
              {autor?.nombre ?? 'Usuario'}
            </button>
            <span className="text-hw-subtitle" style={{ fontSize: '0.7rem' }}>
              {timeAgo(comentario.fecha)}
            </span>
          </div>
          <p
            className="text-hw-title"
            style={{ fontSize: '0.82rem', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}
          >
            {comentario.textoContenido}
          </p>

          {/* Botón Responder */}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setReplyOpen((v) => !v)}
            className="self-start text-hw-subtitle hover:text-hw-accent"
            style={{ marginTop: 2, padding: '2px 6px', height: 'auto', gap: 4 }}
          >
            <CornerDownRight className="h-3 w-3" />
            {replyOpen ? 'Cancelar' : `Responder${replies.length > 0 ? ` (${replies.length})` : ''}`}
          </Button>
        </div>
      </div>

      {/* ── Respuestas anidadas ─────────────────────────────────────── */}
      {replies.length > 0 && (
        <div
          style={{
            marginLeft: 44,
            marginTop: 8,
            paddingLeft: 12,
            borderLeft: '2px solid var(--hw-divider)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {replies.map((r) => (
            <ReplyItem key={r.id} comentario={r} />
          ))}
        </div>
      )}

      {/* ── Input inline de respuesta ───────────────────────────────── */}
      {replyOpen && (
        <div style={{ marginLeft: 44, marginTop: 8 }}>
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



