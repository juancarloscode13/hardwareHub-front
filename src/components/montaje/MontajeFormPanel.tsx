import { useState, useMemo } from 'react';
import {
  Cpu,
  MonitorSmartphone,
  MemoryStick,
  HardDrive,
  Fan,
  PcCase,
  Plug,
  Database,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import ComponentSelectorSection from './ComponentSelectorSection';
import type { ColumnDef } from './ComponentSelectorSection';
import { useCpus } from '@/features/cpu/hooks/useCpu';
import { useGpus } from '@/features/gpu/hooks/useGpu';
import { useRams } from '@/features/ram/hooks/useRam';
import { usePlacasBase } from '@/features/placaBase/hooks/usePlacaBase';
import { usePsus } from '@/features/psu/hooks/usePsu';
import { useRefrigeraciones } from '@/features/refrigeracion/hooks/useRefrigeracion';
import { useCajas } from '@/features/caja/hooks/useCaja';
import { useAlmacenamientos } from '@/features/almacenamiento/hooks/useAlmacenamiento';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useCreateMontaje, useUpdateMontaje } from '@/features/montaje/hooks/useCreateMontaje';
import type {
  CpuResponseDto,
  GpuResponseDto,
  RamResponseDto,
  PlacaBaseResponseDto,
  PsuResponseDto,
  RefrigeracionResponseDto,
  CajaResponseDto,
  AlmacenamientoResponseDto,
  MontajeEnrichedDto,
} from '@/dto';



function enumLabel(value: string): string {
  
  const parts = value.split('_');
  return parts.slice(2).join(' ');
}



interface MontajeFormPanelProps {
  
  editingMontaje?: MontajeEnrichedDto;
  onSuccess: () => void;
}



