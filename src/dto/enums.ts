// Tipos enum que representan los valores permitidos de cada campo en la API
// Corresponden directamente a los enums de Java del backend

// ── Almacenamiento ──────────────────────────────────────────────────────────

export type AlmacenamientoConectividad =
  | 'ALMACENAMIENTO_CONECTIVIDAD_PCIE'
  | 'ALMACENAMIENTO_CONECTIVIDAD_SATA';

// Formato físico del disco (2.5" o 3.5")
export type AlmacenamientoFormato =
  | 'ALMACENAMIENTO_FORMATO_2_5'
  | 'ALMACENAMIENTO_FORMATO_3_5';

// Tecnología de almacenamiento
export type AlmacenamientoTipo =
  | 'ALMACENAMIENTO_TIPO_NVME_M2'
  | 'ALMACENAMIENTO_TIPO_HDD'
  | 'ALMACENAMIENTO_TIPO_SSD';

// ── Caja ────────────────────────────────────────────────────────────────────

// Factor de forma de la caja (tamaño de torre)
export type CajaFormato =
  | 'CAJA_FORMATO_MINI_ITX'
  | 'CAJA_FORMATO_MICRO_ATX'
  | 'CAJA_FORMATO_ATX'
  | 'CAJA_FORMATO_E_ATX';

// ── CPU ─────────────────────────────────────────────────────────────────────

export type CpuArquitectura =
  | 'CPU_ARQUITECTURA_ZEN3'
  | 'CPU_ARQUITECTURA_ZEN4'
  | 'CPU_ARQUITECTURA_ZEN5'
  | 'CPU_ARQUITECTURA_ALDER_LAKE'
  | 'CPU_ARQUITECTURA_RAPTOR_LAKE'
  | 'CPU_ARQUITECTURA_RAPTOR_LAKE_REFRESH'
  | 'CPU_ARQUITECTURA_ARROW_LAKE';

// Socket físico de la CPU; debe coincidir con el de la placa base
export type CpuSocket =
  | 'CPU_SOCKET_AM4'
  | 'CPU_SOCKET_AM5'
  | 'CPU_SOCKET_LGA1700'
  | 'CPU_SOCKET_LGA1851';

// ── GPU ─────────────────────────────────────────────────────────────────────

export type GpuArquitectura =
  | 'GPU_ARQUITECTURA_ADA_LOVELACE'
  | 'GPU_ARQUITECTURA_BLACKWELL'
  | 'GPU_ARQUITECTURA_RDNA3'
  | 'GPU_ARQUITECTURA_RDNA4'
  | 'GPU_ARQUITECTURA_BATTLEMAGE'
  | 'GPU_ARQUITECTURA_ALCHEMIST';

// Empresa que ensambla el PCB de la GPU (AIB partner)
export type GpuEnsambladora =
  | 'GPU_ENSAMBLADORA_ACER'
  | 'GPU_ENSAMBLADORA_ASROCK'
  | 'GPU_ENSAMBLADORA_ASUS'
  | 'GPU_ENSAMBLADORA_BIOSTAR'
  | 'GPU_ENSAMBLADORA_GAINWARD'
  | 'GPU_ENSAMBLADORA_GIGABYTE'
  | 'GPU_ENSAMBLADORA_INNO3D'
  | 'GPU_ENSAMBLADORA_INTEL'
  | 'GPU_ENSAMBLADORA_NVIDIA'
  | 'GPU_ENSAMBLADORA_LENOVO'
  | 'GPU_ENSAMBLADORA_MSI'
  | 'GPU_ENSAMBLADORA_PALIT'
  | 'GPU_ENSAMBLADORA_PNY'
  | 'GPU_ENSAMBLADORA_POWERCOLOR'
  | 'GPU_ENSAMBLADORA_SAPPHIRE'
  | 'GPU_ENSAMBLADORA_SPARKLE'
  | 'GPU_ENSAMBLADORA_XFX'
  | 'GPU_ENSAMBLADORA_ZOTAC';

// Generación de GPU (para agrupar por línea de producto)
export type GpuGeneracion =
  | 'GPU_GENERACION_RTX_4000'
  | 'GPU_GENERACION_RTX_5000'
  | 'GPU_GENERACION_RX_7000'
  | 'GPU_GENERACION_RX_9000'
  | 'GPU_GENERACION_ARC_SERIE_A'
  | 'GPU_GENERACION_ARC_SERIE_B';

