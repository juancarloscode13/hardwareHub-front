// Mutaciones de React Query para subir, eliminar y obtener URLs de media en Cloudinary
import { useMemo } from 'react';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { cloudinaryApi } from '@/api/endpoints/cloudinary.api';

export const CLOUDINARY_KEYS = {
  all: ['cloudinary'] as const,
  mediaUrl: (publicId: string) => [...CLOUDINARY_KEYS.all, 'url', publicId] as const,
};

const CLOUDINARY_URL_STALE_TIME = 1000 * 60 * 30;

function normalizePublicId(publicId: string | null | undefined): string {
  return publicId?.trim() ?? '';
}

function uniquePublicIds(publicIds: Array<string | null | undefined>): string[] {
  return [...new Set(publicIds.map(normalizePublicId).filter(Boolean))];
}

export function useUploadCloudinaryImage() {
  return useMutation({
    mutationFn: cloudinaryApi.uploadImage,
  });
}

export function useUploadCloudinaryVideo() {
  return useMutation({
    mutationFn: cloudinaryApi.uploadVideo,
  });
}

export function useDeleteCloudinaryMedia() {
  return useMutation({
    mutationFn: cloudinaryApi.deleteMedia,
  });
}

export function useCloudinaryMediaUrl(publicId: string | null | undefined) {
  const normalizedPublicId = normalizePublicId(publicId);

  return useQuery({
    queryKey: CLOUDINARY_KEYS.mediaUrl(normalizedPublicId),
    queryFn: () => cloudinaryApi.getMediaUrl({ publicId: normalizedPublicId }),
    enabled: normalizedPublicId.length > 0,
    staleTime: CLOUDINARY_URL_STALE_TIME,
  });
}

export function useCloudinaryMediaUrls(publicIds: Array<string | null | undefined>) {
  const ids = useMemo(() => uniquePublicIds(publicIds), [publicIds]);

  const queries = useQueries({
    queries: ids.map((publicId) => ({
      queryKey: CLOUDINARY_KEYS.mediaUrl(publicId),
      queryFn: () => cloudinaryApi.getMediaUrl({ publicId }),
      staleTime: CLOUDINARY_URL_STALE_TIME,
    })),
  });

  const data = useMemo(() => {
    const urlMap: Record<string, string> = {};
    ids.forEach((id, index) => {
      const url = queries[index]?.data;
      if (url) {
        urlMap[id] = url;
      }
    });
    return urlMap;
  }, [ids, queries]);

  return {
    data,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
  };
}


