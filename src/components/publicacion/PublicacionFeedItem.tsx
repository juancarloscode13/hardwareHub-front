import type { PublicacionResponseDto } from '@/dto';
import { useUsuario } from '@/features/usuario/hooks/useUsuario';
import { Skeleton } from '@/components/ui/skeleton';
import PublicacionCard from './PublicacionCard';

interface PublicacionFeedItemProps {
  publicacion: PublicacionResponseDto;
}

export default function PublicacionFeedItem({ publicacion }: PublicacionFeedItemProps) {
  const { data: autor, isLoading } = useUsuario(publicacion.usuarioId);

  if (isLoading) {
    return <Skeleton className="h-[180px] w-full rounded-2xl" />;
  }

  if (!autor) return null;

  return <PublicacionCard publicacion={publicacion} autor={autor} />;
}

