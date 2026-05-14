// Pagina PerfilPage: encapsula logica y presentacion de dashboard.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  Mail,
  Shield,
  Users,
  FileText,
  Save,
  Loader2,
  Camera,
  Trash2,
  ImageIcon,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useUsuario, useFollowers, useFollowing } from '@/features/usuario/hooks/useUsuario';
import { useUpdateProfile } from '@/features/usuario/hooks/useCreateUsuario';
import { usePublicacionesByUsuario } from '@/features/publicacion/hooks/usePublicacion';
import { cloudinaryApi } from '@/api/endpoints/cloudinary.api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { UploadDropzone } from '@/components/ui/upload-dropzone';



function getInitials(nombre: string | undefined): string {
  if (!nombre) return 'HH';
  const parts = nombre.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function avatarSrc(iconoPerfil: string | null | undefined): string | undefined {
  return iconoPerfil ?? undefined;
}

/** Extracts a preview URL from a File using object URL */
function filePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

function rolLabel(rol: string | undefined): string {
  switch (rol) {
    case 'ROL_ADMIN':
      return 'Administrador';
    case 'ROL_USUARIO':
      return 'Usuario';
    default:
      return rol ?? 'Desconocido';
  }
}

// ── StatChip ────────────────────────────────────────────────────────────────

function StatChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div
      className="bg-hw-icon-bg ring-1 ring-hw-icon-border hw-stat-chip-row"
    >
      <Icon className="h-4 w-4 text-hw-accent shrink-0" />
      <div className="hw-stat-chip-row-inner">
        <span className="text-hw-title font-heading hw-stat-chip-row-value">
          {value}
        </span>
        <span className="text-hw-subtitle hw-stat-chip-row-label">
          {label}
        </span>
      </div>
    </div>
  );
}

// ── InfoRow ─────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div
      className="bg-hw-icon-bg ring-1 ring-hw-icon-border hw-info-row"
    >
      <Icon className="h-4 w-4 text-hw-accent shrink-0" />
      <div className="hw-profile-field">
        <span className="text-hw-subtitle hw-profile-field-label">
          {label}
        </span>
        <span className="text-hw-title truncate hw-profile-field-value">
          {value}
        </span>
      </div>
    </div>
  );
}

