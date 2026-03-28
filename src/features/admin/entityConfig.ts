import { almacenamientoApi } from '@/api/endpoints/almacenamiento.api';
import { cajaApi }            from '@/api/endpoints/caja.api';
import { cpuApi }             from '@/api/endpoints/cpu.api';
import { fabricanteApi }      from '@/api/endpoints/fabricante.api';
import { gpuApi }             from '@/api/endpoints/gpu.api';
import { placaBaseApi }       from '@/api/endpoints/placa-base.api';
import { psuApi }             from '@/api/endpoints/psu.api';
import { ramApi }             from '@/api/endpoints/ram.api';
import { refrigeracionApi }   from '@/api/endpoints/refrigeracion.api';
import type { PageResponse, PaginationParams } from '@/api/types';

// ── Tipos públicos ─────────────────────────────────────────────────────────

export interface FieldDef {
  name:      string;
  label:     string;
  type:      'text' | 'number' | 'select' | 'boolean' | 'json';
  options?:  { label: string; value: string }[];
  required?: boolean;
}

export interface EntityConfig {
  key:       string;
  label:     string;
  queryFn:   (params?: PaginationParams) => Promise<PageResponse<Record<string, unknown>>>;
  createFn:  (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  updateFn:  (id: number, data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteFn:  (id: number) => Promise<void>;
  columns:   { key: string; header: string }[];
  fields:    FieldDef[];
}

// ── Helper de cast ─────────────────────────────────────────────────────────
// Los generics de cada API son más estrictos que Record<string,unknown>;
// el cast "as unknown as" es necesario para unificarlos en la interfaz genérica.

type AnyRecord = Record<string, unknown>;
type AnyFn = (...args: never[]) => unknown;

function castQuery<T>(fn: (p?: PaginationParams) => Promise<PageResponse<T>>) {
  return fn as unknown as EntityConfig['queryFn'];
}
function castCreate<T, R>(fn: (d: T) => Promise<R>) {
  return fn as unknown as EntityConfig['createFn'];
}
function castUpdate<T, R>(fn: (id: number, d: T) => Promise<R>) {
  return fn as unknown as EntityConfig['updateFn'];
}
function castDelete(fn: (id: number) => Promise<void>): EntityConfig['deleteFn'] {
  return fn;
}

// Suprime el warning de TypeScript sobre variables no usadas en los casts
void (null as unknown as AnyFn);
void (null as unknown as AnyRecord);

// ── Opciones de enums ──────────────────────────────────────────────────────

const CPU_SOCKET_OPTIONS = [
  { value: 'CPU_SOCKET_AM4',    label: 'AM4' },
  { value: 'CPU_SOCKET_AM5',    label: 'AM5' },
  { value: 'CPU_SOCKET_LGA1700', label: 'LGA1700' },
  { value: 'CPU_SOCKET_LGA1851', label: 'LGA1851' },
];

const CPU_ARQ_OPTIONS = [
  { value: 'CPU_ARQUITECTURA_ZEN3',                  label: 'Zen 3' },
  { value: 'CPU_ARQUITECTURA_ZEN4',                  label: 'Zen 4' },
  { value: 'CPU_ARQUITECTURA_ZEN5',                  label: 'Zen 5' },
  { value: 'CPU_ARQUITECTURA_ALDER_LAKE',             label: 'Alder Lake' },
  { value: 'CPU_ARQUITECTURA_RAPTOR_LAKE',            label: 'Raptor Lake' },
  { value: 'CPU_ARQUITECTURA_RAPTOR_LAKE_REFRESH',    label: 'Raptor Lake Refresh' },
  { value: 'CPU_ARQUITECTURA_ARROW_LAKE',             label: 'Arrow Lake' },
];

const GPU_ARQ_OPTIONS = [
  { value: 'GPU_ARQUITECTURA_ADA_LOVELACE', label: 'Ada Lovelace' },
  { value: 'GPU_ARQUITECTURA_BLACKWELL',    label: 'Blackwell' },
  { value: 'GPU_ARQUITECTURA_RDNA3',        label: 'RDNA 3' },
  { value: 'GPU_ARQUITECTURA_RDNA4',        label: 'RDNA 4' },
  { value: 'GPU_ARQUITECTURA_BATTLEMAGE',   label: 'Battlemage' },
  { value: 'GPU_ARQUITECTURA_ALCHEMIST',    label: 'Alchemist' },
];

const GPU_ENSAMBLADORA_OPTIONS = [
  { value: 'GPU_ENSAMBLADORA_ACER',       label: 'Acer' },
  { value: 'GPU_ENSAMBLADORA_ASROCK',     label: 'ASRock' },
  { value: 'GPU_ENSAMBLADORA_ASUS',       label: 'ASUS' },
  { value: 'GPU_ENSAMBLADORA_BIOSTAR',    label: 'Biostar' },
  { value: 'GPU_ENSAMBLADORA_GAINWARD',   label: 'Gainward' },
  { value: 'GPU_ENSAMBLADORA_GIGABYTE',   label: 'Gigabyte' },
  { value: 'GPU_ENSAMBLADORA_INNO3D',     label: 'Inno3D' },
  { value: 'GPU_ENSAMBLADORA_INTEL',      label: 'Intel' },
  { value: 'GPU_ENSAMBLADORA_NVIDIA',     label: 'NVIDIA' },
  { value: 'GPU_ENSAMBLADORA_LENOVO',     label: 'Lenovo' },
  { value: 'GPU_ENSAMBLADORA_MSI',        label: 'MSI' },
  { value: 'GPU_ENSAMBLADORA_PALIT',      label: 'Palit' },
  { value: 'GPU_ENSAMBLADORA_PNY',        label: 'PNY' },
  { value: 'GPU_ENSAMBLADORA_POWERCOLOR', label: 'PowerColor' },
  { value: 'GPU_ENSAMBLADORA_SAPPHIRE',   label: 'Sapphire' },
  { value: 'GPU_ENSAMBLADORA_SPARKLE',    label: 'Sparkle' },
  { value: 'GPU_ENSAMBLADORA_XFX',        label: 'XFX' },
  { value: 'GPU_ENSAMBLADORA_ZOTAC',      label: 'Zotac' },
];

const GPU_GENERACION_OPTIONS = [
  { value: 'GPU_GENERACION_RTX_4000',    label: 'RTX 4000' },
  { value: 'GPU_GENERACION_RTX_5000',    label: 'RTX 5000' },
  { value: 'GPU_GENERACION_RX_7000',     label: 'RX 7000' },
  { value: 'GPU_GENERACION_RX_9000',     label: 'RX 9000' },
  { value: 'GPU_GENERACION_ARC_SERIE_A', label: 'Arc Serie A' },
  { value: 'GPU_GENERACION_ARC_SERIE_B', label: 'Arc Serie B' },
];

const GPU_TIPO_VRAM_OPTIONS = [
  { value: 'GPU_TIPO_VRAM_GDDR6',  label: 'GDDR6' },
  { value: 'GPU_TIPO_VRAM_GDDR6X', label: 'GDDR6X' },
  { value: 'GPU_TIPO_VRAM_GDDR7',  label: 'GDDR7' },
];

const RAM_TIPO_OPTIONS = [
  { value: 'RAM_TIPO_DDR4', label: 'DDR4' },
  { value: 'RAM_TIPO_DDR5', label: 'DDR5' },
];

const PSU_CERT_OPTIONS = [
  { value: 'PSU_CERTIFICACION_80_PLUS_WHITE',    label: '80+ White' },
  { value: 'PSU_CERTIFICACION_80_PLUS_BRONZE',   label: '80+ Bronze' },
  { value: 'PSU_CERTIFICACION_80_PLUS_SILVER',   label: '80+ Silver' },
  { value: 'PSU_CERTIFICACION_80_PLUS_GOLD',     label: '80+ Gold' },
  { value: 'PSU_CERTIFICACION_80_PLUS_PLATINUM', label: '80+ Platinum' },
  { value: 'PSU_CERTIFICACION_80_PLUS_TITANIUM', label: '80+ Titanium' },
];

const PSU_FF_OPTIONS = [
  { value: 'PSU_FACTOR_FORMA_ATX',   label: 'ATX' },
  { value: 'PSU_FACTOR_FORMA_SFX',   label: 'SFX' },
  { value: 'PSU_FACTOR_FORMA_SFX_L', label: 'SFX-L' },
  { value: 'PSU_FACTOR_FORMA_TFX',   label: 'TFX' },
];

const ALMACENAMIENTO_TIPO_OPTIONS = [
  { value: 'ALMACENAMIENTO_TIPO_NVME_M2', label: 'NVMe M.2' },
  { value: 'ALMACENAMIENTO_TIPO_HDD',     label: 'HDD' },
  { value: 'ALMACENAMIENTO_TIPO_SSD',     label: 'SSD' },
];

const ALMACENAMIENTO_FORMATO_OPTIONS = [
  { value: 'ALMACENAMIENTO_FORMATO_2_5', label: '2.5"' },
  { value: 'ALMACENAMIENTO_FORMATO_3_5', label: '3.5"' },
];

const ALMACENAMIENTO_CONECTIVIDAD_OPTIONS = [
  { value: 'ALMACENAMIENTO_CONECTIVIDAD_PCIE', label: 'PCIe' },
  { value: 'ALMACENAMIENTO_CONECTIVIDAD_SATA', label: 'SATA' },
];

const CAJA_FORMATO_OPTIONS = [
  { value: 'CAJA_FORMATO_MINI_ITX',  label: 'Mini-ITX' },
  { value: 'CAJA_FORMATO_MICRO_ATX', label: 'Micro-ATX' },
  { value: 'CAJA_FORMATO_ATX',       label: 'ATX' },
  { value: 'CAJA_FORMATO_E_ATX',     label: 'E-ATX' },
];

const PLACA_BASE_CHIPSET_OPTIONS = [
  { value: 'PLACA_BASE_CHIPSET_X570',  label: 'X570' },
  { value: 'PLACA_BASE_CHIPSET_B550',  label: 'B550' },
  { value: 'PLACA_BASE_CHIPSET_X470',  label: 'X470' },
  { value: 'PLACA_BASE_CHIPSET_B450',  label: 'B450' },
  { value: 'PLACA_BASE_CHIPSET_X870E', label: 'X870E' },
  { value: 'PLACA_BASE_CHIPSET_X870',  label: 'X870' },
  { value: 'PLACA_BASE_CHIPSET_B850',  label: 'B850' },
  { value: 'PLACA_BASE_CHIPSET_B840',  label: 'B840' },
  { value: 'PLACA_BASE_CHIPSET_X670E', label: 'X670E' },
  { value: 'PLACA_BASE_CHIPSET_X670',  label: 'X670' },
  { value: 'PLACA_BASE_CHIPSET_B650E', label: 'B650E' },
  { value: 'PLACA_BASE_CHIPSET_B650',  label: 'B650' },
  { value: 'PLACA_BASE_CHIPSET_Z790',  label: 'Z790' },
  { value: 'PLACA_BASE_CHIPSET_B770',  label: 'B770' },
  { value: 'PLACA_BASE_CHIPSET_H770',  label: 'H770' },
  { value: 'PLACA_BASE_CHIPSET_Z690',  label: 'Z690' },
  { value: 'PLACA_BASE_CHIPSET_B660',  label: 'B660' },
  { value: 'PLACA_BASE_CHIPSET_H610',  label: 'H610' },
  { value: 'PLACA_BASE_CHIPSET_Z890',  label: 'Z890' },
  { value: 'PLACA_BASE_CHIPSET_B860',  label: 'B860' },
  { value: 'PLACA_BASE_CHIPSET_H810',  label: 'H810' },
];

const PLACA_BASE_FORMATO_OPTIONS = [
  { value: 'PLACA_BASE_FORMATO_MINI_ITX',  label: 'Mini-ITX' },
  { value: 'PLACA_BASE_FORMATO_MICRO_ATX', label: 'Micro-ATX' },
  { value: 'PLACA_BASE_FORMATO_ATX',       label: 'ATX' },
  { value: 'PLACA_BASE_FORMATO_E_ATX',     label: 'E-ATX' },
];

const PLACA_BASE_WIFI_OPTIONS = [
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_1',  label: 'Wi-Fi 1' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_2',  label: 'Wi-Fi 2' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_3',  label: 'Wi-Fi 3' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_4',  label: 'Wi-Fi 4' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_5',  label: 'Wi-Fi 5' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_6',  label: 'Wi-Fi 6' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_6E', label: 'Wi-Fi 6E' },
  { value: 'PLACA_BASE_WIFI_SOPORTADO_WIFI_7',  label: 'Wi-Fi 7' },
];

const REFRIGERACION_TIPO_OPTIONS = [
  { value: 'REFRIGERACION_TIPO_LIQUIDA', label: 'Líquida' },
  { value: 'REFRIGERACION_TIPO_AIRE',    label: 'Aire' },
];

// ── Configuraciones de entidades ───────────────────────────────────────────

export const entityConfigs: EntityConfig[] = [
  // ── Fabricantes ────────────────────────────────────────────────────────
  {
    key:      'fabricantes',
    label:    'Fabricantes',
    queryFn:  castQuery(fabricanteApi.getAll),
    createFn: castCreate(fabricanteApi.create),
    updateFn: castUpdate(fabricanteApi.update),
    deleteFn: castDelete(fabricanteApi.deleteById),
    columns: [
      { key: 'id',     header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    ],
  },

  // ── CPUs ───────────────────────────────────────────────────────────────
  {
    key:      'cpus',
    label:    'CPUs',
    queryFn:  castQuery(cpuApi.getAll),
    createFn: castCreate(cpuApi.create),
    updateFn: castUpdate(cpuApi.update),
    deleteFn: castDelete(cpuApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'arquitectura', header: 'Arquitectura' },
    ],
    fields: [
      { name: 'modelo',             label: 'Modelo',                    type: 'text',    required: true },
      { name: 'fabricanteId',       label: 'Fabricante ID',             type: 'number',  required: true },
      { name: 'cpuSocket',          label: 'Socket',                    type: 'select',  required: true, options: CPU_SOCKET_OPTIONS },
      { name: 'cores',              label: 'Cores (JSON)',               type: 'json',    required: true },
      { name: 'cacheApilada',       label: 'Caché Apilada',             type: 'boolean' },
      { name: 'arquitectura',       label: 'Arquitectura',              type: 'select',  required: true, options: CPU_ARQ_OPTIONS },
      { name: 'precio',             label: 'Precio (€)',                type: 'number',  required: true },
      { name: 'hilos',              label: 'Hilos',                     type: 'number',  required: true },
      { name: 'hyperthreading',     label: 'Hyperthreading',            type: 'boolean' },
      { name: 'frecuenciaMax',      label: 'Frecuencia Máx (GHz)',      type: 'number',  required: true },
      { name: 'frecuenciaMin',      label: 'Frecuencia Mín (GHz)',      type: 'number',  required: true },
      { name: 'cantidadCache',      label: 'Caché (MB)',                type: 'number',  required: true },
      { name: 'tdp',                label: 'TDP (W)',                   type: 'number',  required: true },
      { name: 'temperaturaMax',     label: 'Temperatura Máx (°C)',      type: 'number',  required: true },
      { name: 'conectividadPcie',   label: 'PCIe Versión',              type: 'number',  required: true },
      { name: 'graficosIntegrados', label: 'Gráficos Integrados',       type: 'text',    required: true },
      { name: 'puntuacionPassmark', label: 'Puntuación Passmark',       type: 'number',  required: true },
    ],
  },

  // ── GPUs ───────────────────────────────────────────────────────────────
  {
    key:      'gpus',
    label:    'GPUs',
    queryFn:  castQuery(gpuApi.getAll),
    createFn: castCreate(gpuApi.create),
    updateFn: castUpdate(gpuApi.update),
    deleteFn: castDelete(gpuApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'arquitectura', header: 'Arquitectura' },
    ],
    fields: [
      { name: 'modelo',             label: 'Modelo',                  type: 'text',   required: true },
      { name: 'fabricanteId',       label: 'Fabricante ID',           type: 'number', required: true },
      { name: 'ensambladora',       label: 'Ensambladora',            type: 'select', required: true, options: GPU_ENSAMBLADORA_OPTIONS },
      { name: 'nucleos',            label: 'Núcleos (JSON)',           type: 'json',   required: true },
      { name: 'frecuenciaMax',      label: 'Frecuencia Máx (GHz)',    type: 'number', required: true },
      { name: 'frecuenciaMin',      label: 'Frecuencia Mín (GHz)',    type: 'number', required: true },
      { name: 'temperaturaMax',     label: 'Temperatura Máx (°C)',    type: 'number', required: true },
      { name: 'cantidadVram',       label: 'VRAM (GB)',                type: 'number', required: true },
      { name: 'tipoVram',           label: 'Tipo VRAM',               type: 'select', required: true, options: GPU_TIPO_VRAM_OPTIONS },
      { name: 'anchoBanda',         label: 'Ancho Banda (GB/s)',       type: 'number', required: true },
      { name: 'arquitectura',       label: 'Arquitectura',            type: 'select', required: true, options: GPU_ARQ_OPTIONS },
      { name: 'tdp',                label: 'TDP (W)',                  type: 'number', required: true },
      { name: 'conectividadPcie',   label: 'PCIe Versión',            type: 'number', required: true },
      { name: 'precio',             label: 'Precio (€)',              type: 'number', required: true },
      { name: 'generacion',         label: 'Generación',              type: 'select', required: true, options: GPU_GENERACION_OPTIONS },
      { name: 'altoGpu',            label: 'Alto GPU (mm)',            type: 'number', required: true },
      { name: 'puntuacionPassmark', label: 'Puntuación Passmark',      type: 'number', required: true },
    ],
  },

  // ── RAMs ───────────────────────────────────────────────────────────────
  {
    key:      'rams',
    label:    'RAMs',
    queryFn:  castQuery(ramApi.getAll),
    createFn: castCreate(ramApi.create),
    updateFn: castUpdate(ramApi.update),
    deleteFn: castDelete(ramApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'tipo',         header: 'Tipo' },
    ],
    fields: [
      { name: 'modelo',            label: 'Modelo',              type: 'text',   required: true },
      { name: 'fabricanteId',      label: 'Fabricante ID',       type: 'number', required: true },
      { name: 'precio',            label: 'Precio (€)',          type: 'number', required: true },
      { name: 'velocidad',         label: 'Velocidad (MHz)',      type: 'number', required: true },
      { name: 'cantidad',          label: 'Cantidad (GB)',        type: 'number', required: true },
      { name: 'modulos',           label: 'Módulos',              type: 'number', required: true },
      { name: 'capacidadPorModulo', label: 'Capacidad/Módulo (GB)', type: 'number', required: true },
      { name: 'tipo',              label: 'Tipo',                type: 'select', required: true, options: RAM_TIPO_OPTIONS },
      { name: 'latencia',          label: 'Latencia (CL)',        type: 'number', required: true },
    ],
  },

