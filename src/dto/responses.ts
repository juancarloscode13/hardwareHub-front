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
  UsuarioRol,
} from './enums';
import type { ByteArrayBase64, Decimal, JsonMap } from './requests';

export type LocalDateTimeString = string;

export interface AlmacenamientoResponseDto {
  id: number;
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

export interface CajaResponseDto {
  id: number;
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

export interface ComentarioResponseDto {
  id: number;
  textoContenido: string;
  likes: number;
  fecha: LocalDateTimeString;
  usuarioId: number;
  comentarioId: number;
  publicacionId: number;
}

export interface CpuResponseDto {
  id: number;
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

export interface ErrorResponse {
  status: number;
  message: string;
  date: LocalDateTimeString;
}

export interface FabricanteResponseDto {
  id: number;
  nombre: string;
}

export interface GpuResponseDto {
  id: number;
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

export interface MontajeResponseDto {
  id: number;
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

export interface PlacaBaseResponseDto {
  id: number;
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

export interface PsuResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  modular: boolean;
  potencia: number;
  certificacion: PsuCertificacion;
  factorForma: PsuFactorForma;
}

export interface PublicacionResponseDto {
  id: number;
  contenidoTexto: string;
  multimedia: ByteArrayBase64;
  montajeId: number;
  fecha: LocalDateTimeString;
  usuarioId: number;
  likesCount: number;
  dislikesCount: number;
  loveCount: number;
  funnyCount: number;
  interestingCount: number;
}

export interface RamResponseDto {
  id: number;
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

export interface ReaccionConteoDto {
  publicacionId: number;
  likesCount: number;
  dislikesCount: number;
  loveCount: number;
  funnyCount: number;
  interestingCount: number;
}

export interface RefrigeracionResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  precio: Decimal;
  socketCompatible: CpuSocket;
  tipo: RefrigeracionTipo;
  atributos: JsonMap;
}

export interface UsuarioResponseDto {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  rol: UsuarioRol;
  followersCount: number;
  followingCount: number;
  iconoPerfil?: string | null;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export interface LoginResponseDto {
  username: string;
  role: UsuarioRol;
}

// ── Noticias ──────────────────────────────────────────────────────────────
export interface NoticiaResponseDto {
  title:       string;              // Título de la noticia
  description: string;              // Descripción breve
  url:         string;              // URL original del artículo (identificador natural único)
  image:       string;              // URL de la imagen de portada
  publishedAt: LocalDateTimeString; // ISO 8601
  sourceName:  string;              // Nombre de la fuente (ej: "Proceso")
}

