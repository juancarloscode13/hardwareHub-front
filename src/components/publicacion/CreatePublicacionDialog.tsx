import { useRef, useState } from 'react';
import { Plus, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Quitar el prefijo "data:...;base64,"
      const base64 = result.split(',')[1] ?? '';
      setMultimedia(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setMultimedia('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setContenidoTexto('');
    setMultimedia('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!user) return;
    if (contenidoTexto.trim().length === 0) return;

    createMutation.mutate(
      {
        contenidoTexto,
        multimedia,
        montajeId: 0,
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
        <DialogHeader>
          <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus className="h-5 w-5 text-hw-accent" />
            Nueva publicación
          </DialogTitle>
        </DialogHeader>

        {/* Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Textarea
            value={contenidoTexto}
            onChange={(e) => setContenidoTexto(e.target.value)}
            placeholder="¿Qué quieres compartir?"
            minLength={1}
            maxLength={2000}
            rows={4}
          />

          {/* Image preview */}
          {multimedia && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={`data:image/jpeg;base64,${multimedia}`}
                alt="Preview"
                style={{ maxHeight: 200, objectFit: 'cover', borderRadius: 8, width: '100%' }}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* File input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ImagePlus className="h-4 w-4" />
              {multimedia ? 'Cambiar imagen' : 'Añadir imagen'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {createMutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

