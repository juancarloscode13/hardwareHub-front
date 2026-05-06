// Mutaciones de React Query para crear, actualizar y eliminar montajes
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { montajeApi } from '@/api/endpoints/montaje.api';
import type { MontajeRequestDto } from '@/dto';
import { MONTAJE_KEYS } from './useMontaje';

/** Crea un nuevo montaje e invalida la lista de montajes */
export function useCreateMontaje() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MontajeRequestDto) => montajeApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTAJE_KEYS.all }),
  });
}

/** Actualiza un montaje existente e invalida su detalle y la lista */
export function useUpdateMontaje() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MontajeRequestDto }) =>
      montajeApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void qc.invalidateQueries({ queryKey: MONTAJE_KEYS.all });
      void qc.invalidateQueries({ queryKey: MONTAJE_KEYS.detail(id) });
    },
  });
}

/** Elimina un montaje e invalida la lista */
export function useDeleteMontaje() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => montajeApi.deleteById(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTAJE_KEYS.all }),
  });
}
