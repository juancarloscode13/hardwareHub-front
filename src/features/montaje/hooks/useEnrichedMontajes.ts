import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { cpuApi } from '@/api/endpoints/cpu.api';
import { gpuApi } from '@/api/endpoints/gpu.api';
import { ramApi } from '@/api/endpoints/ram.api';
import { placaBaseApi } from '@/api/endpoints/placa-base.api';
import { psuApi } from '@/api/endpoints/psu.api';
import { refrigeracionApi } from '@/api/endpoints/refrigeracion.api';
import { cajaApi } from '@/api/endpoints/caja.api';
import { almacenamientoApi } from '@/api/endpoints/almacenamiento.api';
import type { MontajeResponseDto, MontajeEnrichedDto } from '@/dto';


export function useEnrichedMontajes(montajes: MontajeResponseDto[]) {
  
  const uniqueIds = useMemo(() => {
    const cpuIds = new Set<number>();
    const gpuIds = new Set<number>();
    const ramIds = new Set<number>();
    const placaBaseIds = new Set<number>();
    const psuIds = new Set<number>();
    const refrigeracionIds = new Set<number>();
    const cajaIds = new Set<number>();
    const almacenamientoIds = new Set<number>();

    for (const m of montajes) {
      if (m.cpuId) cpuIds.add(m.cpuId);
      if (m.gpuId) gpuIds.add(m.gpuId);
      if (m.ramId) ramIds.add(m.ramId);
      if (m.placaBaseId) placaBaseIds.add(m.placaBaseId);
      if (m.psuId) psuIds.add(m.psuId);
      if (m.refrigeracionId) refrigeracionIds.add(m.refrigeracionId);
      if (m.cajaId) cajaIds.add(m.cajaId);
      if (m.almacenamientoId) almacenamientoIds.add(m.almacenamientoId);
    }

    return {
      cpuIds: [...cpuIds],
      gpuIds: [...gpuIds],
      ramIds: [...ramIds],
      placaBaseIds: [...placaBaseIds],
      psuIds: [...psuIds],
      refrigeracionIds: [...refrigeracionIds],
      cajaIds: [...cajaIds],
      almacenamientoIds: [...almacenamientoIds],
    };
  }, [montajes]);

  
  const cpuQueries = useQueries({
    queries: uniqueIds.cpuIds.map((id) => ({
      queryKey: ['cpus', 'detail', id] as const,
      queryFn: () => cpuApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const gpuQueries = useQueries({
    queries: uniqueIds.gpuIds.map((id) => ({
      queryKey: ['gpus', 'detail', id] as const,
      queryFn: () => gpuApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const ramQueries = useQueries({
    queries: uniqueIds.ramIds.map((id) => ({
      queryKey: ['rams', 'detail', id] as const,
      queryFn: () => ramApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const placaBaseQueries = useQueries({
    queries: uniqueIds.placaBaseIds.map((id) => ({
      queryKey: ['placas-base', 'detail', id] as const,
      queryFn: () => placaBaseApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const psuQueries = useQueries({
    queries: uniqueIds.psuIds.map((id) => ({
      queryKey: ['psus', 'detail', id] as const,
      queryFn: () => psuApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const refrigeracionQueries = useQueries({
    queries: uniqueIds.refrigeracionIds.map((id) => ({
      queryKey: ['refrigeraciones', 'detail', id] as const,
      queryFn: () => refrigeracionApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const cajaQueries = useQueries({
    queries: uniqueIds.cajaIds.map((id) => ({
      queryKey: ['cajas', 'detail', id] as const,
      queryFn: () => cajaApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const almacenamientoQueries = useQueries({
    queries: uniqueIds.almacenamientoIds.map((id) => ({
      queryKey: ['almacenamientos', 'detail', id] as const,
      queryFn: () => almacenamientoApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  
  const allQueries = [
    ...cpuQueries,
    ...gpuQueries,
    ...ramQueries,
    ...placaBaseQueries,
    ...psuQueries,
    ...refrigeracionQueries,
    ...cajaQueries,
    ...almacenamientoQueries,
  ];

  const isLoading = allQueries.some((q) => q.isLoading);

  
  const enriched: MontajeEnrichedDto[] = useMemo(() => {
    const cpuMap = new Map(
      cpuQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const gpuMap = new Map(
      gpuQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const ramMap = new Map(
      ramQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const placaBaseMap = new Map(
      placaBaseQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const psuMap = new Map(
      psuQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const refrigeracionMap = new Map(
      refrigeracionQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const cajaMap = new Map(
      cajaQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );
    const almacenamientoMap = new Map(
      almacenamientoQueries.filter((q) => q.data).map((q) => [q.data!.id, q.data!]),
    );

    return montajes.map((m) => ({
      ...m,
      cpu: cpuMap.get(m.cpuId),
      gpu: gpuMap.get(m.gpuId),
      ram: ramMap.get(m.ramId),
      placaBase: placaBaseMap.get(m.placaBaseId),
      psu: psuMap.get(m.psuId),
      refrigeracion: refrigeracionMap.get(m.refrigeracionId),
      caja: cajaMap.get(m.cajaId),
      almacenamiento: almacenamientoMap.get(m.almacenamientoId),
    }));
  }, [
    montajes,
    cpuQueries,
    gpuQueries,
    ramQueries,
    placaBaseQueries,
    psuQueries,
    refrigeracionQueries,
    cajaQueries,
    almacenamientoQueries,
  ]);

  return { enriched, isLoading };
}

