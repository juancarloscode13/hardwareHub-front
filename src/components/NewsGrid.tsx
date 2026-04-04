import type { NoticiaResponseDto } from '@/dto';
import NewsCard from '@/components/NewsCard';
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton';

interface NewsGridProps {
  newsList: NoticiaResponseDto[];
}

export default function NewsGrid({ newsList }: NewsGridProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {newsList.map((item) => (
        <NewsCard key={item.url} news={item} />
      ))}
    </div>
  );
}

/** Grid de skeletons para el estado de carga */
export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
