import type { NoticiaResponseDto } from '@/dto';
import NewsCard from '@/components/ui/NewsCard';
import { NewsCardSkeleton } from '@/components/ui/NewsCardSkeleton';

interface NewsGridProps {
  newsList: NoticiaResponseDto[];
}

export default function NewsGrid({ newsList }: NewsGridProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 hw-news-grid">
      {newsList.map((item) => (
        <div key={item.url} className="hw-news-grid-item">
          <NewsCard news={item} />
        </div>
      ))}
    </div>
  );
}


export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 hw-news-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="hw-news-grid-item">
          <NewsCardSkeleton />
        </div>
      ))}
    </div>
  );
}
