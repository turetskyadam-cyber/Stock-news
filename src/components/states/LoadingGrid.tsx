import { NewsCardSkeleton } from '../news/NewsCardSkeleton';

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }, (_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
