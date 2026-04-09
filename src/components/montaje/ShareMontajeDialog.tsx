import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreatePublicacion } from '@/features/publicacion/hooks/useCreatePublicacion';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { MontajeEnrichedDto } from '@/dto';

// ── Props ─────────────────────────────────────────────────────────────────

interface ShareMontajeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  montaje: MontajeEnrichedDto;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ShareMontajeDialog({
  open,
  onOpenChange,
  montaje,
}: ShareMontajeDialogProps) {
  const { user } = useCurrentUser();
  const createMutation = useCreatePublicacion();
  const [contenidoTexto, setContenidoTexto] = useState('');

  const cpuName = montaje.cpu?.modelo ?? `CPU #${montaje.cpuId}`;
  const gpuName = montaje.gpu?.modelo ?? `GPU #${montaje.gpuId}`;

  const handleSubmit = () => {
    if (!user) return;
    if (contenidoTexto.trim().length === 0) return;

    createMutation.mutate(
      {
        contenidoTexto,
        multimedia: null,
        montajeId: montaje.id,
        usuarioId: user.id,
      },
      {
        onSuccess: () => {
          toast.success('Montaje compartido en el foro');
          setContenidoTexto('');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Error al compartir el montaje');
        },
      },
    );
  };

  const canSubmit = contenidoTexto.trim().length > 0 && !createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="w-[min(36rem,calc(100vw-2rem))]">
        <DialogHeader>
          <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 className="h-5 w-5 text-hw-accent" />
            Compartir montaje en el foro
          </DialogTitle>
          <DialogDescription>
            Se creará una publicación en el foro con tu montaje adjunto.
          </DialogDescription>
        </DialogHeader>

        {/* Montaje preview */}
        <div
          className="bg-muted/50 rounded-lg"
          style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <span className="text-xs text-muted-foreground font-medium">Montaje seleccionado</span>
          <span className="text-sm text-hw-title font-semibold">
            {cpuName} + {gpuName}
          </span>
        </div>

        {/* Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Textarea
            value={contenidoTexto}
            onChange={(e) => setContenidoTexto(e.target.value)}
            placeholder="Describe tu montaje, ¿por qué elegiste estos componentes?"
            minLength={1}
            maxLength={2000}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {createMutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

