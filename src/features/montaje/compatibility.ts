import type {
  AlmacenamientoResponseDto,
  CajaResponseDto,
  CpuResponseDto,
  GpuResponseDto,
  PlacaBaseResponseDto,
  PsuResponseDto,
  RamResponseDto,
  RefrigeracionResponseDto,
} from '@/dto';

type ComponentKind =
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'placaBase'
  | 'psu'
  | 'refrigeracion'
  | 'caja'
  | 'almacenamiento';

export interface SelectedComponents {
  cpu?: CpuResponseDto;
  gpu?: GpuResponseDto;
  ram?: RamResponseDto;
  placaBase?: PlacaBaseResponseDto;
  psu?: PsuResponseDto;
  refrigeracion?: RefrigeracionResponseDto;
  caja?: CajaResponseDto;
  almacenamiento?: AlmacenamientoResponseDto;
}

export interface CompatibilityIssue {
  code: string;
  message: string;
  related: ComponentKind[];
}

const BOARD_FORMAT_RANK: Record<string, number> = {
  PLACA_BASE_FORMATO_MINI_ITX: 1,
  CAJA_FORMATO_MINI_ITX: 1,
  PLACA_BASE_FORMATO_MICRO_ATX: 2,
  CAJA_FORMATO_MICRO_ATX: 2,
  PLACA_BASE_FORMATO_ATX: 3,
  CAJA_FORMATO_ATX: 3,
  PLACA_BASE_FORMATO_E_ATX: 4,
  CAJA_FORMATO_E_ATX: 4,
};

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const match = value.match(/\d+(?:[.,]\d+)?/);
    if (!match) {
      return undefined;
    }
    const parsed = Number(match[0].replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function collectEntries(value: unknown, path = ''): Array<{ path: string; value: unknown }> {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectEntries(entry, `${path}[${index}]`));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) => {
      const current = path ? `${path}.${key}` : key;
      return [{ path: current, value: entry }, ...collectEntries(entry, current)];
    });
  }

  return [{ path, value }];
}

function extractNumbersFromText(text: string): number[] {
  const matches = text.match(/(\d+(?:[.,]\d+)?)/g) ?? [];
  return matches
    .map((item) => Number(item.replace(',', '.')))
    .filter((num) => Number.isFinite(num));
}

function hasKeyword(path: string, keywords: string[]): boolean {
  const lowerPath = path.toLowerCase();
  return keywords.some((keyword) => lowerPath.includes(keyword));
}

function getCaseMaxGpuHeight(caja: CajaResponseDto): number | undefined {
  const entries = collectEntries(caja.dimensiones);
  for (const entry of entries) {
    if (!entry.path) {
      continue;
    }
    const matchesGpu = hasKeyword(entry.path, ['gpu', 'grafica', 'tarjeta']);
    const matchesHeight = hasKeyword(entry.path, ['altura', 'alto', 'height']);
    if (!matchesGpu || !matchesHeight) {
      continue;
    }
    const numeric = toNumber(entry.value);
    if (numeric != null) {
      return numeric;
    }
  }

  return undefined;
}

function getAirCoolerHeight(refrigeracion: RefrigeracionResponseDto): number | undefined {
  const entries = collectEntries(refrigeracion.atributos);

  for (const entry of entries) {
    if (!entry.path) {
      continue;
    }
    const matchesHeight = hasKeyword(entry.path, ['altura', 'alto', 'height']);
    const matchesCooler = hasKeyword(entry.path, ['disipador', 'cooler', 'aire', 'heatsink']);
    if (!matchesHeight || !matchesCooler) {
      continue;
    }
    const numeric = toNumber(entry.value);
    if (numeric != null) {
      return numeric;
    }
  }

  return undefined;
}

