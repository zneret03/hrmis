import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
