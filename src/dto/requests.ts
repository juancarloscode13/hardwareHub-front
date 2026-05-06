// DTOs de petición — cuerpos enviados a la API del backend
// Cada interfaz refleja el RequestDto correspondiente en Java
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

export type Decimal = number;         // Precio y valores decimales
export type JsonMap = Record<string, unknown>; // Campos JSON libres (dimensiones, atributos…)
export type ByteArrayBase64 = string; // Bytes codificados en Base64

/** Almacenamiento: SSD SATA/NVMe o HDD */
export interface AlmacenamientoRequestDto {
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

/** Caja (chasis): define qué componentes caben */
export interface CajaRequestDto {
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

/** Comentario en el foro; puede ser respuesta a otro comentario */
export interface ComentarioRequestDto {
  textoContenido: string;
  likes: number;
  usuarioId: number;
  comentarioId: number | null;
  publicacionId: number;
}

/** Procesador */
export interface CpuRequestDto {
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

/** Fabricante de hardware */
export interface FabricanteRequestDto {
  nombre: string;
}

/** Tarjeta gráfica */
export interface GpuRequestDto {
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

/** Montaje: referencia a todos los componentes seleccionados por ID */
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

/** Placa base (motherboard) */
export interface PlacaBaseRequestDto {
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
export interface PsuRequestDto {
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  modular: boolean;
  potencia: number;
  certificacion: PsuCertificacion;
  factorForma: PsuFactorForma;
}

/** Publicación del foro; puede llevar imagen/vídeo o un montaje adjunto */
export interface PublicacionRequestDto {
  contenidoTexto: string;
  multimedia: string | null;
  montajeId: number | null;
  usuarioId: number;
}

/** Módulo de RAM */
export interface RamRequestDto {
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

/** Reacción de un usuario a una publicación */
export interface ReaccionRequestDto {
  usuarioId: number;
  tipo: TipoReaccion;
}

/** Sistema de refrigeración (aire o líquida) */
export interface RefrigeracionRequestDto {
  modelo: string;
  fabricanteId: number;
  imagen?: string | null;
  precio: Decimal;
  socketCompatible: CpuSocket[];
  tipo: RefrigeracionTipo;
  atributos: JsonMap;
}

/** Usuario en el sistema administrativo */
export interface UsuarioRequestDto {
  nombre: string;
  email: string;
  contrasena: string;
  rol: UsuarioRol;
}

/** Credenciales de inicio de sesión */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** Datos de registro de nuevo usuario; avatar se sube a Cloudinary antes */
export interface RegisterRequestDto {
  nombre: string;
  email: string;
  contrasena: string;
  avatar?: File | null;
}

/** Email para solicitar restablecimiento de contraseña */
export interface ForgotPasswordRequestDto {
  email: string;
}

/** Token + nueva contraseña para restablecer acceso */
export interface ResetPasswordRequestDto {
  token: string;
  nuevaContrasena: string;
}

/** Archivo a subir a Cloudinary */
export interface CloudinaryUploadRequestDto {
  file: File;
}

/** Identificador público de un recurso en Cloudinary */
export interface CloudinaryPublicIdRequestDto {
  publicId: string;
}