  // ── PSUs ───────────────────────────────────────────────────────────────
  {
    key:      'psus',
    label:    'PSUs',
    queryFn:  castQuery(psuApi.getAll),
    createFn: castCreate(psuApi.create),
    updateFn: castUpdate(psuApi.update),
    deleteFn: castDelete(psuApi.deleteById),
    columns: [
      { key: 'id',            header: 'ID' },
      { key: 'modelo',        header: 'Modelo' },
      { key: 'fabricanteId',  header: 'Fabricante ID' },
      { key: 'precio',        header: 'Precio (€)' },
      { key: 'potencia',      header: 'Potencia (W)' },
      { key: 'certificacion', header: 'Certificación' },
    ],
    fields: [
      { name: 'modelo',        label: 'Modelo',           type: 'text',    required: true },
      { name: 'fabricanteId',  label: 'Fabricante ID',    type: 'number',  required: true },
      { name: 'precio',        label: 'Precio (€)',       type: 'number',  required: true },
      { name: 'modular',       label: 'Modular',          type: 'boolean' },
      { name: 'potencia',      label: 'Potencia (W)',      type: 'number',  required: true },
      { name: 'certificacion', label: 'Certificación',    type: 'select',  required: true, options: PSU_CERT_OPTIONS },
      { name: 'factorForma',   label: 'Factor de Forma',  type: 'select',  required: true, options: PSU_FF_OPTIONS },
    ],
  },

