// Componente ShareMontajeDialog: encapsula logica y presentacion de montaje.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
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



interface ShareMontajeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  montaje: MontajeEnrichedDto;
}



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
      <DialogContent showCloseButton className="w-[min(36rem,calc(100vw-2rem))] hw-share-montaje-dialog">
        <DialogHeader className="hw-share-montaje-dialog-header">
          <DialogTitle>
            <span className="hw-dialog-title-icon">
              <Share2 className="h-5 w-5 text-hw-accent" />
              Compartir montaje en el foro
            </span>
          </DialogTitle>
          <DialogDescription>
            Se creará una publicación en el foro con tu montaje adjunto.
          </DialogDescription>
        </DialogHeader>

        <div className="hw-share-montaje-dialog-body">
          {/* Montaje preview */}
          <div className="hw-share-montaje-dialog-preview bg-muted/50 rounded-lg flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">Montaje seleccionado</span>
            <span className="text-sm text-hw-title font-semibold">
              {cpuName} + {gpuName}
            </span>
          </div>

          {/* Textarea */}
          <div className="hw-share-montaje-dialog-form">
            <Textarea
              className="hw-share-montaje-dialog-textarea"
              value={contenidoTexto}
              onChange={(e) => setContenidoTexto(e.target.value)}
              placeholder="Describe tu montaje, ¿por qué elegiste estos componentes?"
              minLength={1}
              maxLength={2000}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter className="hw-share-montaje-dialog-footer gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hw-share-montaje-dialog-btn"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="hw-share-montaje-dialog-btn"
          >
            {createMutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




