// Componente PublicacionCard: encapsula logica y presentacion de foro/publicaciones.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import ReactPlayer from 'react-player';
import type { PublicacionResponseDto, UsuarioResponseDto } from '@/dto';
import { timeAgo } from '@/lib/date-helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ReactionDropdown from './ReactionDropdown';
import CommentsDialog from './CommentsDialog';
import MontajePreviewCard from '@/components/montaje/MontajePreviewCard';
import { usePublicacionRealtime } from '@/features/publicacion/hooks/usePublicacionRealtime';
import { useComentariosByPublicacion } from '@/features/comentario/hooks/useComentario';



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  return iconoPerfil ?? undefined;
}

function multimediaSrc(multimedia: string | null | undefined): string | undefined {
  return multimedia ?? undefined;
}

function isVideoUrl(url: string): boolean {
  return url.includes('/video/upload/');
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

  // ── Tiempo real: reacciones y comentarios en vivo ─────────────────────────
  const { reaccionesUpdate } = usePublicacionRealtime(publicacion.id);

  // Contadores efectivos: los del servidor o los del último evento STOMP
  const counts = reaccionesUpdate ?? {
    likesCount:       publicacion.likesCount,
    dislikesCount:    publicacion.dislikesCount,
    loveCount:        publicacion.loveCount,
    funnyCount:       publicacion.funnyCount,
    interestingCount: publicacion.interestingCount,
  };

  const { data: comentariosPage } = useComentariosByPublicacion(publicacion.id);
  const commentsCount = comentariosPage?.totalElements ?? 0;

  const mediaSrc = multimediaSrc(publicacion.multimedia);
  const isVideo = mediaSrc ? isVideoUrl(mediaSrc) : false;

  return (
    <article className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-card-body">
      {/* ── Header: avatar + name + date ──────────────────────────────── */}
      <div className="hw-card-header">
        <button
          onClick={() => navigate(`/dashboard/usuario/${autor.id}`)}
          className="shrink-0 cursor-pointer hw-btn-reset"
          aria-label={`Ver perfil de ${autor.nombre}`}
        >
          <Avatar size="lg">
            {avatarSrc(autor.iconoPerfil) ? (
              <AvatarImage src={avatarSrc(autor.iconoPerfil)} alt={autor.nombre} />
            ) : null}
            <AvatarFallback>{getInitials(autor.nombre)}</AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(`/dashboard/usuario/${autor.id}`)}
            className="text-hw-title font-heading cursor-pointer hover:underline hw-name-link"
          >
            {autor.nombre}
          </button>
          <span className="text-hw-subtitle text-[0.72rem]">
            {timeAgo(publicacion.fecha)}
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <p className="text-hw-title text-[0.85rem] leading-relaxed break-words">
        {publicacion.contenidoTexto}
      </p>

      {/* ── Image (optional) ──────────────────────────────────────────── */}
      {mediaSrc && !isVideo && (
        <img
          src={mediaSrc}
          alt="Contenido multimedia"
          loading="lazy"
          className="hw-card-img"
        />
      )}

      {/* ── Video (optional) ──────────────────────────────────────────── */}
      {mediaSrc && isVideo && (
        <div className="rounded-xl overflow-hidden">
          <ReactPlayer
            src={mediaSrc}
            controls
            width="100%"
            height="auto"
            pip={false}
          />
        </div>
      )}

      {/* ── Montaje adjunto (opcional) ────────────────────────────── */}
      {publicacion.montajeId > 0 && (
        <MontajePreviewCard montajeId={publicacion.montajeId} />
      )}

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="hw-card-actions">
        <ReactionDropdown
          publicacionId={publicacion.id}
          autorId={publicacion.usuarioId}
          likesCount={counts.likesCount}
          dislikesCount={counts.dislikesCount}
          loveCount={counts.loveCount}
          funnyCount={counts.funnyCount}
          interestingCount={counts.interestingCount}
        />

        <Button
          variant="ghost"
          className="text-hw-subtitle hover:text-hw-title hover:bg-hw-accent/10 cursor-pointer hw-comment-btn"
          onClick={() => setCommentsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          Comentarios
          <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-hw-accent/15 px-2 py-0.5 text-[0.72rem] font-medium text-hw-accent">
            {commentsCount}
          </span>
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



