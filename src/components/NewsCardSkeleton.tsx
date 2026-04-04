import { Skeleton } from '@/components/ui/skeleton';

export function NewsCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl ring-1 ring-hw-card-border bg-hw-card"
      style={{ aspectRatio: '16 / 10' }}
    >
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
}
