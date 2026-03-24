import type {
  AlmacenamientoConectividad,
  AlmacenamientoFormato,
  AlmacenamientoTipo,
  CajaFormato,
  CpuArquitectura,
  CpuSocket,
  GpuArquitectura,
  GpuEnsambladora,
  GpuGeneracion,
  GpuTipoVram,
  PlacaBaseChipset,
  PlacaBaseFormato,
  PlacaBaseWifiSoportado,
  PsuCertificacion,
  PsuFactorForma,
  RamTipo,
  RefrigeracionTipo,
  TipoReaccion,
  UsuarioRol,
} from './enums';

export type Decimal = number;
export type JsonMap = Record<string, unknown>;
export type ByteArrayBase64 = string;

export interface AlmacenamientoRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  capacidad: Decimal;
  tipo: AlmacenamientoTipo;
  formato: AlmacenamientoFormato;
  velocidadLectura: number;
  velocidadEscritura: number;
  conectividad: AlmacenamientoConectividad;
}

export interface CajaRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  formato: CajaFormato;
  placasBaseCompatibles: CajaFormato;
  color: string;
  dimensiones: JsonMap;
  psuCompatible: PsuFactorForma;
  longitudMaxGpu: number;
  bahias25: number;
  bahias35: number;
  espacioVentiladores: JsonMap;
  ventiladoresIncluidos: boolean;
  soportesRadiador: JsonMap;
  conectividadFrontal: JsonMap;
  rgb: boolean;
  alturaMaxEnfriadorCpu: number;
}

export interface ComentarioRequestDto {
  textoContenido: string;
  likes: number;
  usuarioId: number;
  comentarioId: number;
  publicacionId: number;
}

export interface CpuRequestDto {
  modelo: string;
  fabricanteId: number;
  cpuSocket: CpuSocket;
  cores: JsonMap;
  cacheApilada: boolean;
  arquitectura: CpuArquitectura;
  precio: Decimal;
  hilos: number;
  hyperthreading: boolean;
  frecuenciaMax: Decimal;
  frecuenciaMin: Decimal;
  cantidadCache: number;
  tdp: number;
  temperaturaMax: number;
  conectividadPcie: number;
  graficosIntegrados: string;
  puntuacionPassmark: number;
}

export interface FabricanteRequestDto {
  nombre: string;
}

export interface GpuRequestDto {
  modelo: string;
  fabricanteId: number;
  ensambladora: GpuEnsambladora;
  nucleos: JsonMap;
  frecuenciaMax: Decimal;
  frecuenciaMin: Decimal;
  temperaturaMax: number;
  cantidadVram: number;
  tipoVram: GpuTipoVram;
  anchoBanda: number;
  arquitectura: GpuArquitectura;
  tdp: number;
  conectividadPcie: number;
  precio: Decimal;
  generacion: GpuGeneracion;
  altoGpu: number;
  puntuacionPassmark: number;
}

export interface MontajeRequestDto {
  ramId: number;
  cpuId: number;
  gpuId: number;
  refrigeracionId: number;
  cajaId: number;
  placaBaseId: number;
  psuId: number;
  almacenamientoId: number;
  usuarioId: number;
}

export interface PlacaBaseRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  socketCompatible: CpuSocket;
  chipset: PlacaBaseChipset;
  memoriaMaxima: number;
  espaciosRam: number;
  tipoRamSoportada: RamTipo;
  formato: PlacaBaseFormato;
  ranurasExpansion: number;
  ranurasAlmacenamiento: number;
  puertosUsb: number;
  conectividadInterna: JsonMap;
  wifiSoportado: PlacaBaseWifiSoportado;
}

export interface PsuRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  modular: boolean;
  potencia: number;
  certificacion: PsuCertificacion;
  factorForma: PsuFactorForma;
}

export interface PublicacionRequestDto {
  contenidoTexto: string;
  multimedia: ByteArrayBase64;
  montajeId: number;
  usuarioId: number;
}

export interface RamRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  velocidad: number;
  cantidad: number;
  modulos: number;
  capacidadPorModulo: number;
  tipo: RamTipo;
  latencia: number;
}

export interface ReaccionRequestDto {
  usuarioId: number;
  tipo: TipoReaccion;
}

export interface RefrigeracionRequestDto {
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  socketCompatible: CpuSocket;
  tipo: RefrigeracionTipo;
  atributos: JsonMap;
}

export interface UsuarioRequestDto {
  nombre: string;
  email: string;
  contrasena: string;
  rol: UsuarioRol;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  nombre: string;
  email: string;
  contrasena: string;
  avatar?: File | null;
}

