import type { NoticiaResponseDto } from '@/dto';
import NewsCard from '@/components/ui/NewsCard';
import { NewsCardSkeleton } from '@/components/ui/NewsCardSkeleton';

interface NewsGridProps {
  newsList: NoticiaResponseDto[];
}

export default function NewsGrid({ newsList }: NewsGridProps) {
  return (
    <div
      className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      style={{ columnGap: 8, rowGap: 8 }}
    >
      {newsList.map((item) => (
        <div key={item.url} style={{ padding: 10 }}>
          <NewsCard news={item} />
        </div>
      ))}
    </div>
  );
}

/** Grid de skeletons para el estado de carga */
export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      style={{ columnGap: 8, rowGap: 8 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ padding: 10 }}>
          <NewsCardSkeleton />
        </div>
      ))}
    </div>
  );
}
