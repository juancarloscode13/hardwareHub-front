import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fabricanteApi } from '@/api/endpoints/fabricante.api';
import type { FabricanteRequestDto } from '@/dto';
import { FABRICANTE_KEYS } from './useFabricante';

export function useCreateFabricante() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FabricanteRequestDto) => fabricanteApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: FABRICANTE_KEYS.all }),
  });
}

export function useUpdateFabricante() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FabricanteRequestDto }) =>
      fabricanteApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: FABRICANTE_KEYS.all });
      void qc.invalidateQueries({ queryKey: FABRICANTE_KEYS.detail(id) });
    },
  });
}

export function useDeleteFabricante() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fabricanteApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FABRICANTE_KEYS.all }),
  });
}

