import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function TeamSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:py-10"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading team…
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-19 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-3 lg:order-first">
            <Skeleton className="h-9 w-56" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
          <Skeleton className="order-first h-65 rounded-xl lg:order-last" />
        </div>
      </div>
    </main>
  );
}
