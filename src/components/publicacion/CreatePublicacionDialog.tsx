import { useCallback, useState } from 'react';
import { Plus, X } from 'lucide-react';
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
import { useCreatePublicacion } from '@/features/publicacion/hooks/useCreatePublicacion';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

// ── Props ─────────────────────────────────────────────────────────────────

interface CreatePublicacionDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function CreatePublicacionDialog({ open, onOpenChange }: CreatePublicacionDialogProps) {
  const { user } = useCurrentUser();
  const createMutation = useCreatePublicacion();

  const [contenidoTexto, setContenidoTexto] = useState('');
  const [multimedia, setMultimedia] = useState('');
  const [multimediaMime, setMultimediaMime] = useState('image/jpeg');
  const [isImagePending, setIsImagePending] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleUploadImage = useCallback((input: File[] | FileList) => {
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

    setIsImagePending(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Quitar el prefijo "data:...;base64,"
      const base64 = result.split(',')[1] ?? '';
      setMultimedia(base64);
      setMultimediaMime(file.type || 'image/jpeg');
      setIsImagePending(false);
    };
    reader.onerror = () => {
      toast.error('No se pudo leer la imagen. Intenta con otro archivo.');
      setIsImagePending(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const dropzoneControl = {
    upload: handleUploadImage,
    isPending: isImagePending,
    progress: null,
    isSuccess: false,
    isError: false,
    error: null,
  } as unknown as UploadHookControl<true>;

  const clearImage = () => {
    setMultimedia('');
    setMultimediaMime('image/jpeg');
  };

  const resetForm = () => {
    setContenidoTexto('');
    setMultimedia('');
    setMultimediaMime('image/jpeg');
    setIsImagePending(false);
  };

  const handleSubmit = () => {
    if (!user) return;
    if (contenidoTexto.trim().length === 0) return;

    createMutation.mutate(
      {
        contenidoTexto,
          multimedia: multimedia || null,
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

  const canSubmit = contenidoTexto.trim().length > 0 && !createMutation.isPending;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="w-[min(36rem,calc(100vw-2rem))]">
        <DialogHeader className="hw-pub-dialog-header">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-hw-accent" />
            Nueva publicación
          </DialogTitle>
        </DialogHeader>

        {/* Cuerpo del formulario */}
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

          {/* Dropzone: solo visible cuando aún no hay imagen */}
          {!multimedia && (
            <UploadDropzone
              control={dropzoneControl}
              accept="image/jpeg,image/png,image/gif,image/webp"
              description={{
                fileTypes: 'JPG, PNG, GIF, WebP',
                maxFileSize: '16MB',
                maxFiles: 1,
              }}
            />
          )}

          {/* Previsualización: solo visible cuando hay imagen cargada */}
          {multimedia && (
            <div className="relative rounded-lg border border-hw-input-border">
              <img
                src={`data:${multimediaMime};base64,${multimedia}`}
                alt="Preview"
                className="max-h-[200px] w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Quitar imagen"
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

