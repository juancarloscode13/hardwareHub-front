import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Search, Users, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  usePublicaciones,
  usePublicacionesByTexto,
} from '@/features/publicacion/hooks/usePublicacion';
import { useUsuarios } from '@/features/usuario/hooks/useUsuario';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { UsuarioResponseDto } from '@/dto';
import PublicacionFeedItem from '@/components/publicacion/PublicacionFeedItem';
import CreatePublicacionDialog from '@/components/publicacion/CreatePublicacionDialog';

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

function sanitizeDslValue(value: string): string {
  return value.trim().replace(/[;~]/g, ' ');
}

// ── UsuarioSearchCard (inline) ────────────────────────────────────────────

function UsuarioSearchCard({ usuario }: { usuario: UsuarioResponseDto }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl"
      style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
    >
      <button
        onClick={() => navigate(`/dashboard/usuario/${usuario.id}`)}
        className="shrink-0 cursor-pointer"
        style={{ background: 'none', border: 'none', padding: 0 }}
        aria-label={`Ver perfil de ${usuario.nombre}`}
      >
        <Avatar size="default">
          {avatarSrc(usuario.iconoPerfil) ? (
            <AvatarImage src={avatarSrc(usuario.iconoPerfil)} alt={usuario.nombre} />
          ) : null}
          <AvatarFallback>{getInitials(usuario.nombre)}</AvatarFallback>
        </Avatar>
      </button>
      <span
        className="text-hw-title font-heading"
        style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem' }}
      >
        {usuario.nombre}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/dashboard/usuario/${usuario.id}`)}
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
    <div
      className="text-hw-subtitle"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '48px 16px',
        textAlign: 'center',
      }}
    >
      <Icon className="h-10 w-10 opacity-40" />
      <p style={{ fontSize: '0.9rem', margin: 0 }}>{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="text-destructive"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '48px 16px',
      }}
    >
      <AlertCircle className="h-5 w-5" />
      <p style={{ fontSize: '0.9rem', margin: 0 }}>{message}</p>
    </div>
  );
}

// ── ForoPage ──────────────────────────────────────────────────────────────

export default function ForoPage() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'feed' | 'usuarios' | 'publicaciones'>('feed');
  const [activeQuery, setActiveQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0' }}>
      {/* ── Sección 1: Cabecera ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageSquare className="h-7 w-7 text-hw-accent shrink-0" />
          <div>
            <h1 className="text-hw-title font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
              Foro
            </h1>
            <p className="text-hw-subtitle" style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>
              Comparte tus builds, opiniones y preguntas con la comunidad.
            </p>
          </div>
        </div>

        <Button onClick={() => setDialogOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus className="h-4 w-4" />
          Nueva publicación
        </Button>
      </div>

      {/* ── Sección 2: Barra de búsqueda ─────────────────────────────── */}
      <div style={{ maxWidth: 640, margin: '0 auto', width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar personas o publicaciones…"
          style={{ flex: 1, minWidth: 180 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchPublicaciones();
          }}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchUsuarios}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Users className="h-4 w-4" />
          Personas
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchPublicaciones}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ── Sección 3: Contenido ─────────────────────────────────────── */}

      {/* Modo feed */}
      {searchMode === 'feed' && (
        <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
        <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
        <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
