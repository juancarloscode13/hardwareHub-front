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

// ── Helpers ───────────────────────────────────────────────────────────────

interface SpecRowProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  price?: number;
}

function SpecRow({ icon: Icon, label, value, price }: SpecRowProps) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon className="h-3.5 w-3.5 text-hw-accent shrink-0" />
      <span className="text-hw-subtitle" style={{ fontSize: '0.72rem', width: 92, flexShrink: 0 }}>
        {label}
      </span>
      <span className="text-hw-title" style={{ fontSize: '0.75rem', flex: 1, wordBreak: 'break-word' }}>
        {value}
      </span>
      {price != null && (
        <span className="text-hw-subtitle shrink-0" style={{ fontSize: '0.7rem' }}>
          {price.toFixed(2)} €
        </span>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface MontajePreviewCardProps {
  montajeId: number;
}

// ── Component ─────────────────────────────────────────────────────────────

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

  if (mLoading) {
    return (
      <div
        className="bg-muted/40 ring-1 ring-hw-card-border rounded-xl"
        style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
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
    <div
      className="bg-muted/40 ring-1 ring-hw-card-border rounded-xl"
      style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span
          className="text-hw-accent font-heading font-semibold"
          style={{ fontSize: '0.78rem', letterSpacing: '0.01em' }}
        >
          🖥 Montaje adjunto
        </span>
        {precioTotal > 0 && (
          <span className="text-hw-subtitle" style={{ fontSize: '0.7rem' }}>
            Total: {precioTotal.toFixed(2)} €
          </span>
        )}
      </div>

      {/* Headline CPU + GPU */}
      {(cpu || gpu) && (
        <p
          className="text-hw-title font-semibold"
          style={{ fontSize: '0.8rem', margin: 0 }}
        >
          {cpu?.modelo ?? '—'} + {gpu?.modelo ?? '—'}
        </p>
      )}

      {/* Spec rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
        <SpecRow icon={Cpu}            label="CPU"           value={cpu?.modelo}            price={cpu?.precio} />
        <SpecRow icon={MonitorSmartphone} label="GPU"        value={gpu?.modelo}            price={gpu?.precio} />
        <SpecRow icon={MemoryStick}    label="RAM"           value={ram?.modelo}            price={ram?.precio} />
        <SpecRow icon={HardDrive}      label="Placa Base"    value={placaBase?.modelo}      price={placaBase?.precio} />
        <SpecRow icon={Plug}           label="Fuente"        value={psu?.modelo}            price={psu?.precio} />
        <SpecRow icon={Fan}            label="Refrigeración" value={refrigeracion?.modelo}  price={refrigeracion?.precio} />
        <SpecRow icon={PcCase}         label="Caja"          value={caja?.modelo}           price={caja?.precio} />
        <SpecRow icon={Database}       label="Almacenamiento" value={almacenamiento?.modelo} price={almacenamiento?.precio} />
      </div>
    </div>
  );
}


