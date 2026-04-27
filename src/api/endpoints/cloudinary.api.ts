import { api } from '../axios';
import type {
  CloudinaryDeleteResponseDto,
  CloudinaryPublicIdRequestDto,
  CloudinaryUploadRequestDto,
  CloudinaryUploadResponseDto,
  CloudinaryUrlResponseDto,
} from '@/dto';

const BASE = '/api/cloudinary';

function buildFormData({ file }: CloudinaryUploadRequestDto) {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const cloudinaryApi = {
  uploadImage: ({ file }: CloudinaryUploadRequestDto) =>
    api
      .patch<CloudinaryUploadResponseDto>(`${BASE}/images`, buildFormData({ file }), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => data),

  uploadVideo: ({ file }: CloudinaryUploadRequestDto) =>
    api
      .patch<CloudinaryUploadResponseDto>(`${BASE}/videos`, buildFormData({ file }), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => data),

  deleteMedia: ({ publicId }: CloudinaryPublicIdRequestDto) =>
    api
      .patch<CloudinaryDeleteResponseDto>(`${BASE}/delete`, null, {
        params: { publicId },
      })
      .then(({ data }) => data),

  getMediaUrl: ({ publicId }: CloudinaryPublicIdRequestDto) =>
    api
      .get<CloudinaryUrlResponseDto>(`${BASE}/url`, {
        params: { publicId },
      })
      .then(({ data }) => data),
};

