import { useState, useMemo } from 'react';
import {
  GitCompare, Cpu, MonitorIcon, ArrowRightLeft,
  MemoryStick, HardDrive, CircuitBoard, Zap, Box, Fan,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCpus } from '@/features/cpu/hooks/useCpu';
import { useGpus } from '@/features/gpu/hooks/useGpu';
import { useRams } from '@/features/ram/hooks/useRam';
import { useAlmacenamientos } from '@/features/almacenamiento/hooks/useAlmacenamiento';
import { usePlacasBase } from '@/features/placaBase/hooks/usePlacaBase';
import { usePsus } from '@/features/psu/hooks/usePsu';
import { useCajas } from '@/features/caja/hooks/useCaja';
import { useRefrigeraciones } from '@/features/refrigeracion/hooks/useRefrigeracion';
import { useFabricantes } from '@/features/fabricante/hooks/useFabricante';
import type {
  CpuResponseDto, GpuResponseDto, RamResponseDto,
  AlmacenamientoResponseDto, PlacaBaseResponseDto, PsuResponseDto,
  CajaResponseDto, RefrigeracionResponseDto, FabricanteResponseDto,
} from '@/dto';
import { useCloudinaryMediaUrls } from '@/features/cloudinary/hooks/useCloudinary';
import { ComponentThumbnail } from '@/components/ui/component-thumbnail';


type Category = 'cpu' | 'gpu' | 'ram' | 'almacenamiento' | 'placaBase' | 'psu' | 'caja' | 'refrigeracion';

interface CategoryMeta {
  key: Category;
  label: string;
  icon: React.ElementType;
}

type ComparableItemBase = {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
};

const CATEGORIES: CategoryMeta[] = [
  { key: 'cpu',             label: 'CPU',             icon: Cpu },
  { key: 'gpu',             label: 'GPU',             icon: MonitorIcon },
  { key: 'ram',             label: 'RAM',             icon: MemoryStick },
  { key: 'almacenamiento',  label: 'Almacenamiento',  icon: HardDrive },
  { key: 'placaBase',       label: 'Placa Base',      icon: CircuitBoard },
  { key: 'psu',             label: 'Fuente (PSU)',    icon: Zap },
  { key: 'caja',            label: 'Caja',            icon: Box },
  { key: 'refrigeracion',   label: 'Refrigeración',   icon: Fan },
];

interface SpecRow {
  label: string;
  valueA: string | number;
  valueB: string | number;
  numA?: number;
  numB?: number;
  unit?: string;
  higherIsBetter?: boolean;
}

function fabricanteName(id: number, map: Map<number, FabricanteResponseDto>): string {
  return map.get(id)?.nombre ?? `#${id}`;
}

function formatEnum(val: string): string {
  const parts = val.split('_');
  const start = parts.length > 3 ? 3 : 2;
  return parts
    .slice(start)
    .map((p) => p.charAt(0) + p.slice(1).toLowerCase())
    .join(' ');
}

function formatEnumList(values: string[]): string {
  return values.map(formatEnum).join(', ');
}

function formatDecimal(val: number | undefined): string {
  if (val === undefined || val === null) return '—';
  return val.toLocaleString('es-ES', { maximumFractionDigits: 2 });
}

function formatInteger(val: number | undefined | null): string {
  if (val === undefined || val === null) return '-';
  return val.toLocaleString('es-ES');
}

function toComparableNumber(val: number | null | undefined): number | undefined {
  return typeof val === 'number' ? val : undefined;
}

function formatWithUnit(val: number | null | undefined, unit: string): string {
  const num = toComparableNumber(val);
  return num === undefined ? '—' : `${formatDecimal(num)} ${unit}`;
}

function formatGen(val: number | null | undefined): string {
  const num = toComparableNumber(val);
  return num === undefined ? '—' : `Gen ${formatInteger(num)}`;
}


