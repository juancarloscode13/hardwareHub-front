import { useNavigate } from 'react-router-dom';
import type { ComentarioResponseDto } from '@/dto';
import { useUsuario } from '@/features/usuario/hooks/useUsuario';
import { timeAgo } from '@/lib/date-helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

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

// ── Component ─────────────────────────────────────────────────────────────

interface CommentItemProps {
  comentario: ComentarioResponseDto;
}

export default function CommentItem({ comentario }: CommentItemProps) {
  const navigate = useNavigate();
  const { data: autor, isLoading } = useUsuario(comentario.usuarioId);

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
        <p className="text-hw-title" style={{ fontSize: '0.82rem', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
          {comentario.textoContenido}
        </p>
      </div>
    </div>
  );
}