// Tipo de memoria de vídeo
export type GpuTipoVram =
  | 'GPU_TIPO_VRAM_GDDR6'
  | 'GPU_TIPO_VRAM_GDDR6X'
  | 'GPU_TIPO_VRAM_GDDR7';

// ── Placa Base ──────────────────────────────────────────────────────────────

export type PlacaBaseChipset =
  | 'PLACA_BASE_CHIPSET_X570'
  | 'PLACA_BASE_CHIPSET_B550'
  | 'PLACA_BASE_CHIPSET_X470'
  | 'PLACA_BASE_CHIPSET_B450'
  | 'PLACA_BASE_CHIPSET_X870E'
  | 'PLACA_BASE_CHIPSET_X870'
  | 'PLACA_BASE_CHIPSET_B850'
  | 'PLACA_BASE_CHIPSET_B840'
  | 'PLACA_BASE_CHIPSET_X670E'
  | 'PLACA_BASE_CHIPSET_X670'
  | 'PLACA_BASE_CHIPSET_B650E'
  | 'PLACA_BASE_CHIPSET_B650'
  | 'PLACA_BASE_CHIPSET_Z790'
  | 'PLACA_BASE_CHIPSET_B770'
  | 'PLACA_BASE_CHIPSET_H770'
  | 'PLACA_BASE_CHIPSET_Z690'
  | 'PLACA_BASE_CHIPSET_B660'
  | 'PLACA_BASE_CHIPSET_H610'
  | 'PLACA_BASE_CHIPSET_Z890'
  | 'PLACA_BASE_CHIPSET_B860'
  | 'PLACA_BASE_CHIPSET_H810';

// Factor de forma de la placa base; debe ser compatible con la caja
export type PlacaBaseFormato =
  | 'PLACA_BASE_FORMATO_MINI_ITX'
  | 'PLACA_BASE_FORMATO_MICRO_ATX'
  | 'PLACA_BASE_FORMATO_ATX'
  | 'PLACA_BASE_FORMATO_E_ATX';

export type PlacaBaseWifiSoportado =
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_1'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_2'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_3'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_4'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_5'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_6'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_6E'
  | 'PLACA_BASE_WIFI_SOPORTADO_WIFI_7';

// ── PSU ─────────────────────────────────────────────────────────────────────

// Certificación de eficiencia energética 80 PLUS
export type PsuCertificacion =
  | 'PSU_CERTIFICACION_80_PLUS_WHITE'
  | 'PSU_CERTIFICACION_80_PLUS_BRONZE'
  | 'PSU_CERTIFICACION_80_PLUS_SILVER'
  | 'PSU_CERTIFICACION_80_PLUS_GOLD'
  | 'PSU_CERTIFICACION_80_PLUS_PLATINUM'
  | 'PSU_CERTIFICACION_80_PLUS_TITANIUM';

// Factor de forma de la PSU; debe ser compatible con la caja
export type PsuFactorForma =
  | 'PSU_FACTOR_FORMA_ATX'
  | 'PSU_FACTOR_FORMA_SFX'
  | 'PSU_FACTOR_FORMA_SFX_L'
  | 'PSU_FACTOR_FORMA_TFX';

// ── RAM ─────────────────────────────────────────────────────────────────────

// Generación de RAM; debe coincidir con el tipo soportado por la placa base
export type RamTipo = 'RAM_TIPO_DDR4' | 'RAM_TIPO_DDR5';

// ── Refrigeración ───────────────────────────────────────────────────────────

export type RefrigeracionTipo = 'REFRIGERACION_TIPO_LIQUIDA' | 'REFRIGERACION_TIPO_AIRE';

// ── Publicaciones ───────────────────────────────────────────────────────────

// Tipos de reacción disponibles en el foro
export type TipoReaccion = 'LIKE' | 'DISLIKE' | 'LOVE' | 'FUNNY' | 'INTERESTING';

// ── Usuarios ────────────────────────────────────────────────────────────────

export type UsuarioRol = 'ROL_USUARIO' | 'ROL_ADMIN';