function getRadiatorSizesFromCooler(refrigeracion: RefrigeracionResponseDto): number[] {
  const sizes = new Set<number>();
  const entries = collectEntries(refrigeracion.atributos);

  for (const entry of entries) {
    const matchesRadiatorPath = hasKeyword(entry.path, ['radiador', 'radiator', 'aio']);
    if (!matchesRadiatorPath) {
      continue;
    }

    extractNumbersFromText(entry.path).forEach((size) => sizes.add(size));

    if (typeof entry.value === 'string') {
      extractNumbersFromText(entry.value).forEach((size) => sizes.add(size));
    } else {
      const numeric = toNumber(entry.value);
      if (numeric != null) {
        sizes.add(numeric);
      }
    }
  }

  if (sizes.size === 0) {
    extractNumbersFromText(refrigeracion.modelo).forEach((size) => sizes.add(size));
  }

  return [...sizes];
}

function getCaseRadiatorSupports(caja: CajaResponseDto): number[] {
  const sizes = new Set<number>();
  const entries = collectEntries(caja.soportesRadiador);

  for (const entry of entries) {
    extractNumbersFromText(entry.path).forEach((size) => sizes.add(size));

    if (typeof entry.value === 'string') {
      extractNumbersFromText(entry.value).forEach((size) => sizes.add(size));
    } else {
      const numeric = toNumber(entry.value);
      if (numeric != null) {
        sizes.add(numeric);
      }
    }
  }

  return [...sizes];
}

function boardFitsCase(placaBase: PlacaBaseResponseDto, caja: CajaResponseDto): boolean {
  const boardRank = BOARD_FORMAT_RANK[placaBase.formato];
  const caseRank = BOARD_FORMAT_RANK[caja.placasBaseCompatibles];

  if (boardRank == null || caseRank == null) {
    return true;
  }

  return boardRank <= caseRank;
}

function getRequiredStorageBayType(almacenamiento: AlmacenamientoResponseDto): '2.5' | '3.5' | null {
  if (almacenamiento.tipo === 'ALMACENAMIENTO_TIPO_HDD') {
    return '3.5';
  }
  if (almacenamiento.tipo === 'ALMACENAMIENTO_TIPO_SSD') {
    return almacenamiento.formato === 'ALMACENAMIENTO_FORMATO_3_5' ? '3.5' : '2.5';
  }
  return null;
}

export function getEstimatedBuildTdp(selection: SelectedComponents): number {
  const cpuTdp = selection.cpu?.tdp ?? 0;
  const gpuTdp = selection.gpu?.tdp ?? 0;
  return cpuTdp + gpuTdp;
}

