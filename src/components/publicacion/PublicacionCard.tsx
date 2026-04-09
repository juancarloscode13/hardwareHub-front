import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import type { PublicacionResponseDto, UsuarioResponseDto } from '@/dto';
import { timeAgo } from '@/lib/date-helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ReactionDropdown from './ReactionDropdown';
import CommentsDialog from './CommentsDialog';
import MontajePreviewCard from '@/components/montaje/MontajePreviewCard';

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

function multimediaSrc(multimedia: string | null | undefined): string | undefined {
  if (!multimedia) return undefined;
  if (multimedia.startsWith('data:')) return multimedia;
  return `data:image/jpeg;base64,${multimedia}`;
}

// ── Props ─────────────────────────────────────────────────────────────────

interface PublicacionCardProps {
  publicacion: PublicacionResponseDto;
  autor: UsuarioResponseDto;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function PublicacionCard({ publicacion, autor }: PublicacionCardProps) {
  const navigate = useNavigate();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const imgSrc = multimediaSrc(publicacion.multimedia);

  return (
    <article
      className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl"
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* ── Header: avatar + name + date ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate(`/dashboard/usuario/${autor.id}`)}
          className="shrink-0 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
          aria-label={`Ver perfil de ${autor.nombre}`}
        >
          <Avatar size="lg">
            {avatarSrc(autor.iconoPerfil) ? (
              <AvatarImage src={avatarSrc(autor.iconoPerfil)} alt={autor.nombre} />
            ) : null}
            <AvatarFallback>{getInitials(autor.nombre)}</AvatarFallback>
          </Avatar>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            onClick={() => navigate(`/dashboard/usuario/${autor.id}`)}
            className="text-hw-title font-heading cursor-pointer hover:underline"
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.88rem', fontWeight: 600, display: 'block' }}
          >
            {autor.nombre}
          </button>
          <span className="text-hw-subtitle" style={{ fontSize: '0.72rem' }}>
            {timeAgo(publicacion.fecha)}
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <p
        className="text-hw-title"
        style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}
      >
        {publicacion.contenidoTexto}
      </p>

      {/* ── Image (optional) ──────────────────────────────────────────── */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Contenido multimedia"
          loading="lazy"
          style={{
            width: '100%',
            maxHeight: 420,
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />
      )}

      {/* ── Montaje adjunto (opcional) ────────────────────────────── */}
      {publicacion.montajeId > 0 && (
        <MontajePreviewCard montajeId={publicacion.montajeId} />
      )}

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
        <ReactionDropdown
          publicacionId={publicacion.id}
          likesCount={publicacion.likesCount}
          dislikesCount={publicacion.dislikesCount}
          loveCount={publicacion.loveCount}
          funnyCount={publicacion.funnyCount}
          interestingCount={publicacion.interestingCount}
        />

        <Button
          variant="ghost"
          className="text-hw-subtitle hover:text-hw-title hover:bg-hw-accent/10 cursor-pointer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            padding: '6px 12px',
            borderRadius: 10,
            border: '1px solid var(--hw-card-border)',
          }}
          onClick={() => setCommentsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          Comentarios
        </Button>
      </div>

      {/* ── Comments dialog ───────────────────────────────────────────── */}
      <CommentsDialog
        publicacionId={publicacion.id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
      />
    </article>
  );
}