// ── PerfilPage ──────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useCurrentUser();
  const userId = user?.id ?? 0;

  const { data: usuario, isLoading: userLoading } = useUsuario(userId);
  const { data: publicaciones } = usePublicacionesByUsuario(userId);
  const { data: followers } = useFollowers(userId);
  const { data: following } = useFollowing(userId);

  const updateProfile = useUpdateProfile();

  // ── Estado del formulario ─────────────────────────────────────────────
  const [nombre, setNombre] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // avatarFile: undefined = no change; null = remove avatar; File = new file to upload
  const [avatarFile, setAvatarFile] = useState<File | null | undefined>(undefined);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Valores efectivos (form o server)
  const effectiveNombre = nombre ?? usuario?.nombre ?? '';
  const effectiveAvatarSrc = avatarPreview ?? avatarSrc(usuario?.iconoPerfil);

  const isLoading = authLoading || userLoading;
  const pubsCount = publicaciones?.content?.length ?? 0;
  const followersCount = followers?.length ?? usuario?.followersCount ?? 0;
  const followingCount = following?.length ?? usuario?.followingCount ?? 0;

  const hasChanges =
    (nombre !== null && nombre !== usuario?.nombre) ||
    avatarFile !== undefined;

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleAvatarUpload = (input: File[] | FileList) => {
    const files = Array.from(input);
    setAvatarError(null);
    const selected = files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setAvatarError('El archivo seleccionado no es una imagen válida.');
      return;
    }

    setAvatarPreview(filePreviewUrl(selected));
    setAvatarFile(selected);
    setAvatarDialogOpen(false);
    setAvatarError(null);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null); // null = remove avatar
  };

  const handleSave = async () => {
    if (!user || !usuario) return;

    let iconoPerfilUrl: string | null | undefined = undefined;

    if (avatarFile !== undefined) {
      if (avatarFile !== null) {
        setIsUploadingAvatar(true);
        try {
          iconoPerfilUrl = await cloudinaryApi.uploadImage({ file: avatarFile });
        } catch {
          setIsUploadingAvatar(false);
          toast.error('Error al subir el avatar a la nube');
          return;
        }
        setIsUploadingAvatar(false);
      } else {
        iconoPerfilUrl = null; // user removed avatar
      }
    }

    updateProfile.mutate(
      {
        id: user.id,
        data: {
          nombre: effectiveNombre,
          email: usuario.email,
          contrasena: usuario.contrasena,
          rol: usuario.rol,
          ...(iconoPerfilUrl !== undefined && { iconoPerfil: iconoPerfilUrl }),
        },
      },
      {
        onSuccess: () => {
          toast.success('Perfil actualizado correctamente');
          setNombre(null);
          setAvatarPreview(null);
          setAvatarFile(undefined);
        },
        onError: () => {
          toast.error('Error al actualizar el perfil');
        },
      },
    );
  };

  const handleDiscard = () => {
    setNombre(null);
    setAvatarPreview(null);
    setAvatarFile(undefined);
  };

  // ── Fake upload control for UploadDropzone ────────────────────────────
  const fakeControl = {
    upload: handleAvatarUpload,
    isPending: false,
    progress: null,
    isSuccess: false,
    isError: false,
    error: null,
  };

  // ── Loading skeleton ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <section
        className="flex flex-col gap-10 hw-page-section"
      >
        <div className="flex items-center gap-3 pr-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
            <Settings className="w-5 h-5 text-hw-accent" />
          </div>
          <div>
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded mt-2" />
          </div>
        </div>

        <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-card-section">
          <div className="flex gap-6 items-start flex-wrap">
            <Skeleton className="shrink-0 rounded-full w-24 h-24" />
            <div className="flex-1 flex flex-col gap-3.5">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <div className="flex gap-2.5">
                <Skeleton className="h-16 w-40 rounded-xl" />
                <Skeleton className="h-16 w-40 rounded-xl" />
                <Skeleton className="h-16 w-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-card-section">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <section
      className="flex flex-col gap-8 hw-page-section"
    >
      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pr-2 flex-wrap hw-profile-page-heading">
        <div className="hw-profile-heading-brand">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
            <Settings className="w-5 h-5 text-hw-accent" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
              Configuración del perfil
            </h1>
            <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
              Gestiona tu información personal y preferencias
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/usuario/${userId}`)}
          className="cursor-pointer hw-profile-view-btn"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          Ver perfil público
        </Button>
      </div>

      {/* ── Card: Avatar + Stats ──────────────────────────────────────── */}
      <div
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-profile-card"
      >
        {/* Avatar con overlay de edición */}
        <div className="hw-profile-avatar-block">
          <div className="relative group">
            <Avatar
              className="shrink-0 hw-profile-avatar"
            >
              {effectiveAvatarSrc ? (
                <AvatarImage src={effectiveAvatarSrc} alt={effectiveNombre} />
              ) : null}
              <AvatarFallback className="hw-profile-avatar-fallback">
                {getInitials(effectiveNombre)}
              </AvatarFallback>
            </Avatar>

            {/* Overlay botón cámara */}
            <button
              onClick={() => setAvatarDialogOpen(true)}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Cambiar avatar"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="hw-profile-avatar-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAvatarDialogOpen(true)}
              className="cursor-pointer text-xs hw-profile-avatar-btn"
            >
              <Camera className="h-3.5 w-3.5 mr-1" />
              Cambiar
            </Button>
            {effectiveAvatarSrc && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                className="cursor-pointer text-xs text-hw-error hover:text-hw-error hw-profile-avatar-btn"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Quitar
              </Button>
            )}
          </div>
        </div>

        {/* Info + stats */}
        <div className="hw-profile-info-wide">
          <div>
            <h2
              className="font-heading text-hw-title hw-profile-name"
            >
              {effectiveNombre}
            </h2>
            <p className="text-hw-subtitle hw-profile-email">
              {usuario?.email}
            </p>
          </div>

          {/* Stats */}
          <div className="hw-profile-stats">
            <StatChip icon={Users} label="Seguidores" value={followersCount} />
            <StatChip icon={Users} label="Siguiendo" value={followingCount} />
            <StatChip icon={FileText} label="Publicaciones" value={pubsCount} />
          </div>
        </div>
      </div>

      {/* ── Card: Datos de la cuenta (solo lectura) ───────────────────── */}
      <div
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-card-section hw-card-section-stack"
      >
        <h3 className="font-heading text-hw-title hw-card-section-title">
          Información de la cuenta
        </h3>
        <div className="hw-card-section-grid">
          <InfoRow icon={Mail} label="Email" value={usuario?.email ?? ''} />
          <InfoRow icon={Shield} label="Rol" value={rolLabel(usuario?.rol)} />
          <InfoRow icon={User} label="ID de usuario" value={`#${userId}`} />
        </div>
      </div>

      {/* ── Card: Editar nombre ───────────────────────────────────────── */}
      <div
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-card-section hw-card-section-stack-lg"
      >
        <h3 className="font-heading text-hw-title hw-card-section-title">
          Editar perfil
        </h3>

        <div className="hw-profile-form">
          <div className="hw-profile-form-field">
            <Label htmlFor="nombre" className="text-hw-subtitle hw-profile-input-label">
              Nombre
            </Label>
            <Input
              id="nombre"
              value={effectiveNombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre…"
              className="h-10 hw-profile-name-input"
            />
          </div>
        </div>

        {/* Botones de acción */}
        {hasChanges && (
          <div className="hw-card-actions">
            <Button
              onClick={handleSave}
              disabled={updateProfile.isPending || isUploadingAvatar || !effectiveNombre.trim()}
              className="cursor-pointer bg-hw-accent text-hw-accent-fg hover:bg-hw-accent/90 hw-profile-save-btn"
            >
              {(updateProfile.isPending || isUploadingAvatar) ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Guardar cambios
            </Button>
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={updateProfile.isPending || isUploadingAvatar}
              className="cursor-pointer hw-profile-discard-btn"
            >
              Descartar
            </Button>
          </div>
        )}
      </div>

      {/* ── Dialog: Upload avatar ──────────────────────────────────────── */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="hw-dialog-title-icon hw-profile-dialog-title-icon">
                <ImageIcon className="h-5 w-5 text-hw-accent" />
                Cambiar avatar
              </span>
            </DialogTitle>
            <DialogDescription>
              Arrastra una imagen o haz clic para seleccionarla.
            </DialogDescription>
          </DialogHeader>

          <div className="hw-profile-dialog-upload-wrap">
            <UploadDropzone
              control={fakeControl as never}
              accept="image/jpeg,image/png,image/gif,image/webp"
              description={{
                fileTypes: 'JPG, PNG, GIF, WebP',
                maxFiles: 1,
              }}
            />
          </div>

          {avatarError && (
            <div className="px-3 py-2 rounded-lg border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.8rem]">
              {avatarError}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}



