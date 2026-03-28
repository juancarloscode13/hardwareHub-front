import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EntityConfig } from './entityConfig';
import type { PageResponse } from '@/api/types';

/**
 * Hook genérico que encapsula useQuery + 3 useMutation para la entidad activa
 * del panel de administración.
 *
 * Las reglas de hooks exigen que SIEMPRE se llamen; el guard `enabled`
 * y los checks en mutationFn gestionan el caso en que `config` es null.
 */
export function useAdminEntity(config: EntityConfig | null) {
  const qc = useQueryClient();

  // ── Query ──────────────────────────────────────────────────────────────
  const query = useQuery<PageResponse<Record<string, unknown>>>({
    queryKey: ['admin', config?.key ?? '__none__'],
    queryFn: () => {
      if (!config) return Promise.reject(new Error('No entity selected'));
      return config.queryFn();
    },
    enabled: config !== null,
  });

  // ── Mutations ──────────────────────────────────────────────────────────
  const create = useMutation<Record<string, unknown>, Error, Record<string, unknown>>({
    mutationFn: (data) => {
      if (!config) return Promise.reject(new Error('No entity selected'));
      return config.createFn(data);
    },
    onSuccess: () => {
      if (config) void qc.invalidateQueries({ queryKey: ['admin', config.key] });
    },
  });

  const update = useMutation<
    Record<string, unknown>,
    Error,
    { id: number; data: Record<string, unknown> }
  >({
    mutationFn: ({ id, data }) => {
      if (!config) return Promise.reject(new Error('No entity selected'));
      return config.updateFn(id, data);
    },
    onSuccess: () => {
      if (config) void qc.invalidateQueries({ queryKey: ['admin', config.key] });
    },
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: (id) => {
      if (!config) return Promise.reject(new Error('No entity selected'));
      return config.deleteFn(id);
    },
    onSuccess: () => {
      if (config) void qc.invalidateQueries({ queryKey: ['admin', config.key] });
    },
  });

  return {
    data:      query.data,
    isLoading: query.isLoading,
    create,
    update,
    remove,
  };
}

