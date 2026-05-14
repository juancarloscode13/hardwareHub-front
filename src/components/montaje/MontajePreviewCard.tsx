// Componente MontajePreviewCard: encapsula logica y presentacion de montaje.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { useMemo } from 'react';
import { Cpu, MonitorSmartphone, MemoryStick, HardDrive, Plug, Fan, PcCase, Database } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMontaje } from '@/features/montaje/hooks/useMontaje';
import { useCpu } from '@/features/cpu/hooks/useCpu';
import { useGpu } from '@/features/gpu/hooks/useGpu';
import { useRam } from '@/features/ram/hooks/useRam';
import { usePlacaBase } from '@/features/placaBase/hooks/usePlacaBase';
import { usePsu } from '@/features/psu/hooks/usePsu';
import { useRefrigeracion } from '@/features/refrigeracion/hooks/useRefrigeracion';
import { useCaja } from '@/features/caja/hooks/useCaja';
import { useAlmacenamiento } from '@/features/almacenamiento/hooks/useAlmacenamiento';
import { useCloudinaryMediaUrls } from '@/features/cloudinary/hooks/useCloudinary';
import { ComponentThumbnail } from '@/components/ui/component-thumbnail';



interface SpecRowProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  price?: number;
  imageUrl?: string;
}

function SpecRow({ icon: Icon, label, value, price, imageUrl }: SpecRowProps) {
  if (!value) return null;
  return (
    <div className="hw-montaje-preview-row">
      <Icon className="hw-montaje-preview-icon h-3.5 w-3.5 text-hw-accent shrink-0" />
      <span className="hw-montaje-preview-label text-hw-subtitle">
        {label}
      </span>
      <div className="hw-montaje-preview-main flex items-center min-w-0">
        <ComponentThumbnail src={imageUrl} alt={value} size="sm" />
        <span className="hw-montaje-preview-value text-hw-title">
          {value}
        </span>
      </div>
      {price != null && (
        <span className="hw-montaje-preview-price text-hw-subtitle shrink-0">
          {price.toFixed(2)} €
        </span>
      )}
    </div>
  );
}



interface MontajePreviewCardProps {
  montajeId: number;
}



export default function MontajePreviewCard({ montajeId }: MontajePreviewCardProps) {
  const { data: montaje, isLoading: mLoading } = useMontaje(montajeId);

  const { data: cpu }            = useCpu(montaje?.cpuId ?? 0);
  const { data: gpu }            = useGpu(montaje?.gpuId ?? 0);
  const { data: ram }            = useRam(montaje?.ramId ?? 0);
  const { data: placaBase }      = usePlacaBase(montaje?.placaBaseId ?? 0);
  const { data: psu }            = usePsu(montaje?.psuId ?? 0);
  const { data: refrigeracion }  = useRefrigeracion(montaje?.refrigeracionId ?? 0);
  const { data: caja }           = useCaja(montaje?.cajaId ?? 0);
  const { data: almacenamiento } = useAlmacenamiento(montaje?.almacenamientoId ?? 0);

  const imagePublicIds = useMemo(
    () => [
      cpu?.imagen,
      gpu?.imagen,
      ram?.imagen,
      placaBase?.imagen,
      psu?.imagen,
      refrigeracion?.imagen,
      caja?.imagen,
      almacenamiento?.imagen,
    ],
    [cpu, gpu, ram, placaBase, psu, refrigeracion, caja, almacenamiento],
  );
  const { data: imageUrls } = useCloudinaryMediaUrls(imagePublicIds);

  if (mLoading) {
    return (
      <div className="hw-montaje-preview-card bg-muted/40 ring-1 ring-hw-card-border rounded-xl">
        <Skeleton className="h-3.5 w-48 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full rounded" />
        ))}
      </div>
    );
  }

  if (!montaje) return null;

  const precioTotal =
    (cpu?.precio ?? 0) +
    (gpu?.precio ?? 0) +
    (ram?.precio ?? 0) +
    (placaBase?.precio ?? 0) +
    (psu?.precio ?? 0) +
    (refrigeracion?.precio ?? 0) +
    (caja?.precio ?? 0) +
    (almacenamiento?.precio ?? 0);

  return (
    <div className="hw-montaje-preview-card bg-muted/40 ring-1 ring-hw-card-border rounded-xl">
      {}
      <div className="hw-montaje-preview-header">
        <span
          className="hw-montaje-preview-title text-hw-accent font-heading font-semibold"
        >
          🖥 Montaje adjunto
        </span>
        {precioTotal > 0 && (
          <span className="hw-montaje-preview-total text-hw-subtitle">
            Total: {precioTotal.toFixed(2)} €
          </span>
        )}
      </div>

      {}
      {(cpu || gpu) && (
        <p className="hw-montaje-preview-summary text-hw-title font-semibold">
          {cpu?.modelo ?? '—'} + {gpu?.modelo ?? '—'}
        </p>
      )}

      {}
      <div className="hw-montaje-preview-list">
        <SpecRow icon={Cpu} label="CPU" value={cpu?.modelo} price={cpu?.precio} imageUrl={cpu?.imagen ? imageUrls[cpu.imagen.trim()] : undefined} />
        <SpecRow icon={MonitorSmartphone} label="GPU" value={gpu?.modelo} price={gpu?.precio} imageUrl={gpu?.imagen ? imageUrls[gpu.imagen.trim()] : undefined} />
        <SpecRow icon={MemoryStick} label="RAM" value={ram?.modelo} price={ram?.precio} imageUrl={ram?.imagen ? imageUrls[ram.imagen.trim()] : undefined} />
        <SpecRow icon={HardDrive} label="Placa Base" value={placaBase?.modelo} price={placaBase?.precio} imageUrl={placaBase?.imagen ? imageUrls[placaBase.imagen.trim()] : undefined} />
        <SpecRow icon={Plug} label="Fuente" value={psu?.modelo} price={psu?.precio} imageUrl={psu?.imagen ? imageUrls[psu.imagen.trim()] : undefined} />
        <SpecRow icon={Fan} label="Refrigeración" value={refrigeracion?.modelo} price={refrigeracion?.precio} imageUrl={refrigeracion?.imagen ? imageUrls[refrigeracion.imagen.trim()] : undefined} />
        <SpecRow icon={PcCase} label="Caja" value={caja?.modelo} price={caja?.precio} imageUrl={caja?.imagen ? imageUrls[caja.imagen.trim()] : undefined} />
        <SpecRow icon={Database} label="Almacenamiento" value={almacenamiento?.modelo} price={almacenamiento?.precio} imageUrl={almacenamiento?.imagen ? imageUrls[almacenamiento.imagen.trim()] : undefined} />
      </div>
    </div>
  );
}





