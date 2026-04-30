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



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  return iconoPerfil ?? undefined;
}

// ── Stat chip ─────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="bg-hw-icon-bg ring-1 ring-hw-icon-border hw-stat-chip">
      <span className="text-hw-title font-heading text-[1.15rem] font-bold">
        {value ?? 0}
      </span>
      <span className="text-hw-subtitle text-[0.72rem]">
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
      <section className="hw-user-detail-page flex flex-col hw-page-section">
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle className="h-10 w-10 text-hw-error" />
          <p className="text-hw-subtitle">No se pudo cargar el perfil del usuario.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hw-user-detail-page flex flex-col hw-page-section">
      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="hw-user-detail-heading">
        <div className="hw-user-detail-heading-icon inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <User className="w-5 h-5 text-hw-accent" />
        </div>
        <div className="hw-user-detail-heading-copy">
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Perfil de usuario
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Publicaciones y actividad
          </p>
        </div>
      </div>

      {/* ── Profile header ───────────────────────────────────────────── */}
      <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-profile-card">
        {/* Avatar */}
        {loadingUser ? (
          <Skeleton className="shrink-0 rounded-full w-24 h-24" />
        ) : (
          <Avatar className="shrink-0 hw-profile-avatar">
            {avatarSrc(usuario?.iconoPerfil) ? (
              <AvatarImage src={avatarSrc(usuario?.iconoPerfil)} alt={usuario?.nombre ?? ''} />
            ) : null}
            <AvatarFallback className="hw-profile-avatar-fallback">
              {getInitials(usuario?.nombre)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Info */}
        <div className="hw-profile-info">
          {loadingUser ? (
            <>
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <div className="flex gap-2.5 mt-1">
                <Skeleton className="h-14 w-24 rounded-xl" />
                <Skeleton className="h-14 w-24 rounded-xl" />
                <Skeleton className="h-14 w-24 rounded-xl" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-heading text-hw-title text-[1.35rem] font-bold m-0 leading-snug">
                  {usuario?.nombre}
                </h2>
                {isSelf && (
                  <p className="text-hw-subtitle text-[0.8rem] mt-0.5">
                    {usuario?.email}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="hw-profile-stats">
                <StatChip label="Seguidores" value={usuario?.followersCount} />
                <StatChip label="Siguiendo" value={usuario?.followingCount} />
                <StatChip label="Publicaciones" value={pubsList.length} />
              </div>

              {/* Follow / Unfollow + Chat */}
              {!isSelf && currentUser && (
                <div className="hw-profile-actions">
                  {isFollowing ? (
                    <Button
                      variant="outline"
                      onClick={handleUnfollow}
                      disabled={unfollowMutation.isPending}
                      className="cursor-pointer hw-action-btn hw-action-btn-outline"
                    >
                      <Users className="h-4 w-4 mr-1.5" />
                      Dejar de seguir
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      disabled={followMutation.isPending}
                      className="cursor-pointer bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90 hw-action-btn"
                    >
                      <Users className="h-4 w-4 mr-1.5" />
                      Seguir
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleChat}
                    disabled={createConversation.isPending}
                    className="cursor-pointer hw-action-btn hw-action-btn-outline"
                  >
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Mensaje
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Publications list ────────────────────────────────────────── */}
      <div className="hw-profile-publicaciones-section">

        <div className="hw-profile-publicaciones-intro">
          <h2 className="font-heading text-hw-title hw-card-section-title">
            Publicaciones
          </h2>
          <p className="text-hw-subtitle text-[0.84rem]">
            Actividad reciente del usuario en el foro.
          </p>
        </div>

      {loadingPubs && (
        <div className="hw-feed-container">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="rounded-2xl h-[200px] w-full" />
          ))}
        </div>
      )}

      {!loadingPubs && pubsList.length === 0 && !errorUser && (
        <div className="hw-feed-container">
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <FileText className="h-10 w-10 text-hw-subtitle" />
            <p className="text-hw-subtitle">Este usuario no tiene publicaciones aún.</p>
          </div>
        </div>
      )}

      {!loadingPubs && pubsList.length > 0 && usuario && (
        <div className="hw-feed-container">
          {pubsList.map((pub) => (
            <PublicacionCard key={pub.id} publicacion={pub} autor={usuario} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}

