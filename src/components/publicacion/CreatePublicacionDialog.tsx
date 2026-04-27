import { useCallback, useState } from 'react';
import { Image, Plus, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import type { UploadHookControl } from '@better-upload/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/ui/upload-dropzone';
import { cloudinaryApi } from '@/api/endpoints/cloudinary.api';
import { useCreatePublicacion } from '@/features/publicacion/hooks/useCreatePublicacion';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';



interface CreatePublicacionDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}



export default function CreatePublicacionDialog({ open, onOpenChange }: CreatePublicacionDialogProps) {
  const { user } = useCurrentUser();
  const createMutation = useCreatePublicacion();

  const [contenidoTexto, setContenidoTexto] = useState('');
  const [multimediaUrl, setMultimediaUrl] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');
  const [isMediaPending, setIsMediaPending] = useState(false);

  

  const handleUploadImage = useCallback(async (input: File[] | FileList) => {
    const files = Array.from(input);
    const file = files[0];
    if (!file) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Extensión no permitida. Usa: .jpg, .jpeg, .png, .webp o .gif.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen.');
      return;
    }

    const maxBytes = 16 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('La imagen debe pesar menos de 16MB.');
      return;
    }

    setIsMediaPending(true);
    try {
      const url = await cloudinaryApi.uploadImage({ file });
      setMultimediaUrl(url);
    } catch {
      toast.error('No se pudo subir la imagen. Intenta con otro archivo.');
    } finally {
      setIsMediaPending(false);
    }
  }, []);

  const handleUploadVideo = useCallback(async (input: File[] | FileList) => {
    const files = Array.from(input);
    const file = files[0];
    if (!file) return;

    const allowedExtensions = ['mp4', 'webm', 'mov'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Extensión no permitida. Usa: .mp4, .webm o .mov.');
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Solo se permiten archivos de vídeo.');
      return;
    }

    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('El vídeo debe pesar menos de 100MB.');
      return;
    }

    setIsMediaPending(true);
    try {
      const url = await cloudinaryApi.uploadVideo({ file });
      setMultimediaUrl(url);
    } catch {
      toast.error('No se pudo subir el vídeo. Intenta con otro archivo.');
    } finally {
      setIsMediaPending(false);
    }
  }, []);

  const imageDropzoneControl = {
    upload: handleUploadImage,
    isPending: isMediaPending,
    progress: null,
    isSuccess: false,
    isError: false,
    error: null,
  } as unknown as UploadHookControl<true>;

  const videoDropzoneControl = {
    upload: handleUploadVideo,
    isPending: isMediaPending,
    progress: null,
    isSuccess: false,
    isError: false,
    error: null,
  } as unknown as UploadHookControl<true>;

  const clearMedia = () => {
    setMultimediaUrl(null);
  };

  const resetForm = () => {
    setContenidoTexto('');
    setMultimediaUrl(null);
    setMediaMode('image');
    setIsMediaPending(false);
  };

  const handleSubmit = () => {
    if (!user) return;
    if (contenidoTexto.trim().length === 0) return;

    createMutation.mutate(
      {
        contenidoTexto,
        multimedia: multimediaUrl,
        montajeId: null,
        usuarioId: user.id,
      },
      {
        onSuccess: () => {
          toast.success('Publicación creada');
          resetForm();
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Error al crear la publicación');
        },
      },
    );
  };

  const canSubmit = contenidoTexto.trim().length > 0 && !createMutation.isPending && !isMediaPending;
  const isVideo = multimediaUrl?.includes('/video/upload/') ?? false;

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="w-[min(36rem,calc(100vw-2rem))]">
        <DialogHeader className="hw-pub-dialog-header">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-hw-accent" />
            Nueva publicación
          </DialogTitle>
        </DialogHeader>

        {}
        <div className="hw-pub-dialog-form">
          <Textarea
            value={contenidoTexto}
            onChange={(e) => setContenidoTexto(e.target.value)}
            placeholder="¿Qué quieres compartir?"
            minLength={1}
            maxLength={2000}
            rows={4}
            className="hw-pub-dialog-textarea focus-visible:border-hw-accent focus-visible:ring-hw-accent/25 rounded-lg"
          />

          {/* Media type selector + dropzone — only shown when no media uploaded yet */}
          {!multimediaUrl && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMediaMode('image')}
                  disabled={isMediaPending}
                  className={cn(
                    'flex-1 gap-1.5 border transition-colors',
                    mediaMode === 'image'
                      ? 'border-hw-accent text-hw-accent bg-hw-accent/10'
                      : 'border-hw-input-border text-hw-subtitle hover:text-hw-title',
                  )}
                >
                  <Image className="h-4 w-4" />
                  Imagen
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMediaMode('video')}
                  disabled={isMediaPending}
                  className={cn(
                    'flex-1 gap-1.5 border transition-colors',
                    mediaMode === 'video'
                      ? 'border-hw-accent text-hw-accent bg-hw-accent/10'
                      : 'border-hw-input-border text-hw-subtitle hover:text-hw-title',
                  )}
                >
                  <Video className="h-4 w-4" />
                  Vídeo
                </Button>
              </div>

              {mediaMode === 'image' && (
                <UploadDropzone
                  control={imageDropzoneControl}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  description={{
                    fileTypes: 'JPG, PNG, GIF, WebP',
                    maxFileSize: '16MB',
                    maxFiles: 1,
                  }}
                />
              )}

              {mediaMode === 'video' && (
                <UploadDropzone
                  control={videoDropzoneControl}
                  accept="video/mp4,video/webm,video/quicktime"
                  description={{
                    fileTypes: 'MP4, WebM, MOV',
                    maxFileSize: '100MB',
                    maxFiles: 1,
                  }}
                />
              )}
            </div>
          )}

          {/* Preview: image */}
          {multimediaUrl && !isVideo && (
            <div className="relative rounded-lg border border-hw-input-border">
              <img
                src={multimediaUrl}
                alt="Preview"
                className="max-h-[200px] w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={clearMedia}
                aria-label="Quitar imagen"
                className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Preview: video */}
          {multimediaUrl && isVideo && (
            <div className="relative rounded-lg border border-hw-input-border overflow-hidden">
              <ReactPlayer
                src={multimediaUrl}
                controls
                width="100%"
                height="200px"
              />
              <button
                type="button"
                onClick={clearMedia}
                aria-label="Quitar vídeo"
                className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t-0 bg-transparent p-0 pt-2">
          <Button onClick={handleSubmit} disabled={!canSubmit} className="hw-pub-dialog-submit">
            {createMutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

