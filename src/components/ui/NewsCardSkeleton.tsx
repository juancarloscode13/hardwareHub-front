import { Skeleton } from '@/components/ui/skeleton';

export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-hw-card-border bg-hw-card aspect-16/10 hw-news-card">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
}
