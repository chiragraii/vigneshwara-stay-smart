import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function RoomCardSkeleton({ list = false }: { list?: boolean }) {
  if (list) {
    return (
      <div className="flex gap-4 bg-card rounded-md border border-border overflow-hidden p-4">
        <Skeleton className="w-[280px] h-[200px] shrink-0 rounded-md" />
        <div className="flex-1 space-y-3 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md border border-border overflow-hidden shadow-card">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="flex justify-between items-end pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

export function RoomsGridSkeleton({ count = 9, list = false }: { count?: number; list?: boolean }) {
  return (
    <div className={cn(list ? 'space-y-4' : 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} list={list} />
      ))}
    </div>
  );
}