function buildCpuSpecs(a: CpuResponseDto, b: CpuResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  const tdpA = toComparableNumber(a.tdp);
  const tdpB = toComparableNumber(b.tdp);
  const tempA = toComparableNumber(a.temperaturaMax);
  const tempB = toComparableNumber(b.temperaturaMax);
  const pcieA = toComparableNumber(a.conectividadPcie);
  const pcieB = toComparableNumber(b.conectividadPcie);
  const passmarkSta = toComparableNumber(a.puntuacionPassmarkSinglethread);
  const passmarkStb = toComparableNumber(b.puntuacionPassmarkSinglethread);
  const passmarkMta = toComparableNumber(a.puntuacionPassmarkMultithread);
  const passmarkMtb = toComparableNumber(b.puntuacionPassmarkMultithread);

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
    { label: 'TDP', valueA: formatWithUnit(a.tdp, 'W'), valueB: formatWithUnit(b.tdp, 'W'), numA: tdpA, numB: tdpB, higherIsBetter: false },
    { label: 'Temp. Máx', valueA: formatWithUnit(a.temperaturaMax, '°C'), valueB: formatWithUnit(b.temperaturaMax, '°C'), numA: tempA, numB: tempB, higherIsBetter: true },
    { label: 'PCIe', valueA: formatGen(a.conectividadPcie), valueB: formatGen(b.conectividadPcie), numA: pcieA, numB: pcieB, higherIsBetter: true },
    { label: 'Gráficos Int.', valueA: a.graficosIntegrados || '—', valueB: b.graficosIntegrados || '—' },
    { label: 'PassMark ST', valueA: formatInteger(a.puntuacionPassmarkSinglethread), valueB: formatInteger(b.puntuacionPassmarkSinglethread), numA: passmarkSta, numB: passmarkStb, higherIsBetter: true },
    { label: 'PassMark MT', valueA: formatInteger(a.puntuacionPassmarkMultithread), valueB: formatInteger(b.puntuacionPassmarkMultithread), numA: passmarkMta, numB: passmarkMtb, higherIsBetter: true },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildGpuSpecs(a: GpuResponseDto, b: GpuResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  const tempA = toComparableNumber(a.temperaturaMax);
  const tempB = toComparableNumber(b.temperaturaMax);
  const pcieA = toComparableNumber(a.conectividadPcie);
  const pcieB = toComparableNumber(b.conectividadPcie);
  const altoA = toComparableNumber(a.altoGpu);
  const altoB = toComparableNumber(b.altoGpu);
  const longA = toComparableNumber(a.longitudGpu);
  const longB = toComparableNumber(b.longitudGpu);
  const passmarkA = toComparableNumber(a.puntuacionPassmark);
  const passmarkB = toComparableNumber(b.puntuacionPassmark);

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
    { label: 'TDP', valueA: formatWithUnit(a.tdp, 'W'), valueB: formatWithUnit(b.tdp, 'W'), numA: toComparableNumber(a.tdp), numB: toComparableNumber(b.tdp), higherIsBetter: false },
    { label: 'Temp. Máx', valueA: formatWithUnit(a.temperaturaMax, '°C'), valueB: formatWithUnit(b.temperaturaMax, '°C'), numA: tempA, numB: tempB, higherIsBetter: true },
    { label: 'PCIe', valueA: formatGen(a.conectividadPcie), valueB: formatGen(b.conectividadPcie), numA: pcieA, numB: pcieB, higherIsBetter: true },
    { label: 'Alto GPU', valueA: formatWithUnit(a.altoGpu, 'mm'), valueB: formatWithUnit(b.altoGpu, 'mm'), numA: altoA, numB: altoB, higherIsBetter: false },
    { label: 'Longitud GPU', valueA: formatWithUnit(a.longitudGpu, 'mm'), valueB: formatWithUnit(b.longitudGpu, 'mm'), numA: longA, numB: longB, higherIsBetter: false },
    { label: 'Passmark', valueA: formatInteger(a.puntuacionPassmark), valueB: formatInteger(b.puntuacionPassmark), numA: passmarkA, numB: passmarkB, higherIsBetter: true },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildRamSpecs(a: RamResponseDto, b: RamResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Tipo', valueA: formatEnum(a.tipo), valueB: formatEnum(b.tipo) },
    { label: 'Velocidad', valueA: `${a.velocidad} MHz`, valueB: `${b.velocidad} MHz`, numA: a.velocidad, numB: b.velocidad, higherIsBetter: true },
    { label: 'Capacidad Total', valueA: `${a.cantidad} GB`, valueB: `${b.cantidad} GB`, numA: a.cantidad, numB: b.cantidad, higherIsBetter: true },
    { label: 'Módulos', valueA: a.modulos, valueB: b.modulos, numA: a.modulos, numB: b.modulos, higherIsBetter: true },
    { label: 'Cap. por Módulo', valueA: `${a.capacidadPorModulo} GB`, valueB: `${b.capacidadPorModulo} GB`, numA: a.capacidadPorModulo, numB: b.capacidadPorModulo, higherIsBetter: true },
    { label: 'Latencia (CL)', valueA: `CL${a.latencia}`, valueB: `CL${b.latencia}`, numA: a.latencia, numB: b.latencia, higherIsBetter: false },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildAlmacenamientoSpecs(a: AlmacenamientoResponseDto, b: AlmacenamientoResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Tipo', valueA: formatEnum(a.tipo), valueB: formatEnum(b.tipo) },
    { label: 'Formato', valueA: formatEnum(a.formato), valueB: formatEnum(b.formato) },
    { label: 'Capacidad', valueA: `${formatDecimal(a.capacidad)} TB`, valueB: `${formatDecimal(b.capacidad)} TB`, numA: a.capacidad, numB: b.capacidad, higherIsBetter: true },
    { label: 'Vel. Lectura', valueA: `${a.velocidadLectura} MB/s`, valueB: `${b.velocidadLectura} MB/s`, numA: a.velocidadLectura, numB: b.velocidadLectura, higherIsBetter: true },
    { label: 'Vel. Escritura', valueA: `${a.velocidadEscritura} MB/s`, valueB: `${b.velocidadEscritura} MB/s`, numA: a.velocidadEscritura, numB: b.velocidadEscritura, higherIsBetter: true },
    { label: 'Conectividad', valueA: formatEnum(a.conectividad), valueB: formatEnum(b.conectividad) },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildPlacaBaseSpecs(a: PlacaBaseResponseDto, b: PlacaBaseResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Socket', valueA: formatEnum(a.socketCompatible), valueB: formatEnum(b.socketCompatible) },
    { label: 'Chipset', valueA: formatEnum(a.chipset), valueB: formatEnum(b.chipset) },
    { label: 'Formato', valueA: formatEnum(a.formato), valueB: formatEnum(b.formato) },
    { label: 'Memoria Máx.', valueA: `${a.memoriaMaxima} GB`, valueB: `${b.memoriaMaxima} GB`, numA: a.memoriaMaxima, numB: b.memoriaMaxima, higherIsBetter: true },
    { label: 'Espacios RAM', valueA: a.espaciosRam, valueB: b.espaciosRam, numA: a.espaciosRam, numB: b.espaciosRam, higherIsBetter: true },
    { label: 'Tipo RAM', valueA: formatEnum(a.tipoRamSoportada), valueB: formatEnum(b.tipoRamSoportada) },
    { label: 'Ranuras Expansión', valueA: a.ranurasExpansion, valueB: b.ranurasExpansion, numA: a.ranurasExpansion, numB: b.ranurasExpansion, higherIsBetter: true },
    { label: 'Ranuras Almac.', valueA: a.ranurasAlmacenamiento, valueB: b.ranurasAlmacenamiento, numA: a.ranurasAlmacenamiento, numB: b.ranurasAlmacenamiento, higherIsBetter: true },
    { label: 'Puertos USB', valueA: a.puertosUsb, valueB: b.puertosUsb, numA: a.puertosUsb, numB: b.puertosUsb, higherIsBetter: true },
    { label: 'Wi-Fi', valueA: formatEnum(a.wifiSoportado), valueB: formatEnum(b.wifiSoportado) },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildPsuSpecs(a: PsuResponseDto, b: PsuResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  const potenciaA = toComparableNumber(a.potencia);
  const potenciaB = toComparableNumber(b.potencia);

  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Potencia', valueA: formatWithUnit(a.potencia, 'W'), valueB: formatWithUnit(b.potencia, 'W'), numA: potenciaA, numB: potenciaB, higherIsBetter: true },
    { label: 'Certificación', valueA: formatEnum(a.certificacion), valueB: formatEnum(b.certificacion) },
    { label: 'Factor Forma', valueA: formatEnum(a.factorForma), valueB: formatEnum(b.factorForma) },
    { label: 'Modular', valueA: a.modular ? 'Sí' : 'No', valueB: b.modular ? 'Sí' : 'No' },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildCajaSpecs(a: CajaResponseDto, b: CajaResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  const longGpuA = toComparableNumber(a.longitudMaxGpu);
  const longGpuB = toComparableNumber(b.longitudMaxGpu);
  const bahias25A = toComparableNumber(a.bahias25);
  const bahias25B = toComparableNumber(b.bahias25);
  const bahias35A = toComparableNumber(a.bahias35);
  const bahias35B = toComparableNumber(b.bahias35);
  const alturaA = toComparableNumber(a.alturaMaxEnfriadorCpu);
  const alturaB = toComparableNumber(b.alturaMaxEnfriadorCpu);

  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Formato', valueA: formatEnum(a.formato), valueB: formatEnum(b.formato) },
    { label: 'Placas Compatibles', valueA: formatEnum(a.placasBaseCompatibles), valueB: formatEnum(b.placasBaseCompatibles) },
    { label: 'Color', valueA: a.color, valueB: b.color },
    { label: 'PSU Compatible', valueA: formatEnum(a.psuCompatible), valueB: formatEnum(b.psuCompatible) },
    { label: 'Long. Máx GPU', valueA: formatWithUnit(a.longitudMaxGpu, 'mm'), valueB: formatWithUnit(b.longitudMaxGpu, 'mm'), numA: longGpuA, numB: longGpuB, higherIsBetter: true },
    { label: 'Bahías 2.5"', valueA: formatInteger(a.bahias25), valueB: formatInteger(b.bahias25), numA: bahias25A, numB: bahias25B, higherIsBetter: true },
    { label: 'Bahías 3.5"', valueA: formatInteger(a.bahias35), valueB: formatInteger(b.bahias35), numA: bahias35A, numB: bahias35B, higherIsBetter: true },
    { label: 'Ventiladores Inc.', valueA: a.ventiladoresIncluidos ? 'Sí' : 'No', valueB: b.ventiladoresIncluidos ? 'Sí' : 'No' },
    { label: 'RGB', valueA: a.rgb ? 'Sí' : 'No', valueB: b.rgb ? 'Sí' : 'No' },
    { label: 'Alt. Máx Enfriador', valueA: formatWithUnit(a.alturaMaxEnfriadorCpu, 'mm'), valueB: formatWithUnit(b.alturaMaxEnfriadorCpu, 'mm'), numA: alturaA, numB: alturaB, higherIsBetter: true },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}

function buildRefrigeracionSpecs(a: RefrigeracionResponseDto, b: RefrigeracionResponseDto, fabMap: Map<number, FabricanteResponseDto>): SpecRow[] {
  return [
    { label: 'Fabricante', valueA: fabricanteName(a.fabricanteId, fabMap), valueB: fabricanteName(b.fabricanteId, fabMap) },
    { label: 'Tipo', valueA: formatEnum(a.tipo), valueB: formatEnum(b.tipo) },
    { label: 'Socket Compatible', valueA: formatEnumList(a.socketCompatible), valueB: formatEnumList(b.socketCompatible) },
    { label: 'Precio', valueA: `${formatDecimal(a.precio)} €`, valueB: `${formatDecimal(b.precio)} €`, numA: a.precio, numB: b.precio, higherIsBetter: false },
  ];
}


function SpecBar({ numA, numB, higherIsBetter }: { numA: number; numB: number; higherIsBetter: boolean }) {
  const max = Math.max(numA, numB, 1);
  const pctA = (numA / max) * 100;
  const pctB = (numB / max) * 100;

  const winnerA = higherIsBetter ? numA >= numB : numA <= numB;
  const winnerB = !winnerA;
  const colorA = winnerA ? 'bg-hw-accent' : 'bg-muted-foreground/30';
  const colorB = winnerB ? 'bg-hw-accent' : 'bg-muted-foreground/30';

  return (
    <div className="hw-compare-bar-wrap">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden hw-compare-bar-track">
        <div className={`h-full rounded-full transition-all duration-500 ${colorA}`} style={{ width: `${pctA}%` }} />
      </div>
      <ArrowRightLeft className="h-3 w-3 text-muted-foreground shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colorB}`} style={{ width: `${pctB}%` }} />
      </div>
    </div>
  );
}


interface ComponentSelectorProps<T extends { id: number; modelo: string; fabricanteId: number; imagen?: string | null }> {
  items: T[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  fabMap: Map<number, FabricanteResponseDto>;
  label: string;
  isLoading: boolean;
  imageUrls: Record<string, string>;
}

function ComponentSelector<T extends { id: number; modelo: string; fabricanteId: number; imagen?: string | null }>({
  items,
  selectedId,
  onSelect,
  fabMap,
  label,
  isLoading,
  imageUrls,
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
      <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-compare-selector">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="hw-compare-skeleton-col">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl hw-compare-selector">
      <p className="font-heading text-hw-title hw-compare-selector-title">
        {label}
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar modelo…"
        className="w-full rounded-lg border border-hw-card-border bg-hw-input px-3 text-sm text-hw-input-text placeholder:text-hw-placeholder focus:outline-none focus:ring-1 focus:ring-hw-accent/50 hw-compare-selector-input"
      />

      <div className="overflow-y-auto overscroll-contain hw-compare-selector-list">
        {filtered.length === 0 && (
          <p className="text-hw-subtitle text-center text-[0.8rem] py-4">
            No se encontraron componentes.
          </p>
        )}
        {filtered.map((item) => {
          const isSelected = item.id === selectedId;
          const imageUrl = item.imagen ? imageUrls[item.imagen.trim()] : undefined;
          const fabricante = fabricanteName(item.fabricanteId, fabMap);

          return (
            <button
              key={item.id}
              onClick={() => onSelect(isSelected ? null : item.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer hw-compare-selector-item ${
                isSelected
                  ? 'bg-hw-accent/10 ring-1 ring-hw-accent/30 text-hw-title font-medium'
                  : 'hover:bg-muted/60 text-hw-title'
              }`}
            >
              <div className="hw-compare-selector-item-main">
                <ComponentThumbnail src={imageUrl} alt={item.modelo} size="lg" className="hw-compare-selector-thumb" />
                <div className="hw-compare-selector-item-text">
                  <span className="hw-compare-selector-model block max-w-full">{item.modelo}</span>
                  <span className="text-hw-subtitle hw-compare-selector-fab">
                    Marca: {fabricante}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default function CompararPage() {
  const [category, setCategory] = useState<Category>('cpu');
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);

  const { data: cpuData, isLoading: cpuLoading } = useCpus({ size: 200 });
  const { data: gpuData, isLoading: gpuLoading } = useGpus({ size: 200 });
  const { data: ramData, isLoading: ramLoading } = useRams({ size: 200 });
  const { data: almData, isLoading: almLoading } = useAlmacenamientos({ size: 200 });
  const { data: pbData, isLoading: pbLoading } = usePlacasBase({ size: 200 });
  const { data: psuData, isLoading: psuLoading } = usePsus({ size: 200 });
  const { data: cajaData, isLoading: cajaLoading } = useCajas({ size: 200 });
  const { data: refData, isLoading: refLoading } = useRefrigeraciones({ size: 200 });
  const { data: fabData, isLoading: fabLoading } = useFabricantes({ size: 200 });

  const fabMap = useMemo(() => {
    const map = new Map<number, FabricanteResponseDto>();
    (fabData?.content ?? []).forEach((f) => map.set(f.id, f));
    return map;
  }, [fabData]);

  const cpus = useMemo(() => cpuData?.content ?? [], [cpuData]);
  const gpus = useMemo(() => gpuData?.content ?? [], [gpuData]);
  const rams = useMemo(() => ramData?.content ?? [], [ramData]);
  const almacenamientos = useMemo(() => almData?.content ?? [], [almData]);
  const placasBase = useMemo(() => pbData?.content ?? [], [pbData]);
  const psus = useMemo(() => psuData?.content ?? [], [psuData]);
  const cajas = useMemo(() => cajaData?.content ?? [], [cajaData]);
  const refrigeraciones = useMemo(() => refData?.content ?? [], [refData]);

  const loadingMap: Record<Category, boolean> = {
    cpu: cpuLoading || fabLoading,
    gpu: gpuLoading || fabLoading,
    ram: ramLoading || fabLoading,
    almacenamiento: almLoading || fabLoading,
    placaBase: pbLoading || fabLoading,
    psu: psuLoading || fabLoading,
    caja: cajaLoading || fabLoading,
    refrigeracion: refLoading || fabLoading,
  };

  const isLoading = loadingMap[category];

  const itemsMap: Record<Category, ComparableItemBase[]> = {
    cpu: cpus,
    gpu: gpus,
    ram: rams,
    almacenamiento: almacenamientos,
    placaBase: placasBase,
    psu: psus,
    caja: cajas,
    refrigeracion: refrigeraciones,
  };

  const currentItems = itemsMap[category];
  const { data: currentImageUrls } = useCloudinaryMediaUrls(currentItems.map((item) => item.imagen));

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSelectedA(null);
    setSelectedB(null);
  };

  const specRows: SpecRow[] | null = useMemo(() => {
    if (!selectedA || !selectedB) return null;
    const items = currentItems;
    const a = items.find((c: { id: number }) => c.id === selectedA);
    const b = items.find((c: { id: number }) => c.id === selectedB);
    if (!a || !b) return null;

    switch (category) {
      case 'cpu': return buildCpuSpecs(a as CpuResponseDto, b as CpuResponseDto, fabMap);
      case 'gpu': return buildGpuSpecs(a as GpuResponseDto, b as GpuResponseDto, fabMap);
      case 'ram': return buildRamSpecs(a as RamResponseDto, b as RamResponseDto, fabMap);
      case 'almacenamiento': return buildAlmacenamientoSpecs(a as AlmacenamientoResponseDto, b as AlmacenamientoResponseDto, fabMap);
      case 'placaBase': return buildPlacaBaseSpecs(a as PlacaBaseResponseDto, b as PlacaBaseResponseDto, fabMap);
      case 'psu': return buildPsuSpecs(a as PsuResponseDto, b as PsuResponseDto, fabMap);
      case 'caja': return buildCajaSpecs(a as CajaResponseDto, b as CajaResponseDto, fabMap);
      case 'refrigeracion': return buildRefrigeracionSpecs(a as RefrigeracionResponseDto, b as RefrigeracionResponseDto, fabMap);
      default: return null;
    }
  }, [category, selectedA, selectedB, currentItems, fabMap]);

  const itemA = currentItems.find((c: { id: number }) => c.id === selectedA);
  const itemB = currentItems.find((c: { id: number }) => c.id === selectedB);


  return (
    <section className="flex flex-col gap-8 hw-compare-page">
      <div className="hw-compare-header">
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

      <div className="hw-compare-section-separator" aria-hidden="true" />

      <div className="hw-compare-cats">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={category === key ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(key)}
            className="cursor-pointer hw-compare-cat-btn"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      <div className="hw-compare-section-separator" aria-hidden="true" />

      <div className="hw-compare-selectors">
        <ComponentSelector
          items={currentItems}
          selectedId={selectedA}
          onSelect={setSelectedA}
          fabMap={fabMap}
          label="Componente A"
          isLoading={isLoading}
          imageUrls={currentImageUrls}
        />
        <ComponentSelector
          items={currentItems}
          selectedId={selectedB}
          onSelect={setSelectedB}
          fabMap={fabMap}
          label="Componente B"
          isLoading={isLoading}
          imageUrls={currentImageUrls}
        />
      </div>

      <div className="hw-compare-section-separator" aria-hidden="true" />

      {!specRows && (selectedA === null || selectedB === null) && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <GitCompare className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-hw-subtitle hw-compare-empty-text">
            {selectedA === null && selectedB === null
              ? 'Selecciona dos componentes para compararlos'
              : 'Selecciona el segundo componente para iniciar la comparación'}
          </p>
        </div>
      )}

      {specRows && itemA && itemB && (
        <div className="bg-hw-card ring-1 ring-hw-card-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-hw-card-border bg-hw-icon-bg/50 hw-compare-table-header">
            <span className="text-hw-subtitle font-heading hw-compare-table-header-label">
              Especificación
            </span>
            <div className="hw-compare-table-header-item">
              <div className="hw-compare-table-header-thumb">
                <ComponentThumbnail
                  src={itemA.imagen ? currentImageUrls[itemA.imagen.trim()] : undefined}
                  alt={itemA.modelo}
                />
              </div>
              <p className="text-hw-title font-heading hw-compare-table-header-model">
                {itemA.modelo}
              </p>
              <p className="text-hw-subtitle hw-compare-table-header-fab">
                {fabricanteName(itemA.fabricanteId, fabMap)}
              </p>
            </div>
            <div className="hw-compare-table-header-item">
              <div className="hw-compare-table-header-thumb">
                <ComponentThumbnail
                  src={itemB.imagen ? currentImageUrls[itemB.imagen.trim()] : undefined}
                  alt={itemB.modelo}
                />
              </div>
              <p className="text-hw-title font-heading hw-compare-table-header-model">
                {itemB.modelo}
              </p>
              <p className="text-hw-subtitle hw-compare-table-header-fab">
                {fabricanteName(itemB.fabricanteId, fabMap)}
              </p>
            </div>
          </div>

          {/* Rows */}
          {specRows.map((row, idx) => {
            const hasNums =
              typeof row.numA === 'number' &&
              typeof row.numB === 'number' &&
              row.higherIsBetter !== undefined;
            const winA = hasNums && (row.higherIsBetter ? row.numA! >= row.numB! : row.numA! <= row.numB!);
            const winB = hasNums && (row.higherIsBetter ? row.numB! >= row.numA! : row.numB! <= row.numA!);

            return (
              <div
                key={row.label}
                className={`hw-compare-table-row ${idx % 2 !== 0 ? 'bg-hw-icon-bg/30' : ''}`}
              >
                <span className="text-hw-subtitle hw-compare-table-row-label">
                  {row.label}
                </span>

                <div className="hw-compare-table-cell">
                  <span
                    className={`hw-compare-table-cell-value ${winA ? 'font-bold text-hw-accent' : 'font-normal text-hw-title'}`}
                  >
                    {row.valueA}
                  </span>
                </div>

                <div className="hw-compare-table-cell">
                  <span
                    className={`hw-compare-table-cell-value ${winB ? 'font-bold text-hw-accent' : 'font-normal text-hw-title'}`}
                  >
                    {row.valueB}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Visual bars section */}
          {specRows.some((r) => r.numA !== undefined && r.numB !== undefined && r.higherIsBetter !== undefined) && (
            <div className="hw-compare-card-separator hw-compare-visual">
              <p className="font-heading text-hw-title hw-compare-visual-title">
                Comparación visual
              </p>
              {specRows
                .filter((r) => r.numA !== undefined && r.numB !== undefined && r.higherIsBetter !== undefined)
                .map((row) => (
                  <div key={row.label} className="hw-compare-visual-row">
                    <div className="hw-compare-visual-labels">
                      <span className="text-hw-subtitle">{row.label}</span>
                      <span className="text-hw-subtitle">
                        {row.valueA} vs {row.valueB}
                      </span>
                    </div>
                    <SpecBar numA={row.numA!} numB={row.numB!} higherIsBetter={row.higherIsBetter!} />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

