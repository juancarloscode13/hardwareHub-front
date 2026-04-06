import { useParams, useNavigate } from 'react-router-dom';
import { User, AlertCircle, FileText, Users, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useUsuario, useFollowers } from '@/features/usuario/hooks/useUsuario';
import { useFollowUsuario, useUnfollowUsuario } from '@/features/usuario/hooks/useCreateUsuario';
import { useCreateConversation } from '@/features/chat/hooks/useConversations';
import { usePublicacionesByUsuario } from '@/features/publicacion/hooks/usePublicacion';
import PublicacionCard from '@/components/publicacion/PublicacionCard';

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

// ── Stat chip ─────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div
      className="bg-hw-icon-bg ring-1 ring-hw-icon-border"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: 14,
        minWidth: 90,
      }}
    >
      <span className="text-hw-title font-heading" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
        {value ?? 0}
      </span>
      <span className="text-hw-subtitle" style={{ fontSize: '0.72rem' }}>
        {label}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function UsuarioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const usuarioId = Number(id);

  const { user: currentUser } = useCurrentUser();
  const { data: usuario, isLoading: loadingUser, isError: errorUser } = useUsuario(usuarioId);
  const { data: publicaciones, isLoading: loadingPubs } = usePublicacionesByUsuario(usuarioId);
  const { data: followers } = useFollowers(usuarioId);

  const followMutation = useFollowUsuario();
  const unfollowMutation = useUnfollowUsuario();
  const createConversation = useCreateConversation();

  const isSelf = currentUser?.id === usuarioId;
  const isFollowing = followers?.some((f) => f.id === currentUser?.id) ?? false;

  const pubsList = publicaciones?.content ?? [];

  const handleFollow = () => {
    if (!currentUser) return;
    followMutation.mutate({ id: currentUser.id, targetId: usuarioId });
  };

  const handleUnfollow = () => {
    if (!currentUser) return;
    unfollowMutation.mutate({ id: currentUser.id, targetId: usuarioId });
  };

  const handleChat = () => {
    createConversation.mutate(usuarioId, {
      onSuccess: (conv) => {
        navigate('/dashboard/mensajes', { state: { initialConversation: conv } });
      },
    });
  };

  // ── Error state ─────────────────────────────────────────────────────────
  if (errorUser) {
    return (
      <section
        className="flex flex-col gap-10"
        style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 8 }}
      >
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle className="h-10 w-10 text-hw-error" />
          <p className="text-hw-subtitle">No se pudo cargar el perfil del usuario.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-10"
      style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 8 }}
    >
      {/* ── Page heading (consistent with NoticiasPage) ──────────────── */}
      <div className="flex items-center gap-3 pr-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <User className="w-5 h-5 text-hw-accent" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Perfil de usuario
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Publicaciones y actividad
          </p>
        </div>
      </div>

      {/* ── Profile header ───────────────────────────────────────────── */}
      <div
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl"
        style={{ padding: 28, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}
      >
        {/* Avatar */}
        {loadingUser ? (
          <Skeleton className="shrink-0 rounded-full" style={{ width: 96, height: 96 }} />
        ) : (
          <Avatar
            className="shrink-0"
            style={{ width: 96, height: 96, fontSize: '2rem' }}
          >
            {avatarSrc(usuario?.iconoPerfil) ? (
              <AvatarImage src={avatarSrc(usuario?.iconoPerfil)} alt={usuario?.nombre ?? ''} />
            ) : null}
            <AvatarFallback style={{ fontSize: '1.6rem' }}>
              {getInitials(usuario?.nombre)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loadingUser ? (
            <>
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Skeleton className="h-14 w-24 rounded-xl" />
                <Skeleton className="h-14 w-24 rounded-xl" />
                <Skeleton className="h-14 w-24 rounded-xl" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h2
                  className="font-heading text-hw-title"
                  style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}
                >
                  {usuario?.nombre}
                </h2>
                {isSelf && (
                  <p className="text-hw-subtitle" style={{ fontSize: '0.8rem', margin: '2px 0 0' }}>
                    {usuario?.email}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <StatChip label="Seguidores" value={usuario?.followersCount} />
                <StatChip label="Siguiendo" value={usuario?.followingCount} />
                <StatChip label="Publicaciones" value={pubsList.length} />
              </div>

              {/* Follow / Unfollow + Chat */}
              {!isSelf && currentUser && (
                <div style={{ marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {isFollowing ? (
                    <Button
                      variant="outline"
                      onClick={handleUnfollow}
                      disabled={unfollowMutation.isPending}
                      className="cursor-pointer"
                      style={{
                        fontSize: '0.8rem',
                        padding: '8px 20px',
                        borderRadius: 10,
                        borderColor: 'var(--hw-card-border)',
                      }}
                    >
                      <Users className="h-4 w-4" style={{ marginRight: 6 }} />
                      Dejar de seguir
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      disabled={followMutation.isPending}
                      className="cursor-pointer bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90"
                      style={{ fontSize: '0.8rem', padding: '8px 20px', borderRadius: 10 }}
                    >
                      <Users className="h-4 w-4" style={{ marginRight: 6 }} />
                      Seguir
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleChat}
                    disabled={createConversation.isPending}
                    className="cursor-pointer"
                    style={{
                      fontSize: '0.8rem',
                      padding: '8px 20px',
                      borderRadius: 10,
                      borderColor: 'var(--hw-card-border)',
                    }}
                  >
                    <MessageSquare className="h-4 w-4" style={{ marginRight: 6 }} />
                    Mensaje
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Separator ────────────────────────────────────────────────── */}
      <div className="bg-hw-divider" style={{ height: 1 }} />

      {/* ── Publications list ────────────────────────────────────────── */}
      {loadingPubs && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="rounded-2xl" style={{ height: 200, width: '100%' }} />
          ))}
        </div>
      )}

      {!loadingPubs && pubsList.length === 0 && !errorUser && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <FileText className="h-10 w-10 text-hw-subtitle" />
          <p className="text-hw-subtitle">Este usuario no tiene publicaciones aún.</p>
        </div>
      )}

      {!loadingPubs && pubsList.length > 0 && usuario && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {pubsList.map((pub) => (
            <PublicacionCard key={pub.id} publicacion={pub} autor={usuario} />
          ))}
        </div>
      )}
    </section>
  );
}

