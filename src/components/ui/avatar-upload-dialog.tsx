import { useState, useCallback, useRef } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.tsx';
import { UploadDropzone } from '@/components/ui/upload-dropzone.tsx';

// ── Props ────────────────────────────────────────────────────────────────
interface AvatarUploadDialogProps {
  file: File | null;
  preview: string | null;
  onFileSelected: (file: File, preview: string) => void;
  onFileRemoved: () => void;
}

// ── Component ────────────────────────────────────────────────────────────
export function AvatarUploadDialog({
  file,
  preview,
  onFileSelected,
  onFileRemoved,
}: AvatarUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePreviewEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowDelete(true);
  };

  const handlePreviewLeave = () => {
    hideTimer.current = setTimeout(() => setShowDelete(false), 1000);
  };

  /**
   * Adapter: wraps local file-reading logic behind an UploadHookControl
   * interface so the UploadDropzone component works without a real server.
   */
  const fakeUpload = useCallback(
    (input: File[] | FileList) => {
      const files = Array.from(input);
      setError(null);
      const selected = files[0];
      if (!selected) return;

      if (!selected.type.startsWith('image/')) {
        setError('El archivo seleccionado no es una imagen válida.');
        return;
      }

      setIsPending(true);
      const reader = new FileReader();
      reader.onload = () => {
        onFileSelected(selected, reader.result as string);
        setIsPending(false);
        setOpen(false);
        setError(null);
      };
      reader.onerror = () => {
        setError('Error al leer el archivo.');
        setIsPending(false);
      };
      reader.readAsDataURL(selected);
    },
    [onFileSelected]
  );

  const control = {
    upload: fakeUpload,
    isPending,
    progress: null,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {},
  };

  const handleRemove = () => {
    onFileRemoved();
    setError(null);
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: '0.5rem' }}>
      {/* Preview con botón de eliminar al lado (hover) */}
      {preview ? (
        <div
          className="relative"
          onMouseEnter={handlePreviewEnter}
          onMouseLeave={handlePreviewLeave}
        >
          <img
            src={preview}
            alt="Avatar"
            className="w-[72px] h-[72px] rounded-full object-cover border-2 border-hw-accent/40 transition-all duration-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar imagen"
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-hw-error/50 bg-hw-error/10 text-hw-error flex items-center justify-center cursor-pointer hover:bg-hw-error hover:text-white"
            style={{
              left: 'calc(100% + 0.5rem)',
              opacity: showDelete ? 1 : 0,
              pointerEvents: showDelete ? 'auto' : 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-hw-input-border bg-hw-input flex items-center justify-center transition-colors duration-300">
          <ImageIcon className="w-6 h-6 text-hw-placeholder transition-colors duration-300" />
        </div>
      )}

      {/* Dialog trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-[34px] text-[0.8rem] bg-transparent text-hw-muted border-hw-muted-border rounded-[8px] cursor-pointer gap-[0.4rem] transition-colors duration-300 hover:border-hw-accent/40 hover:bg-hw-accent/5 hover:text-hw-title"
          >
            <Upload className="w-[14px] h-[14px]" />
            {file ? 'Cambiar imagen' : 'Subir icono'}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir icono de usuario</DialogTitle>
            <DialogDescription>
              Arrastra una imagen o haz clic para seleccionarla.
            </DialogDescription>
          </DialogHeader>

          <div style={{ marginTop: '1.5rem' }}>
            <UploadDropzone
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={control as any}
              accept="image/jpeg,image/png,image/gif,image/webp"
              description={{
                fileTypes: 'JPG, PNG, GIF, WebP',
                maxFiles: 1,
              }}
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-[8px] border border-hw-error-border bg-hw-error-bg text-hw-error text-[0.8rem]">
              {error}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

