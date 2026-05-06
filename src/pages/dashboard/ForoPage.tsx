// Pagina ForoPage: encapsula logica y presentacion de dashboard.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Search, Users, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  usePublicaciones,
  usePublicacionesByTexto,
} from '@/features/publicacion/hooks/usePublicacion';
import { useForumFeed } from '@/features/publicacion/hooks/useForumFeed';
import { useUsuarios } from '@/features/usuario/hooks/useUsuario';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { UsuarioResponseDto } from '@/dto';
import PublicacionFeedItem from '@/components/publicacion/PublicacionFeedItem';
import CreatePublicacionDialog from '@/components/publicacion/CreatePublicacionDialog';



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  return iconoPerfil ?? undefined;
}

function sanitizeDslValue(value: string): string {
  return value.trim().replace(/[;~]/g, ' ');
}

// ── UsuarioSearchCard (inline) ────────────────────────────────────────────

function UsuarioSearchCard({ usuario }: { usuario: UsuarioResponseDto }) {
  const navigate = useNavigate();
  return (
    <div className="hw-user-search-card bg-hw-card ring-1 ring-hw-card-border rounded-2xl flex items-center">
      <button
        onClick={() => navigate(`/dashboard/usuario/${usuario.id}`)}
        className="hw-user-search-card-avatar shrink-0 cursor-pointer hw-btn-reset"
        aria-label={`Ver perfil de ${usuario.nombre}`}
      >
        <Avatar size="default">
          {avatarSrc(usuario.iconoPerfil) ? (
            <AvatarImage src={avatarSrc(usuario.iconoPerfil)} alt={usuario.nombre} />
          ) : null}
          <AvatarFallback>{getInitials(usuario.nombre)}</AvatarFallback>
        </Avatar>
      </button>
      <span className="hw-user-search-card-name text-hw-title font-heading flex-1 font-semibold text-[0.88rem]">
        {usuario.nombre}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/dashboard/usuario/${usuario.id}`)}
        className="hw-user-search-card-btn"
      >
        Ver perfil
      </Button>
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────

function FeedSkeletons() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full rounded-2xl" />
      ))}
    </>
  );
}

function UserSkeletons() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
      ))}
    </>
  );
}

// ── Empty / Error states ──────────────────────────────────────────────────

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-hw-subtitle hw-empty-state">
      <Icon className="h-10 w-10 opacity-40" />
      <p className="text-[0.9rem]">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-destructive hw-error-state">
      <AlertCircle className="h-5 w-5" />
      <p className="text-[0.9rem]">{message}</p>
    </div>
  );
}

// ── ForoPage ──────────────────────────────────────────────────────────────

export default function ForoPage() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'feed' | 'usuarios' | 'publicaciones'>('feed');
  const [activeQuery, setActiveQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // ── Tiempo real: suscripción al feed global del foro ──────────────────────
  useForumFeed();

  // ── Data hooks ──────────────────────────────────────────────────────────

  const { data: feedData, isLoading: feedLoading, isError: feedError } = usePublicaciones({
    sort: 'fecha:desc',
    size: 50,
  });

  const { data: textData, isLoading: textLoading, isError: textError } =
    usePublicacionesByTexto(activeQuery);

  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsuarios(
    searchMode === 'usuarios' && activeQuery.trim().length > 0
      ? { filter: `nombre~${sanitizeDslValue(activeQuery)}`, size: 50 }
      : undefined,
  );

  // ── Search handlers ─────────────────────────────────────────────────────

  const handleSearchUsuarios = () => {
    if (query.trim().length === 0) {
      toast.info('Escribe algo para buscar');
      return;
    }
    setSearchMode('usuarios');
    setActiveQuery(query);
  };

  const handleSearchPublicaciones = () => {
    if (query.trim().length === 0) {
      toast.info('Escribe algo para buscar');
      return;
    }
    setSearchMode('publicaciones');
    setActiveQuery(query);
  };

  const handleClearSearch = () => {
    setSearchMode('feed');
    setActiveQuery('');
    setQuery('');
  };

  // ── Render helpers ──────────────────────────────────────────────────────

  const feedContent = feedData?.content ?? [];
  const textContent = textData?.content ?? [];
  const usersContent = usersData?.content ?? [];

  // ── JSX ─────────────────────────────────────────────────────────────────

  return (
    <div className="hw-page-flow">
      {/* ── Sección 1: Cabecera ──────────────────────────────────────── */}
      <div className="hw-foro-header">
        <div className="hw-foro-header-brand">
          <MessageSquare className="h-7 w-7 text-hw-accent shrink-0 hw-foro-header-brand-icon" />
          <div className="hw-foro-header-copy">
            <h1 className="text-hw-title font-heading hw-foro-header-title">
              Foro
            </h1>
            <p className="hw-foro-header-subtitle">
              Comparte tus builds, opiniones y preguntas con la comunidad.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="hw-foro-new-post-btn"
        >
          <Plus className="h-4 w-4" />
          Nueva publicación
        </Button>
      </div>

      {/* ── Sección 2: Barra de búsqueda ─────────────────────────────── */}
      <div className="hw-foro-search-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar personas o publicaciones…"
          className="hw-foro-search-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchPublicaciones();
          }}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchUsuarios}
          className="hw-foro-search-btn"
        >
          <Users className="h-4 w-4" />
          Personas
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchPublicaciones}
          className="hw-foro-search-btn"
        >
          <Search className="h-4 w-4" />
          Publicaciones
        </Button>

        {searchMode !== 'feed' && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
            className="hw-foro-search-clear-btn"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ── Sección 3: Contenido ─────────────────────────────────────── */}

      {/* Modo feed */}
      {searchMode === 'feed' && (
        <div className="hw-feed-container">
          {feedLoading && <FeedSkeletons />}
          {feedError && <ErrorState message="Error al cargar publicaciones." />}
          {!feedLoading && !feedError && feedContent.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              message="Aún no hay publicaciones. ¡Sé el primero en compartir algo!"
            />
          )}
          {!feedLoading &&
            !feedError &&
            feedContent.map((p) => <PublicacionFeedItem key={p.id} publicacion={p} />)}
        </div>
      )}

      {/* Modo búsqueda publicaciones */}
      {searchMode === 'publicaciones' && (
        <div className="hw-feed-container">
          {textLoading && <FeedSkeletons />}
          {textError && <ErrorState message="Error al buscar publicaciones." />}
          {!textLoading && !textError && textContent.length === 0 && (
            <EmptyState
              icon={Search}
              message={`No se encontraron publicaciones con «${activeQuery}»`}
            />
          )}
          {!textLoading &&
            !textError &&
            textContent.map((p) => <PublicacionFeedItem key={p.id} publicacion={p} />)}
        </div>
      )}

      {/* Modo búsqueda usuarios */}
      {searchMode === 'usuarios' && (
        <div className="hw-users-container">
          {usersLoading && <UserSkeletons />}
          {usersError && <ErrorState message="Error al buscar usuarios." />}
          {!usersLoading && !usersError && usersContent.length === 0 && (
            <EmptyState
              icon={Users}
              message={`No se encontraron usuarios con el nombre «${activeQuery}»`}
            />
          )}
          {!usersLoading &&
            !usersError &&
            usersContent.map((u) => <UsuarioSearchCard key={u.id} usuario={u} />)}
        </div>
      )}

      {/* ── Diálogo de creación ──────────────────────────────────────── */}
      <CreatePublicacionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}



