export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/5 dark:border-white/8 dark:bg-white/5 border-black/6 bg-black/3">
      {/* Image placeholder */}
      <div className="relative overflow-hidden bg-white/8 dark:bg-white/8 bg-black/5 pb-[52%]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/10 via-black/5" />
      </div>

      <div className="space-y-3 p-4">
        {/* Badge row */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded-full bg-white/10 dark:bg-white/10 bg-black/8" />
          <div className="h-4 w-16 rounded-full bg-white/8 dark:bg-white/8 bg-black/5" />
          <div className="ml-auto h-3 w-10 rounded-full bg-white/6 dark:bg-white/6 bg-black/4" />
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-white/10 dark:bg-white/10 bg-black/8" />
          <div className="h-3.5 w-5/6 rounded bg-white/10 dark:bg-white/10 bg-black/8" />
          <div className="h-3.5 w-3/4 rounded bg-white/8 dark:bg-white/8 bg-black/5" />
        </div>

        {/* Summary */}
        <div className="space-y-1">
          <div className="h-2.5 w-full rounded bg-white/6 dark:bg-white/6 bg-black/4" />
          <div className="h-2.5 w-4/5 rounded bg-white/6 dark:bg-white/6 bg-black/4" />
        </div>

        {/* Source row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-4 w-4 rounded-sm bg-white/10 dark:bg-white/10 bg-black/8" />
          <div className="h-3 w-20 rounded bg-white/8 dark:bg-white/8 bg-black/5" />
        </div>
      </div>
    </div>
  );
}
