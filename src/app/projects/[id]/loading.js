import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailLoading() {
  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10 pb-8 border-b border-border/10">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded bg-black/5" />
            <Skeleton className="h-6 w-24 rounded bg-black/5" />
          </div>
          <Skeleton className="h-12 w-3/4 rounded-xl bg-black/5" />
          <div className="flex items-center gap-3 mt-4">
            <Skeleton className="h-8 w-8 rounded-full bg-black/5" />
            <Skeleton className="h-5 w-32 rounded bg-black/5" />
          </div>
        </div>
        <Skeleton className="h-12 w-32 rounded-xl bg-black/5 md:self-end" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] p-8 border border-border/10">
            <Skeleton className="h-8 w-40 rounded mb-6 bg-black/5" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded bg-black/5" />
              <Skeleton className="h-4 w-[90%] rounded bg-black/5" />
              <Skeleton className="h-4 w-[95%] rounded bg-black/5" />
              <Skeleton className="h-4 w-[80%] rounded bg-black/5" />
              <Skeleton className="h-4 w-[85%] rounded bg-black/5" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-border/10 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-black/5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 rounded bg-black/5" />
                <Skeleton className="h-5 w-24 rounded bg-black/5" />
              </div>
            </div>
            <div className="h-[1px] w-full bg-black/5" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-black/5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 rounded bg-black/5" />
                <Skeleton className="h-5 w-32 rounded bg-black/5" />
              </div>
            </div>
            <div className="h-[1px] w-full bg-black/5" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-black/5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 rounded bg-black/5" />
                <Skeleton className="h-5 w-20 rounded bg-black/5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-border/10">
            <Skeleton className="h-6 w-32 rounded mb-6 bg-black/5" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded bg-black/5" />
              <Skeleton className="h-8 w-24 rounded bg-black/5" />
              <Skeleton className="h-8 w-16 rounded bg-black/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