  // ── Almacenamientos ────────────────────────────────────────────────────
  {
    key:      'almacenamientos',
    label:    'Almacenamientos',
    queryFn:  castQuery(almacenamientoApi.getAll),
    createFn: castCreate(almacenamientoApi.create),
    updateFn: castUpdate(almacenamientoApi.update),
    deleteFn: castDelete(almacenamientoApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'tipo',         header: 'Tipo' },
    ],
    fields: [
      { name: 'modelo',            label: 'Modelo',             type: 'text',   required: true },
      { name: 'fabricanteId',      label: 'Fabricante ID',      type: 'number', required: true },
      { name: 'precio',            label: 'Precio (€)',         type: 'number', required: true },
      { name: 'capacidad',         label: 'Capacidad (GB)',      type: 'number', required: true },
      { name: 'tipo',              label: 'Tipo',               type: 'select', required: true, options: ALMACENAMIENTO_TIPO_OPTIONS },
      { name: 'formato',           label: 'Formato',            type: 'select', required: true, options: ALMACENAMIENTO_FORMATO_OPTIONS },
      { name: 'velocidadLectura',  label: 'Lectura (MB/s)',      type: 'number', required: true },
      { name: 'velocidadEscritura', label: 'Escritura (MB/s)',   type: 'number', required: true },
      { name: 'conectividad',      label: 'Conectividad',       type: 'select', required: true, options: ALMACENAMIENTO_CONECTIVIDAD_OPTIONS },
    ],
  },

  // ── Cajas ──────────────────────────────────────────────────────────────
  {
    key:      'cajas',
    label:    'Cajas',
    queryFn:  castQuery(cajaApi.getAll),
    createFn: castCreate(cajaApi.create),
    updateFn: castUpdate(cajaApi.update),
    deleteFn: castDelete(cajaApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'formato',      header: 'Formato' },
    ],
    fields: [
      { name: 'modelo',               label: 'Modelo',                   type: 'text',    required: true },
      { name: 'fabricanteId',         label: 'Fabricante ID',            type: 'number',  required: true },
      { name: 'precio',               label: 'Precio (€)',               type: 'number',  required: true },
      { name: 'formato',              label: 'Formato',                  type: 'select',  required: true, options: CAJA_FORMATO_OPTIONS },
      { name: 'placasBaseCompatibles', label: 'Placas Base Compatibles', type: 'select',  required: true, options: CAJA_FORMATO_OPTIONS },
      { name: 'color',                label: 'Color',                    type: 'text',    required: true },
      { name: 'dimensiones',          label: 'Dimensiones (JSON)',        type: 'json',    required: true },
      { name: 'psuCompatible',        label: 'PSU Compatible',           type: 'select',  required: true, options: PSU_FF_OPTIONS },
      { name: 'longitudMaxGpu',       label: 'Longitud Máx GPU (mm)',     type: 'number',  required: true },
      { name: 'bahias25',             label: 'Bahías 2.5"',              type: 'number',  required: true },
      { name: 'bahias35',             label: 'Bahías 3.5"',              type: 'number',  required: true },
      { name: 'espacioVentiladores',  label: 'Espacio Ventiladores (JSON)', type: 'json', required: true },
      { name: 'ventiladoresIncluidos', label: 'Ventiladores Incluidos',  type: 'boolean' },
      { name: 'soportesRadiador',     label: 'Soportes Radiador (JSON)', type: 'json',    required: true },
      { name: 'conectividadFrontal',  label: 'Conectividad Frontal (JSON)', type: 'json', required: true },
      { name: 'rgb',                  label: 'RGB',                      type: 'boolean' },
      { name: 'alturaMaxEnfriadorCpu', label: 'Altura Máx Enfriador (mm)', type: 'number', required: true },
    ],
  },

  // ── Placas Base ────────────────────────────────────────────────────────
  {
    key:      'placasBase',
    label:    'Placas Base',
    queryFn:  castQuery(placaBaseApi.getAll),
    createFn: castCreate(placaBaseApi.create),
    updateFn: castUpdate(placaBaseApi.update),
    deleteFn: castDelete(placaBaseApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'chipset',      header: 'Chipset' },
    ],
    fields: [
      { name: 'modelo',               label: 'Modelo',                  type: 'text',   required: true },
      { name: 'fabricanteId',         label: 'Fabricante ID',           type: 'number', required: true },
      { name: 'precio',               label: 'Precio (€)',              type: 'number', required: true },
      { name: 'socketCompatible',     label: 'Socket Compatible',       type: 'select', required: true, options: CPU_SOCKET_OPTIONS },
      { name: 'chipset',              label: 'Chipset',                 type: 'select', required: true, options: PLACA_BASE_CHIPSET_OPTIONS },
      { name: 'memoriaMaxima',        label: 'Memoria Máxima (GB)',      type: 'number', required: true },
      { name: 'espaciosRam',          label: 'Espacios RAM',            type: 'number', required: true },
      { name: 'tipoRamSoportada',     label: 'Tipo RAM Soportada',      type: 'select', required: true, options: RAM_TIPO_OPTIONS },
      { name: 'formato',              label: 'Formato',                 type: 'select', required: true, options: PLACA_BASE_FORMATO_OPTIONS },
      { name: 'ranurasExpansion',     label: 'Ranuras Expansión',       type: 'number', required: true },
      { name: 'ranurasAlmacenamiento', label: 'Ranuras Almacenamiento', type: 'number', required: true },
      { name: 'puertosUsb',           label: 'Puertos USB',             type: 'number', required: true },
      { name: 'conectividadInterna',  label: 'Conectividad Interna (JSON)', type: 'json', required: true },
      { name: 'wifiSoportado',        label: 'Wi-Fi Soportado',         type: 'select', required: true, options: PLACA_BASE_WIFI_OPTIONS },
    ],
  },

  // ── Refrigeraciones ────────────────────────────────────────────────────
  {
    key:      'refrigeraciones',
    label:    'Refrigeraciones',
    queryFn:  castQuery(refrigeracionApi.getAll),
    createFn: castCreate(refrigeracionApi.create),
    updateFn: castUpdate(refrigeracionApi.update),
    deleteFn: castDelete(refrigeracionApi.deleteById),
    columns: [
      { key: 'id',           header: 'ID' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'fabricanteId', header: 'Fabricante ID' },
      { key: 'precio',       header: 'Precio (€)' },
      { key: 'tipo',         header: 'Tipo' },
    ],
    fields: [
      { name: 'modelo',            label: 'Modelo',              type: 'text',   required: true },
      { name: 'fabricanteId',      label: 'Fabricante ID',       type: 'number', required: true },
      { name: 'precio',            label: 'Precio (€)',          type: 'number', required: true },
      { name: 'socketCompatible',  label: 'Socket Compatible',   type: 'select', required: true, options: CPU_SOCKET_OPTIONS },
      { name: 'tipo',              label: 'Tipo',                type: 'select', required: true, options: REFRIGERACION_TIPO_OPTIONS },
      { name: 'atributos',         label: 'Atributos (JSON)',     type: 'json',   required: true },
    ],
  },
];

