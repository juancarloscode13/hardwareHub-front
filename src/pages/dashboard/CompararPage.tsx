import { useState, useMemo } from 'react';
import { GitCompare, Cpu, MonitorIcon, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCpus } from '@/features/cpu/hooks/useCpu';
import { useGpus } from '@/features/gpu/hooks/useGpu';
import { useFabricantes } from '@/features/fabricante/hooks/useFabricante';
import type { CpuResponseDto, GpuResponseDto, FabricanteResponseDto } from '@/dto';

// ── Tipos ───────────────────────────────────────────────────────────────────

type Category = 'cpu' | 'gpu';

interface SpecRow {
  label: string;
  valueA: string | number;
  valueB: string | number;
  /** Si se proporciona, se usan para mostrar barras visuales */
  numA?: number;
  numB?: number;
  unit?: string;
  higherIsBetter?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function fabricanteName(id: number, map: Map<number, FabricanteResponseDto>): string {
  return map.get(id)?.nombre ?? `#${id}`;
}

function formatEnum(val: string): string {
  // Quita prefijos tipo "CPU_ARQUITECTURA_" y humaniza
  const parts = val.split('_');
  // Buscar el índice donde empieza el nombre real (después de 2 o 3 prefijos de categoría)
  const start = parts.length > 3 ? 3 : 2;
  return parts
    .slice(start)
    .map((p) => p.charAt(0) + p.slice(1).toLowerCase())
    .join(' ');
}

function formatDecimal(val: number | undefined): string {
  if (val === undefined || val === null) return '—';
  return val.toLocaleString('es-ES', { maximumFractionDigits: 2 });
}

// ── Spec builders ───────────────────────────────────────────────────────────

function buildCpuSpecs(
  a: CpuResponseDto,
  b: CpuResponseDto,
  fabMap: Map<number, FabricanteResponseDto>,
): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Socket', valueA: formatEnum(a.cpuSocket), valueB: formatEnum(b.cpuSocket) },
    { label: 'Arquitectura', valueA: formatEnum(a.arquitectura), valueB: formatEnum(b.arquitectura) },
    { label: 'Hilos', valueA: a.hilos, valueB: b.hilos, numA: a.hilos, numB: b.hilos, higherIsBetter: true },
    { label: 'Frec. Base', valueA: `${formatDecimal(a.frecuenciaMin)} GHz`, valueB: `${formatDecimal(b.frecuenciaMin)} GHz`, numA: a.frecuenciaMin, numB: b.frecuenciaMin, higherIsBetter: true },
    { label: 'Frec. Boost', valueA: `${formatDecimal(a.frecuenciaMax)} GHz`, valueB: `${formatDecimal(b.frecuenciaMax)} GHz`, numA: a.frecuenciaMax, numB: b.frecuenciaMax, higherIsBetter: true },
    { label: 'Caché (MB)', valueA: a.cantidadCache, valueB: b.cantidadCache, numA: a.cantidadCache, numB: b.cantidadCache, higherIsBetter: true },
    { label: 'Caché apilada', valueA: a.cacheApilada ? 'Sí' : 'No', valueB: b.cacheApilada ? 'Sí' : 'No' },
    { label: 'Hyperthreading', valueA: a.hyperthreading ? 'Sí' : 'No', valueB: b.hyperthreading ? 'Sí' : 'No' },
    { label: 'TDP', valueA: `${a.tdp} W`, valueB: `${b.tdp} W`, numA: a.tdp, numB: b.tdp, higherIsBetter: false },
    { label: 'Temp. Máx', valueA: `${a.temperaturaMax} °C`, valueB: `${b.temperaturaMax} °C`, numA: a.temperaturaMax, numB: b.temperaturaMax, higherIsBetter: true },
    { label: 'PCIe', valueA: `Gen ${a.conectividadPcie}`, valueB: `Gen ${b.conectividadPcie}`, numA: a.conectividadPcie, numB: b.conectividadPcie, higherIsBetter: true },
    { label: 'Gráficos Int.', valueA: a.graficosIntegrados || '—', valueB: b.graficosIntegrados || '—' },
    { label: 'Passmark', valueA: a.puntuacionPassmark.toLocaleString('es-ES'), valueB: b.puntuacionPassmark.toLocaleString('es-ES'), numA: a.puntuacionPassmark, numB: b.puntuacionPassmark, higherIsBetter: true },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildGpuSpecs(
  a: GpuResponseDto,
  b: GpuResponseDto,
  fabMap: Map<number, FabricanteResponseDto>,
): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Ensambladora', valueA: formatEnum(a.ensambladora), valueB: formatEnum(b.ensambladora) },
    { label: 'Arquitectura', valueA: formatEnum(a.arquitectura), valueB: formatEnum(b.arquitectura) },
    { label: 'Generación', valueA: formatEnum(a.generacion), valueB: formatEnum(b.generacion) },
    { label: 'VRAM', valueA: `${a.cantidadVram} GB`, valueB: `${b.cantidadVram} GB`, numA: a.cantidadVram, numB: b.cantidadVram, higherIsBetter: true },
    { label: 'Tipo VRAM', valueA: formatEnum(a.tipoVram), valueB: formatEnum(b.tipoVram) },
    { label: 'Frec. Base', valueA: `${formatDecimal(a.frecuenciaMin)} MHz`, valueB: `${formatDecimal(b.frecuenciaMin)} MHz`, numA: a.frecuenciaMin, numB: b.frecuenciaMin, higherIsBetter: true },
    { label: 'Frec. Boost', valueA: `${formatDecimal(a.frecuenciaMax)} MHz`, valueB: `${formatDecimal(b.frecuenciaMax)} MHz`, numA: a.frecuenciaMax, numB: b.frecuenciaMax, higherIsBetter: true },
    { label: 'Ancho Banda', valueA: `${a.anchoBanda} GB/s`, valueB: `${b.anchoBanda} GB/s`, numA: a.anchoBanda, numB: b.anchoBanda, higherIsBetter: true },
    { label: 'TDP', valueA: `${a.tdp} W`, valueB: `${b.tdp} W`, numA: a.tdp, numB: b.tdp, higherIsBetter: false },
    { label: 'Temp. Máx', valueA: `${a.temperaturaMax} °C`, valueB: `${b.temperaturaMax} °C`, numA: a.temperaturaMax, numB: b.temperaturaMax, higherIsBetter: true },
    { label: 'PCIe', valueA: `Gen ${a.conectividadPcie}`, valueB: `Gen ${b.conectividadPcie}`, numA: a.conectividadPcie, numB: b.conectividadPcie, higherIsBetter: true },
    { label: 'Alto GPU', valueA: `${a.altoGpu} mm`, valueB: `${b.altoGpu} mm`, numA: a.altoGpu, numB: b.altoGpu, higherIsBetter: false },
    { label: 'Passmark', valueA: a.puntuacionPassmark.toLocaleString('es-ES'), valueB: b.puntuacionPassmark.toLocaleString('es-ES'), numA: a.puntuacionPassmark, numB: b.puntuacionPassmark, higherIsBetter: true },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

// ── SpecBar ─────────────────────────────────────────────────────────────────

function SpecBar({ numA, numB, higherIsBetter }: { numA: number; numB: number; higherIsBetter: boolean }) {
  const max = Math.max(numA, numB, 1);
  const pctA = (numA / max) * 100;
  const pctB = (numB / max) * 100;

  const winnerA = higherIsBetter ? numA >= numB : numA <= numB;
  const winnerB = !winnerA;
  const colorA = winnerA ? 'bg-hw-accent' : 'bg-muted-foreground/30';
  const colorB = winnerB ? 'bg-hw-accent' : 'bg-muted-foreground/30';

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden" style={{ direction: 'rtl' }}>
        <div className={`h-full rounded-full transition-all duration-500 ${colorA}`} style={{ width: `${pctA}%` }} />
      </div>
      <ArrowRightLeft className="h-3 w-3 text-muted-foreground shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colorB}`} style={{ width: `${pctB}%` }} />
      </div>
    </div>
  );
}

