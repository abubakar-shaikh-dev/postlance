import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-border/10">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64 rounded-xl bg-black/5" />
          <Skeleton className="h-5 w-80 rounded bg-black/5" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
          <Skeleton className="h-12 flex-1 rounded-xl bg-black/5" />
          <Skeleton className="h-12 w-full sm:w-28 rounded-xl bg-black/5" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-full flex flex-col justify-between p-8 rounded-[32px] bg-white border border-border/10">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-black/5" />
                    <Skeleton className="h-4 w-24 rounded bg-black/5" />
                  </div>
                  <Skeleton className="h-6 w-3/4 rounded bg-black/5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded bg-black/5" />
                <Skeleton className="h-4 w-5/6 rounded bg-black/5" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded bg-black/5" />
                <Skeleton className="h-6 w-20 rounded bg-black/5" />
                <Skeleton className="h-6 w-14 rounded bg-black/5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/10">
              <Skeleton className="h-5 w-20 rounded bg-black/5" />
              <Skeleton className="h-5 w-24 rounded bg-black/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
