// Endpoints para subir, eliminar y obtener URLs de medios en Cloudinary
import { api } from '../axios';
import type {
  CloudinaryDeleteResponseDto,
  CloudinaryPublicIdRequestDto,
  CloudinaryUploadRequestDto,
  CloudinaryUploadResponseDto,
  CloudinaryUrlResponseDto,
} from '@/dto';

const BASE = '/api/cloudinary';

// Construye el FormData necesario para enviar un archivo como multipart
function buildFormData({ file }: CloudinaryUploadRequestDto) {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const cloudinaryApi = {
  // Sube una imagen y devuelve su public_id en Cloudinary
  uploadImage: ({ file }: CloudinaryUploadRequestDto) =>
    api
      .patch<CloudinaryUploadResponseDto>(`${BASE}/images`, buildFormData({ file }), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => data),

  // Sube un vídeo y devuelve su public_id en Cloudinary
  uploadVideo: ({ file }: CloudinaryUploadRequestDto) =>
    api
      .patch<CloudinaryUploadResponseDto>(`${BASE}/videos`, buildFormData({ file }), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => data),

  // Elimina un recurso de Cloudinary por su public_id
  deleteMedia: ({ publicId }: CloudinaryPublicIdRequestDto) =>
    api
      .patch<CloudinaryDeleteResponseDto>(`${BASE}/delete`, null, {
        params: { publicId },
      })
      .then(({ data }) => data),

  // Obtiene la URL pública de un recurso a partir de su public_id
  getMediaUrl: ({ publicId }: CloudinaryPublicIdRequestDto) =>
    api
      .get<CloudinaryUrlResponseDto>(`${BASE}/url`, {
        params: { publicId },
      })
      .then(({ data }) => data),
};