export function getBuildCompatibilityIssues(selection: SelectedComponents): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  if (selection.cpu && selection.placaBase && selection.cpu.cpuSocket !== selection.placaBase.socketCompatible) {
    issues.push({
      code: 'CPU_SOCKET_MISMATCH',
      message: 'La CPU y la placa base deben compartir el mismo socket.',
      related: ['cpu', 'placaBase'],
    });
  }

  if (selection.gpu && selection.caja) {
    if (selection.gpu.longitudGpu > selection.caja.longitudMaxGpu) {
      issues.push({
        code: 'GPU_LENGTH_EXCEEDED',
        message: 'La longitud de la GPU supera el maximo permitido por la caja.',
        related: ['gpu', 'caja'],
      });
    }

    const maxGpuHeight = getCaseMaxGpuHeight(selection.caja);
    if (maxGpuHeight != null && selection.gpu.altoGpu > maxGpuHeight) {
      issues.push({
        code: 'GPU_HEIGHT_EXCEEDED',
        message: 'La altura de la GPU supera el espacio disponible en la caja.',
        related: ['gpu', 'caja'],
      });
    }
  }

  if (selection.placaBase && selection.caja && !boardFitsCase(selection.placaBase, selection.caja)) {
    issues.push({
      code: 'BOARD_FORM_FACTOR_MISMATCH',
      message: 'El formato de la placa base no es compatible con la caja seleccionada.',
      related: ['placaBase', 'caja'],
    });
  }

  if (selection.ram && selection.placaBase && selection.ram.tipo !== selection.placaBase.tipoRamSoportada) {
    issues.push({
      code: 'RAM_TYPE_MISMATCH',
      message: 'El tipo de RAM debe estar soportado por la placa base.',
      related: ['ram', 'placaBase'],
    });
  }

  if (selection.refrigeracion) {
    if (selection.cpu && !selection.refrigeracion.socketCompatible.includes(selection.cpu.cpuSocket)) {
      issues.push({
        code: 'COOLER_SOCKET_MISMATCH',
        message: 'La refrigeracion seleccionada no soporta el socket de la CPU.',
        related: ['refrigeracion', 'cpu'],
      });
    }

    if (selection.caja) {
      if (selection.refrigeracion.tipo === 'REFRIGERACION_TIPO_AIRE') {
        const coolerHeight = getAirCoolerHeight(selection.refrigeracion);
        if (coolerHeight != null && coolerHeight > selection.caja.alturaMaxEnfriadorCpu) {
          issues.push({
            code: 'AIR_COOLER_HEIGHT_EXCEEDED',
            message: 'La altura del disipador de aire supera la altura maxima de la caja.',
            related: ['refrigeracion', 'caja'],
          });
        }
      }

      if (selection.refrigeracion.tipo === 'REFRIGERACION_TIPO_LIQUIDA') {
        const radiatorSizes = getRadiatorSizesFromCooler(selection.refrigeracion);
        const supportedSizes = getCaseRadiatorSupports(selection.caja);
        if (
          radiatorSizes.length > 0
          && supportedSizes.length > 0
          && !radiatorSizes.some((size) => supportedSizes.includes(size))
        ) {
          issues.push({
            code: 'LIQUID_RADIATOR_NOT_SUPPORTED',
            message: 'La caja no tiene soporte para el tamano de radiador de la refrigeracion liquida.',
            related: ['refrigeracion', 'caja'],
          });
        }
      }
    }
  }

  if (selection.almacenamiento && selection.caja) {
    const requiredBayType = getRequiredStorageBayType(selection.almacenamiento);
    if (requiredBayType === '2.5' && selection.caja.bahias25 <= 0) {
      issues.push({
        code: 'SSD_BAY_MISSING',
        message: 'La caja no dispone de bahias 2.5 para este almacenamiento.',
        related: ['almacenamiento', 'caja'],
      });
    }

    if (requiredBayType === '3.5' && selection.caja.bahias35 <= 0) {
      issues.push({
        code: 'HDD_BAY_MISSING',
        message: 'La caja no dispone de bahias 3.5 para este almacenamiento.',
        related: ['almacenamiento', 'caja'],
      });
    }
  }

  if (selection.psu && selection.caja && selection.psu.factorForma !== selection.caja.psuCompatible) {
    issues.push({
      code: 'PSU_FORM_FACTOR_MISMATCH',
      message: 'El factor de forma de la PSU no es compatible con la caja.',
      related: ['psu', 'caja'],
    });
  }

  if (selection.psu) {
    const estimatedTdp = getEstimatedBuildTdp(selection);
    const minRequiredPower = estimatedTdp + 100;
    if (selection.psu.potencia < minRequiredPower) {
      issues.push({
        code: 'PSU_POWER_TOO_LOW',
        message: `La PSU debe ofrecer al menos ${minRequiredPower}W para cubrir el TDP estimado + 100W de margen.`,
        related: ['psu', 'cpu', 'gpu'],
      });
    }
  }

  const dedup = new Map<string, CompatibilityIssue>();
  for (const issue of issues) {
    dedup.set(issue.code, issue);
  }

  return [...dedup.values()];
}

export function getCandidateCompatibilityIssues<K extends ComponentKind>(
  kind: K,
  candidate: NonNullable<SelectedComponents[K]>,
  selection: SelectedComponents,
): CompatibilityIssue[] {
  const nextSelection: SelectedComponents = {
    ...selection,
    [kind]: candidate,
  };

  return getBuildCompatibilityIssues(nextSelection).filter((issue) => issue.related.includes(kind));
}

