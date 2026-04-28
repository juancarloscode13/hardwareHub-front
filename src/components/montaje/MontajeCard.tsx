import { useMemo, useState } from 'react';
import { Pencil, Trash2, Share2, Cpu, MonitorSmartphone, MemoryStick, HardDrive, Fan, PcCase, Plug, Database } from 'lucide-react';
import { toast } from 'sonner';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useDeleteMontaje } from '@/features/montaje/hooks/useCreateMontaje';
import { useCloudinaryMediaUrls } from '@/features/cloudinary/hooks/useCloudinary';
import { ComponentThumbnail } from '@/components/ui/component-thumbnail';
import ShareMontajeDialog from './ShareMontajeDialog';
import type { MontajeEnrichedDto } from '@/dto';



function formatPrecio(precio: number | undefined): string {
  if (precio == null) return '—';
  return `${precio.toFixed(2)} €`;
}

function calcularPrecioTotal(m: MontajeEnrichedDto): number {
  return [
    m.cpu?.precio,
    m.gpu?.precio,
    m.ram?.precio,
    m.placaBase?.precio,
    m.psu?.precio,
    m.refrigeracion?.precio,
    m.caja?.precio,
    m.almacenamiento?.precio,
  ]
    .filter((p): p is number => p != null)
    .reduce((sum, p) => sum + p, 0);
}

// ── Row helper ────────────────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  price?: string;
  imageUrl?: string;
}

function DetailRow({ icon: Icon, label, value, price, imageUrl }: DetailRowProps) {
  return (
    <div
      className="hw-montaje-detail-row not-last:border-b border-hw-divider/50"
    >
      <Icon className="hw-montaje-detail-icon h-4 w-4 text-hw-accent shrink-0" />
      <span className="hw-montaje-detail-label text-xs text-muted-foreground">
        {label}
      </span>
      <div className="hw-montaje-detail-main flex items-center flex-1 min-w-0">
        <ComponentThumbnail src={imageUrl} alt={value} size="sm" />
        <span className="hw-montaje-detail-value text-sm text-hw-title flex-1 truncate">{value}</span>
      </div>
      {price && (
        <span className="hw-montaje-detail-price text-xs text-muted-foreground shrink-0">{price}</span>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface MontajeCardProps {
  montaje: MontajeEnrichedDto;
  onEdit: (montaje: MontajeEnrichedDto) => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function MontajeCard({ montaje, onEdit }: MontajeCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const deleteMutation = useDeleteMontaje();

  const imagePublicIds = useMemo(
    () => [
      montaje.cpu?.imagen,
      montaje.gpu?.imagen,
      montaje.ram?.imagen,
      montaje.placaBase?.imagen,
      montaje.psu?.imagen,
      montaje.refrigeracion?.imagen,
      montaje.caja?.imagen,
      montaje.almacenamiento?.imagen,
    ],
    [montaje],
  );

  const { data: imageUrls } = useCloudinaryMediaUrls(imagePublicIds);

  const cpuName = montaje.cpu?.modelo ?? `CPU #${montaje.cpuId}`;
  const gpuName = montaje.gpu?.modelo ?? `GPU #${montaje.gpuId}`;
  const total = calcularPrecioTotal(montaje);

  const handleDelete = () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este montaje?')) return;
    deleteMutation.mutate(montaje.id, {
      onSuccess: () => toast.success('Montaje eliminado'),
      onError: () => toast.error('Error al eliminar el montaje'),
    });
  };

  return (
    <>
      <AccordionItem
        value={`montaje-${montaje.id}`}
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden"
        style={{ border: 'none' }}
      >
        <AccordionTrigger
          className="hover:no-underline px-5 py-4"
          style={{ alignItems: 'center' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
            <span className="hw-montaje-header-name text-hw-title font-heading font-semibold text-sm truncate">
              {cpuName} + {gpuName}
            </span>
            {total > 0 && (
              <span className="text-xs text-muted-foreground">
                Total: {formatPrecio(total)}
              </span>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-5 pb-4 h-auto!">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <DetailRow
              icon={Cpu}
              label="CPU"
              value={cpuName}
              price={formatPrecio(montaje.cpu?.precio)}
              imageUrl={montaje.cpu?.imagen ? imageUrls[montaje.cpu.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={MonitorSmartphone}
              label="GPU"
              value={gpuName}
              price={formatPrecio(montaje.gpu?.precio)}
              imageUrl={montaje.gpu?.imagen ? imageUrls[montaje.gpu.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={MemoryStick}
              label="RAM"
              value={montaje.ram?.modelo ?? `RAM #${montaje.ramId}`}
              price={formatPrecio(montaje.ram?.precio)}
              imageUrl={montaje.ram?.imagen ? imageUrls[montaje.ram.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={HardDrive}
              label="Placa Base"
              value={montaje.placaBase?.modelo ?? `PB #${montaje.placaBaseId}`}
              price={formatPrecio(montaje.placaBase?.precio)}
              imageUrl={montaje.placaBase?.imagen ? imageUrls[montaje.placaBase.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={Plug}
              label="Fuente"
              value={montaje.psu?.modelo ?? `PSU #${montaje.psuId}`}
              price={formatPrecio(montaje.psu?.precio)}
              imageUrl={montaje.psu?.imagen ? imageUrls[montaje.psu.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={Fan}
              label="Refrigeración"
              value={montaje.refrigeracion?.modelo ?? `Refrig. #${montaje.refrigeracionId}`}
              price={formatPrecio(montaje.refrigeracion?.precio)}
              imageUrl={montaje.refrigeracion?.imagen ? imageUrls[montaje.refrigeracion.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={PcCase}
              label="Caja"
              value={montaje.caja?.modelo ?? `Caja #${montaje.cajaId}`}
              price={formatPrecio(montaje.caja?.precio)}
              imageUrl={montaje.caja?.imagen ? imageUrls[montaje.caja.imagen.trim()] : undefined}
            />
            <DetailRow
              icon={Database}
              label="Almacenamiento"
              value={montaje.almacenamiento?.modelo ?? `Alm. #${montaje.almacenamientoId}`}
              price={formatPrecio(montaje.almacenamiento?.precio)}
              imageUrl={montaje.almacenamiento?.imagen ? imageUrls[montaje.almacenamiento.imagen.trim()] : undefined}
            />
          </div>

          {/* Total */}
          {total > 0 && (
            <div
              className="border-t border-hw-divider"
              style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, marginTop: 8 }}
            >
              <span className="text-sm font-semibold text-hw-title">
                Total: {formatPrecio(total)}
              </span>
            </div>
          )}

          {/* Acciones */}
          <div className="hw-montaje-actions-row">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(montaje)}
              className="hw-montajes-action-btn hw-montaje-action-btn-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modificar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="hw-montajes-action-btn hw-montaje-action-btn-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareOpen(true)}
              className="hw-montajes-action-btn hw-montaje-action-btn-sm"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartir
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <ShareMontajeDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        montaje={montaje}
      />
    </>
  );
}