export default function MontajeFormPanel({ editingMontaje, onSuccess }: MontajeFormPanelProps) {
  const { user } = useCurrentUser();
  const createMutation = useCreateMontaje();
  const updateMutation = useUpdateMontaje();
  const isEditing = !!editingMontaje;

  
  const [cpuId, setCpuId] = useState<number | null>(editingMontaje?.cpuId ?? null);
  const [gpuId, setGpuId] = useState<number | null>(editingMontaje?.gpuId ?? null);
  const [ramId, setRamId] = useState<number | null>(editingMontaje?.ramId ?? null);
  const [placaBaseId, setPlacaBaseId] = useState<number | null>(editingMontaje?.placaBaseId ?? null);
  const [psuId, setPsuId] = useState<number | null>(editingMontaje?.psuId ?? null);
  const [refrigeracionId, setRefrigeracionId] = useState<number | null>(editingMontaje?.refrigeracionId ?? null);
  const [cajaId, setCajaId] = useState<number | null>(editingMontaje?.cajaId ?? null);
  const [almacenamientoId, setAlmacenamientoId] = useState<number | null>(editingMontaje?.almacenamientoId ?? null);

  
  const [selectedCpu, setSelectedCpu] = useState<CpuResponseDto | undefined>(editingMontaje?.cpu);
  const [selectedGpu, setSelectedGpu] = useState<GpuResponseDto | undefined>(editingMontaje?.gpu);
  const [selectedRam, setSelectedRam] = useState<RamResponseDto | undefined>(editingMontaje?.ram);
  const [selectedPlacaBase, setSelectedPlacaBase] = useState<PlacaBaseResponseDto | undefined>(editingMontaje?.placaBase);
  const [selectedPsu, setSelectedPsu] = useState<PsuResponseDto | undefined>(editingMontaje?.psu);
  const [selectedRefrigeracion, setSelectedRefrigeracion] = useState<RefrigeracionResponseDto | undefined>(editingMontaje?.refrigeracion);
  const [selectedCaja, setSelectedCaja] = useState<CajaResponseDto | undefined>(editingMontaje?.caja);
  const [selectedAlmacenamiento, setSelectedAlmacenamiento] = useState<AlmacenamientoResponseDto | undefined>(editingMontaje?.almacenamiento);

  
  const { data: cpuData, isLoading: cpuLoading } = useCpus({ size: 200 });
  const { data: gpuData, isLoading: gpuLoading } = useGpus({ size: 200 });
  const { data: ramData, isLoading: ramLoading } = useRams({ size: 200 });
  const { data: placaBaseData, isLoading: pbLoading } = usePlacasBase({ size: 200 });
  const { data: psuData, isLoading: psuLoading } = usePsus({ size: 200 });
  const { data: refrigeracionData, isLoading: refLoading } = useRefrigeraciones({ size: 200 });
  const { data: cajaData, isLoading: cajaLoading } = useCajas({ size: 200 });
  const { data: almData, isLoading: almLoading } = useAlmacenamientos({ size: 200 });

  const cpus = cpuData?.content ?? [];
  const gpus = gpuData?.content ?? [];
  const rams = ramData?.content ?? [];
  const placasBases = placaBaseData?.content ?? [];
  const psus = psuData?.content ?? [];
  const refrigeraciones = refrigeracionData?.content ?? [];
  const cajas = cajaData?.content ?? [];
  const almacenamientos = almData?.content ?? [];

  
  const precioTotal = useMemo(() => {
    return [
      selectedCpu?.precio,
      selectedGpu?.precio,
      selectedRam?.precio,
      selectedPlacaBase?.precio,
      selectedPsu?.precio,
      selectedRefrigeracion?.precio,
      selectedCaja?.precio,
      selectedAlmacenamiento?.precio,
    ]
      .filter((p): p is number => p != null)
      .reduce((sum, p) => sum + p, 0);
  }, [selectedCpu, selectedGpu, selectedRam, selectedPlacaBase, selectedPsu, selectedRefrigeracion, selectedCaja, selectedAlmacenamiento]);

  
  const allSelected =
    cpuId !== null &&
    gpuId !== null &&
    ramId !== null &&
    placaBaseId !== null &&
    psuId !== null &&
    refrigeracionId !== null &&
    cajaId !== null &&
    almacenamientoId !== null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  
  const handleSave = () => {
    if (!user) return;
    if (!allSelected) {
      toast.error('Debes seleccionar todos los componentes');
      return;
    }

    const payload = {
      cpuId: cpuId!,
      gpuId: gpuId!,
      ramId: ramId!,
      placaBaseId: placaBaseId!,
      psuId: psuId!,
      refrigeracionId: refrigeracionId!,
      cajaId: cajaId!,
      almacenamientoId: almacenamientoId!,
      usuarioId: user.id,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editingMontaje!.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Montaje actualizado');
            onSuccess();
          },
          onError: () => toast.error('Error al actualizar el montaje'),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Montaje creado');
          onSuccess();
        },
        onError: () => toast.error('Error al crear el montaje'),
      });
    }
  };

  
  const cpuColumns: ColumnDef<CpuResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (c) => c.modelo },
    {
      key: 'cpuSocket',
      label: 'Socket',
      render: (c) => enumLabel(c.cpuSocket),
      filterOptions: [
        { value: 'CPU_SOCKET_AM4', label: 'AM4' },
        { value: 'CPU_SOCKET_AM5', label: 'AM5' },
        { value: 'CPU_SOCKET_LGA1700', label: 'LGA1700' },
        { value: 'CPU_SOCKET_LGA1851', label: 'LGA1851' },
      ],
    },
    { key: 'hilos', label: 'Hilos', render: (c) => c.hilos },
    { key: 'tdp', label: 'TDP', render: (c) => `${c.tdp}W` },
    { key: 'precio', label: 'Precio', render: (c) => `${c.precio.toFixed(2)} €` },
  ];

  const gpuColumns: ColumnDef<GpuResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (g) => g.modelo },
    {
      key: 'generacion',
      label: 'Generación',
      render: (g) => enumLabel(g.generacion),
      filterOptions: [
        { value: 'GPU_GENERACION_RTX_4000', label: 'RTX 4000' },
        { value: 'GPU_GENERACION_RTX_5000', label: 'RTX 5000' },
        { value: 'GPU_GENERACION_RX_7000', label: 'RX 7000' },
        { value: 'GPU_GENERACION_RX_9000', label: 'RX 9000' },
        { value: 'GPU_GENERACION_ARC_SERIE_A', label: 'Arc Serie A' },
        { value: 'GPU_GENERACION_ARC_SERIE_B', label: 'Arc Serie B' },
      ],
    },
    { key: 'cantidadVram', label: 'VRAM', render: (g) => `${g.cantidadVram} GB` },
    { key: 'tdp', label: 'TDP', render: (g) => `${g.tdp}W` },
    { key: 'precio', label: 'Precio', render: (g) => `${g.precio.toFixed(2)} €` },
  ];

  const ramColumns: ColumnDef<RamResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (r) => r.modelo },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (r) => enumLabel(r.tipo),
      filterOptions: [
        { value: 'RAM_TIPO_DDR4', label: 'DDR4' },
        { value: 'RAM_TIPO_DDR5', label: 'DDR5' },
      ],
    },
    { key: 'cantidad', label: 'Capacidad', render: (r) => `${r.cantidad} GB` },
    { key: 'velocidad', label: 'Velocidad', render: (r) => `${r.velocidad} MHz` },
    { key: 'precio', label: 'Precio', render: (r) => `${r.precio.toFixed(2)} €` },
  ];

  const placaBaseColumns: ColumnDef<PlacaBaseResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (p) => p.modelo },
    {
      key: 'socketCompatible',
      label: 'Socket',
      render: (p) => enumLabel(p.socketCompatible),
      filterOptions: [
        { value: 'CPU_SOCKET_AM4', label: 'AM4' },
        { value: 'CPU_SOCKET_AM5', label: 'AM5' },
        { value: 'CPU_SOCKET_LGA1700', label: 'LGA1700' },
        { value: 'CPU_SOCKET_LGA1851', label: 'LGA1851' },
      ],
    },
    {
      key: 'formato',
      label: 'Formato',
      render: (p) => enumLabel(p.formato),
      filterOptions: [
        { value: 'PLACA_BASE_FORMATO_MINI_ITX', label: 'Mini ITX' },
        { value: 'PLACA_BASE_FORMATO_MICRO_ATX', label: 'Micro ATX' },
        { value: 'PLACA_BASE_FORMATO_ATX', label: 'ATX' },
        { value: 'PLACA_BASE_FORMATO_E_ATX', label: 'E-ATX' },
      ],
    },
    { key: 'precio', label: 'Precio', render: (p) => `${p.precio.toFixed(2)} €` },
  ];

  const psuColumns: ColumnDef<PsuResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (p) => p.modelo },
    { key: 'potencia', label: 'Potencia', render: (p) => `${p.potencia}W` },
    {
      key: 'certificacion',
      label: 'Certificación',
      render: (p) => enumLabel(p.certificacion),
      filterOptions: [
        { value: 'PSU_CERTIFICACION_80_PLUS_WHITE', label: '80+ White' },
        { value: 'PSU_CERTIFICACION_80_PLUS_BRONZE', label: '80+ Bronze' },
        { value: 'PSU_CERTIFICACION_80_PLUS_SILVER', label: '80+ Silver' },
        { value: 'PSU_CERTIFICACION_80_PLUS_GOLD', label: '80+ Gold' },
        { value: 'PSU_CERTIFICACION_80_PLUS_PLATINUM', label: '80+ Platinum' },
        { value: 'PSU_CERTIFICACION_80_PLUS_TITANIUM', label: '80+ Titanium' },
      ],
    },
    { key: 'precio', label: 'Precio', render: (p) => `${p.precio.toFixed(2)} €` },
  ];

  const refrigeracionColumns: ColumnDef<RefrigeracionResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (r) => r.modelo },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (r) => enumLabel(r.tipo),
      filterOptions: [
        { value: 'REFRIGERACION_TIPO_AIRE', label: 'Aire' },
        { value: 'REFRIGERACION_TIPO_LIQUIDA', label: 'Líquida' },
      ],
    },
    {
      key: 'socketCompatible',
      label: 'Socket',
      render: (r) => enumLabel(r.socketCompatible),
      filterOptions: [
        { value: 'CPU_SOCKET_AM4', label: 'AM4' },
        { value: 'CPU_SOCKET_AM5', label: 'AM5' },
        { value: 'CPU_SOCKET_LGA1700', label: 'LGA1700' },
        { value: 'CPU_SOCKET_LGA1851', label: 'LGA1851' },
      ],
    },
    { key: 'precio', label: 'Precio', render: (r) => `${r.precio.toFixed(2)} €` },
  ];

  const cajaColumns: ColumnDef<CajaResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (c) => c.modelo },
    {
      key: 'formato',
      label: 'Formato',
      render: (c) => enumLabel(c.formato),
      filterOptions: [
        { value: 'CAJA_FORMATO_MINI_ITX', label: 'Mini ITX' },
        { value: 'CAJA_FORMATO_MICRO_ATX', label: 'Micro ATX' },
        { value: 'CAJA_FORMATO_ATX', label: 'ATX' },
        { value: 'CAJA_FORMATO_E_ATX', label: 'E-ATX' },
      ],
    },
    { key: 'color', label: 'Color', render: (c) => c.color },
    { key: 'precio', label: 'Precio', render: (c) => `${c.precio.toFixed(2)} €` },
  ];

  const almacenamientoColumns: ColumnDef<AlmacenamientoResponseDto>[] = [
    { key: 'modelo', label: 'Modelo', render: (a) => a.modelo },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (a) => enumLabel(a.tipo),
      filterOptions: [
        { value: 'ALMACENAMIENTO_TIPO_NVME_M2', label: 'NVMe M.2' },
        { value: 'ALMACENAMIENTO_TIPO_SSD', label: 'SSD' },
        { value: 'ALMACENAMIENTO_TIPO_HDD', label: 'HDD' },
      ],
    },
    { key: 'capacidad', label: 'Capacidad', render: (a) => `${a.capacidad} GB` },
    { key: 'precio', label: 'Precio', render: (a) => `${a.precio.toFixed(2)} €` },
  ];

  // ── Resumen ─────────────────────────────────────────────────────────
  const summaryItems = [
    { label: 'CPU', name: selectedCpu?.modelo, price: selectedCpu?.precio },
    { label: 'GPU', name: selectedGpu?.modelo, price: selectedGpu?.precio },
    { label: 'RAM', name: selectedRam?.modelo, price: selectedRam?.precio },
    { label: 'Placa Base', name: selectedPlacaBase?.modelo, price: selectedPlacaBase?.precio },
    { label: 'Fuente', name: selectedPsu?.modelo, price: selectedPsu?.precio },
    { label: 'Refrigeración', name: selectedRefrigeracion?.modelo, price: selectedRefrigeracion?.precio },
    { label: 'Caja', name: selectedCaja?.modelo, price: selectedCaja?.precio },
    { label: 'Almacenamiento', name: selectedAlmacenamiento?.modelo, price: selectedAlmacenamiento?.precio },
  ];

  const selectedCount = summaryItems.filter((s) => s.name).length;

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Columna izquierda: Selectores */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          <ComponentSelectorSection<CpuResponseDto>
            accordionValue="cpu"
            title="CPU"
            icon={Cpu}
            items={cpus}
            isLoading={cpuLoading}
            columns={cpuColumns}
            selectedId={cpuId}
            selectedItem={selectedCpu}
            onSelect={(c) => { setCpuId(c.id); setSelectedCpu(c); }}
            onDeselect={() => { setCpuId(null); setSelectedCpu(undefined); }}
          />

          <ComponentSelectorSection<GpuResponseDto>
            accordionValue="gpu"
            title="GPU"
            icon={MonitorSmartphone}
            items={gpus}
            isLoading={gpuLoading}
            columns={gpuColumns}
            selectedId={gpuId}
            selectedItem={selectedGpu}
            onSelect={(g) => { setGpuId(g.id); setSelectedGpu(g); }}
            onDeselect={() => { setGpuId(null); setSelectedGpu(undefined); }}
          />

          <ComponentSelectorSection<RamResponseDto>
            accordionValue="ram"
            title="RAM"
            icon={MemoryStick}
            items={rams}
            isLoading={ramLoading}
            columns={ramColumns}
            selectedId={ramId}
            selectedItem={selectedRam}
            onSelect={(r) => { setRamId(r.id); setSelectedRam(r); }}
            onDeselect={() => { setRamId(null); setSelectedRam(undefined); }}
          />

          <ComponentSelectorSection<PlacaBaseResponseDto>
            accordionValue="placaBase"
            title="Placa Base"
            icon={HardDrive}
            items={placasBases}
            isLoading={pbLoading}
            columns={placaBaseColumns}
            selectedId={placaBaseId}
            selectedItem={selectedPlacaBase}
            onSelect={(p) => { setPlacaBaseId(p.id); setSelectedPlacaBase(p); }}
            onDeselect={() => { setPlacaBaseId(null); setSelectedPlacaBase(undefined); }}
          />

          <ComponentSelectorSection<PsuResponseDto>
            accordionValue="psu"
            title="Fuente de Alimentación"
            icon={Plug}
            items={psus}
            isLoading={psuLoading}
            columns={psuColumns}
            selectedId={psuId}
            selectedItem={selectedPsu}
            onSelect={(p) => { setPsuId(p.id); setSelectedPsu(p); }}
            onDeselect={() => { setPsuId(null); setSelectedPsu(undefined); }}
          />

          <ComponentSelectorSection<RefrigeracionResponseDto>
            accordionValue="refrigeracion"
            title="Refrigeración"
            icon={Fan}
            items={refrigeraciones}
            isLoading={refLoading}
            columns={refrigeracionColumns}
            selectedId={refrigeracionId}
            selectedItem={selectedRefrigeracion}
            onSelect={(r) => { setRefrigeracionId(r.id); setSelectedRefrigeracion(r); }}
            onDeselect={() => { setRefrigeracionId(null); setSelectedRefrigeracion(undefined); }}
          />

          <ComponentSelectorSection<CajaResponseDto>
            accordionValue="caja"
            title="Caja"
            icon={PcCase}
            items={cajas}
            isLoading={cajaLoading}
            columns={cajaColumns}
            selectedId={cajaId}
            selectedItem={selectedCaja}
            onSelect={(c) => { setCajaId(c.id); setSelectedCaja(c); }}
            onDeselect={() => { setCajaId(null); setSelectedCaja(undefined); }}
          />

          <ComponentSelectorSection<AlmacenamientoResponseDto>
            accordionValue="almacenamiento"
            title="Almacenamiento"
            icon={Database}
            items={almacenamientos}
            isLoading={almLoading}
            columns={almacenamientoColumns}
            selectedId={almacenamientoId}
            selectedItem={selectedAlmacenamiento}
            onSelect={(a) => { setAlmacenamientoId(a.id); setSelectedAlmacenamiento(a); }}
            onDeselect={() => { setAlmacenamientoId(null); setSelectedAlmacenamiento(undefined); }}
          />
        </Accordion>
      </div>

      {/* Columna derecha: Resumen sticky */}
      <div
        className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl"
        style={{
          width: 300,
          flexShrink: 0,
          position: 'sticky',
          top: 24,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3
          className="text-hw-title font-heading font-semibold"
          style={{ fontSize: '1rem', margin: 0 }}
        >
          Resumen ({selectedCount}/8)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {summaryItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              className="text-sm"
            >
              <span className={item.name ? 'text-hw-title' : 'text-muted-foreground'}>
                {item.label}
              </span>
              <span className={item.name ? 'text-hw-title font-medium' : 'text-muted-foreground'}>
                {item.price != null ? `${item.price.toFixed(2)} €` : '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="border-t border-hw-divider"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
          }}
        >
          <span className="text-hw-title font-semibold">Total</span>
          <span className="text-hw-accent font-heading font-bold text-lg">
            {precioTotal.toFixed(2)} €
          </span>
        </div>

        <Button
          onClick={handleSave}
          disabled={!allSelected || isPending}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}
        >
          <Save className="h-4 w-4" />
          {isPending
            ? isEditing ? 'Guardando…' : 'Creando…'
            : isEditing ? 'Guardar cambios' : 'Guardar montaje'
          }
        </Button>
      </div>
    </div>
  );
}