// ── ComponentSelector ───────────────────────────────────────────────────────

interface ComponentSelectorProps<T extends { id: number; modelo: string; fabricanteId: number }> {
  items: T[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  fabMap: Map<number, FabricanteResponseDto>;
  label: string;
  isLoading: boolean;
}

function ComponentSelector<T extends { id: number; modelo: string; fabricanteId: number }>({
  items,
  selectedId,
  onSelect,
  fabMap,
  label,
  isLoading,
}: ComponentSelectorProps<T>) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const name = `${fabricanteName(item.fabricanteId, fabMap)} ${item.modelo}`.toLowerCase();
        return name.includes(search.toLowerCase());
      }),
    [items, search, fabMap],
  );

  if (isLoading) {
    return (
      <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="font-heading text-hw-title" style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
        {label}
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar modelo…"
        className="w-full h-9 rounded-lg border border-hw-card-border bg-hw-input px-3 text-sm text-hw-input-text placeholder:text-hw-placeholder focus:outline-none focus:ring-1 focus:ring-hw-accent/50"
      />

      <div
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: 260, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        {filtered.length === 0 && (
          <p className="text-hw-subtitle text-center" style={{ fontSize: '0.8rem', padding: '16px 0' }}>
            No se encontraron componentes.
          </p>
        )}
        {filtered.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(isSelected ? null : item.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-hw-accent/10 ring-1 ring-hw-accent/30 text-hw-title font-medium'
                  : 'hover:bg-muted/60 text-hw-title'
              }`}
            >
              <span className="text-hw-subtitle" style={{ fontSize: '0.7rem' }}>
                {fabricanteName(item.fabricanteId, fabMap)}
              </span>
              <br />
              {item.modelo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── CompararPage ────────────────────────────────────────────────────────────

export default function CompararPage() {
  const [category, setCategory] = useState<Category>('cpu');
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);

  // ── Data hooks ────────────────────────────────────────────────────────
  const { data: cpuData, isLoading: cpuLoading } = useCpus({ size: 200 });
  const { data: gpuData, isLoading: gpuLoading } = useGpus({ size: 200 });
  const { data: fabData, isLoading: fabLoading } = useFabricantes({ size: 200 });

  const fabMap = useMemo(() => {
    const map = new Map<number, FabricanteResponseDto>();
    (fabData?.content ?? []).forEach((f) => map.set(f.id, f));
    return map;
  }, [fabData]);

  const cpus = useMemo(() => cpuData?.content ?? [], [cpuData]);
  const gpus = useMemo(() => gpuData?.content ?? [], [gpuData]);

  const isLoading = category === 'cpu' ? cpuLoading || fabLoading : gpuLoading || fabLoading;

  // Reset selección al cambiar de categoría
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSelectedA(null);
    setSelectedB(null);
  };

  // ── Spec rows ─────────────────────────────────────────────────────────
  const specRows: SpecRow[] | null = useMemo(() => {
    if (category === 'cpu' && selectedA && selectedB) {
      const a = cpus.find((c) => c.id === selectedA);
      const b = cpus.find((c) => c.id === selectedB);
      if (a && b) return buildCpuSpecs(a, b, fabMap);
    }
    if (category === 'gpu' && selectedA && selectedB) {
      const a = gpus.find((g) => g.id === selectedA);
      const b = gpus.find((g) => g.id === selectedB);
      if (a && b) return buildGpuSpecs(a, b, fabMap);
    }
    return null;
  }, [category, selectedA, selectedB, cpus, gpus, fabMap]);

  const itemA = category === 'cpu' ? cpus.find((c) => c.id === selectedA) : gpus.find((g) => g.id === selectedA);
  const itemB = category === 'cpu' ? cpus.find((c) => c.id === selectedB) : gpus.find((g) => g.id === selectedB);

  // ── JSX ───────────────────────────────────────────────────────────────

  return (
    <section
      className="flex flex-col gap-8"
      style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 8 }}
    >
      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pr-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-hw-icon-border bg-hw-icon-bg">
          <GitCompare className="w-5 h-5 text-hw-accent" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-hw-title sm:text-2xl">
            Comparar Componentes
          </h1>
          <p className="mt-1 text-sm text-hw-subtitle sm:text-base">
            Selecciona dos componentes del mismo tipo para ver sus diferencias
          </p>
        </div>
      </div>

      {/* ── Category selector ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          variant={category === 'cpu' ? 'default' : 'outline'}
          onClick={() => handleCategoryChange('cpu')}
          className="cursor-pointer"
          style={{ fontSize: '0.82rem', borderRadius: 10, padding: '8px 20px' }}
        >
          <Cpu className="h-4 w-4" style={{ marginRight: 6 }} />
          Procesadores (CPU)
        </Button>
        <Button
          variant={category === 'gpu' ? 'default' : 'outline'}
          onClick={() => handleCategoryChange('gpu')}
          className="cursor-pointer"
          style={{ fontSize: '0.82rem', borderRadius: 10, padding: '8px 20px' }}
        >
          <MonitorIcon className="h-4 w-4" style={{ marginRight: 6 }} />
          Tarjetas Gráficas (GPU)
        </Button>
      </div>

      {/* ── Selectors side by side ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {category === 'cpu' ? (
          <>
            <ComponentSelector
              items={cpus}
              selectedId={selectedA}
              onSelect={setSelectedA}
              fabMap={fabMap}
              label="Componente A"
              isLoading={isLoading}
            />
            <ComponentSelector
              items={cpus}
              selectedId={selectedB}
              onSelect={setSelectedB}
              fabMap={fabMap}
              label="Componente B"
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <ComponentSelector
              items={gpus}
              selectedId={selectedA}
              onSelect={setSelectedA}
              fabMap={fabMap}
              label="Componente A"
              isLoading={isLoading}
            />
            <ComponentSelector
              items={gpus}
              selectedId={selectedB}
              onSelect={setSelectedB}
              fabMap={fabMap}
              label="Componente B"
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* ── Comparison empty state ────────────────────────────────────── */}
      {!specRows && (selectedA === null || selectedB === null) && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <GitCompare className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-hw-subtitle" style={{ fontSize: '0.9rem' }}>
            {selectedA === null && selectedB === null
              ? 'Selecciona dos componentes para compararlos'
              : 'Selecciona el segundo componente para iniciar la comparación'}
          </p>
        </div>
      )}

      {/* ── Comparison table ──────────────────────────────────────────── */}
      {specRows && itemA && itemB && (
        <div
          className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="border-b border-hw-card-border bg-hw-icon-bg/50"
            style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', padding: '16px 20px', gap: 16 }}
          >
            <span className="text-hw-subtitle font-heading" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Especificación
            </span>
            <div style={{ textAlign: 'center' }}>
              <p className="text-hw-title font-heading" style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                {itemA.modelo}
              </p>
              <p className="text-hw-subtitle" style={{ fontSize: '0.7rem', margin: 0 }}>
                {fabricanteName(itemA.fabricanteId, fabMap)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-hw-title font-heading" style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                {itemB.modelo}
              </p>
              <p className="text-hw-subtitle" style={{ fontSize: '0.7rem', margin: 0 }}>
                {fabricanteName(itemB.fabricanteId, fabMap)}
              </p>
            </div>
          </div>

          {/* Rows */}
          {specRows.map((row, idx) => (
            <div
              key={row.label}
              className={idx % 2 === 0 ? 'bg-transparent' : 'bg-hw-icon-bg/30'}
              style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', padding: '12px 20px', gap: 16, alignItems: 'center' }}
            >
              <span className="text-hw-subtitle" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                {row.label}
              </span>

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  className="text-hw-title"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: row.numA !== undefined && row.numB !== undefined && row.higherIsBetter !== undefined
                      ? (row.higherIsBetter ? (row.numA >= row.numB ? 700 : 400) : (row.numA <= row.numB ? 700 : 400))
                      : 500,
                    color: row.numA !== undefined && row.numB !== undefined && row.higherIsBetter !== undefined
                      ? (row.higherIsBetter ? (row.numA >= row.numB ? 'var(--hw-accent)' : undefined) : (row.numA <= row.numB ? 'var(--hw-accent)' : undefined))
                      : undefined,
                  }}
                >
                  {row.valueA}
                </span>
              </div>

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  className="text-hw-title"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: row.numA !== undefined && row.numB !== undefined && row.higherIsBetter !== undefined
                      ? (row.higherIsBetter ? (row.numB >= row.numA ? 700 : 400) : (row.numB <= row.numA ? 700 : 400))
                      : 500,
                    color: row.numA !== undefined && row.numB !== undefined && row.higherIsBetter !== undefined
                      ? (row.higherIsBetter ? (row.numB >= row.numA ? 'var(--hw-accent)' : undefined) : (row.numB <= row.numA ? 'var(--hw-accent)' : undefined))
                      : undefined,
                  }}
                >
                  {row.valueB}
                </span>
              </div>
            </div>
          ))}

          {/* Visual bars section */}
          <div
            className="border-t border-hw-card-border"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <p className="font-heading text-hw-title" style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
              Comparación visual
            </p>
            {specRows
              .filter((r) => r.numA !== undefined && r.numB !== undefined && r.higherIsBetter !== undefined)
              .map((row) => (
                <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span className="text-hw-subtitle">{row.label}</span>
                    <span className="text-hw-subtitle">
                      {row.valueA} vs {row.valueB}
                    </span>
                  </div>
                  <SpecBar numA={row.numA!} numB={row.numB!} higherIsBetter={row.higherIsBetter!} />
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
