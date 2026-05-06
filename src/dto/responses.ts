// DTOs de respuesta — objetos devueltos por la API del backend
// Cada interfaz refleja el ResponseDto correspondiente en Java
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
import type { Decimal, JsonMap } from './requests';

// Fecha/hora como string ISO 8601 (formato del backend)
export type LocalDateTimeString = string;

/** Dispositivo de almacenamiento (SSD, HDD, NVMe) */
export interface AlmacenamientoResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  capacidad: Decimal;
  tipo: AlmacenamientoTipo;
  formato: AlmacenamientoFormato;
  velocidadLectura: number;
  velocidadEscritura: number;
  conectividad: AlmacenamientoConectividad;
}

/** Caja (chasis de PC) con todas sus medidas y compatibilidades */
export interface CajaResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
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

/** Comentario publicado en el foro */
export interface ComentarioResponseDto {
  id: number;
  textoContenido: string;
  likes: number;
  fecha: LocalDateTimeString;
  usuarioId: number;
  comentarioId: number;
  publicacionId: number;
}

/** Procesador con sus especificaciones técnicas */
export interface CpuResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
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
  puntuacionPassmarkSinglethread: number;
  puntuacionPassmarkMultithread: number;
}

/** Objeto de error estándar devuelto por el backend */
export interface ErrorResponse {
  status: number;
  message: string;
  date: LocalDateTimeString;
}

/** Fabricante de hardware */
export interface FabricanteResponseDto {
  id: number;
  nombre: string;
}

/** Tarjeta gráfica con dimensiones físicas */
export interface GpuResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
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
  longitudGpu: number;
  puntuacionPassmark: number;
}

/** Montaje básico: solo IDs de componentes */
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

/** Montaje enriquecido: IDs + datos completos de cada componente */
export interface MontajeEnrichedDto extends MontajeResponseDto {
  cpu?: CpuResponseDto;
  gpu?: GpuResponseDto;
  ram?: RamResponseDto;
  refrigeracion?: RefrigeracionResponseDto;
  caja?: CajaResponseDto;
  placaBase?: PlacaBaseResponseDto;
  psu?: PsuResponseDto;
  almacenamiento?: AlmacenamientoResponseDto;
}

/** Placa base con socket, chipset y slots */
export interface PlacaBaseResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
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

/** Fuente de alimentación */
export interface PsuResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  modular: boolean;
  potencia: number;
  certificacion: PsuCertificacion;
  factorForma: PsuFactorForma;
}

/** Publicación del foro con conteo de reacciones */
export interface PublicacionResponseDto {
  id: number;
  contenidoTexto: string;
  multimedia: string | null;
  montajeId: number;
  fecha: LocalDateTimeString;
  usuarioId: number;
  likesCount: number;
  dislikesCount: number;
  loveCount: number;
  funnyCount: number;
  interestingCount: number;
}

/** Módulo de RAM */
export interface RamResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  velocidad: number;
  cantidad: number;
  modulos: number;
  capacidadPorModulo: number;
  tipo: RamTipo;
  latencia: number;
}

/** Evento en tiempo real de nueva publicación (WebSocket) */
export interface NuevaPublicacionEventDto {
  id: number;
  usuarioId: number;
  autorNombre: string | null;
  preview: string | null;
  fecha: string;
}

/** Conteo agregado de reacciones a una publicación */
export interface ReaccionConteoDto {
  publicacionId: number;
  likesCount: number;
  dislikesCount: number;
  loveCount: number;
  funnyCount: number;
  interestingCount: number;
}

/** Sistema de refrigeración (aire o líquida) */
export interface RefrigeracionResponseDto {
  id: number;
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  socketCompatible: CpuSocket[];
  tipo: RefrigeracionTipo;
  atributos: JsonMap;
}

/** Usuario del sistema con contador de seguidores */
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

/** Respuesta de login: nombre de usuario y rol */
export interface LoginResponseDto {
  username: string;
  role: UsuarioRol;
}

/** Noticia tecnológica agregada desde fuentes externas */
export interface NoticiaResponseDto {
  title:       string;              
  description: string;              
  url:         string;              
  image:       string;              
  publishedAt: LocalDateTimeString; 
  sourceName:  string;              
}

// Cloudinary devuelve directamente un string (public_id o URL)
export type CloudinaryUploadResponseDto = string;
export type CloudinaryDeleteResponseDto = string;
export type CloudinaryUrlResponseDto = string;

