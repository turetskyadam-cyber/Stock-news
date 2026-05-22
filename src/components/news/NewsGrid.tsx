import { AnimatePresence, motion } from 'framer-motion';
import type { FetchStatus, FinnhubNewsItem, SectorConfig } from '../../types/news';
import type { Layout } from '../ui/LayoutToggle';
import { NewsCard } from './NewsCard';
import { NewsCardCompact } from './NewsCardCompact';
import { LoadingGrid } from '../states/LoadingGrid';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';

interface NewsGridProps {
  items: FinnhubNewsItem[];
  status: FetchStatus;
  error: string | null;
  sector: SectorConfig;
  layout: Layout;
  activeKeywords: string[];
  isSaved: (id: number) => boolean;
  onToggleSave: (item: FinnhubNewsItem) => void;
  onStoryOpen: (index: number) => void;
  onRetry: () => void;
}

export function NewsGrid({
  items,
  status,
  error,
  sector,
  layout,
  activeKeywords,
  isSaved,
  onToggleSave,
  onStoryOpen,
  onRetry,
}: NewsGridProps) {
  if (status === 'loading' && items.length === 0) return <LoadingGrid />;
  if (status === 'error' && items.length === 0) return <ErrorState error={error ?? 'Unknown error'} onRetry={onRetry} />;
  if (status === 'success' && items.length === 0) return <EmptyState sector={sector} />;

  const gridClass =
    layout === 'grid'
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : layout === 'magazine'
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : 'flex flex-col gap-2';

  return (
    <motion.div
      key={`${sector.key}-${layout}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
    >
      {/* Background refetch indicator */}
      <AnimatePresence>
        {status === 'loading' && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 flex items-center gap-2 text-xs text-white/40 dark:text-white/40 text-black/40"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white/40 dark:bg-white/40 bg-black/30" />
            Refreshing…
          </motion.div>
        )}
      </AnimatePresence>

      <div className={gridClass}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const featured = layout === 'magazine' && i === 0;
            const colSpan = featured ? 'sm:col-span-2' : '';

            if (layout === 'list') {
              return (
                <NewsCardCompact
                  key={item.id}
                  item={item}
                  index={i}
                  sector={sector}
                  isSaved={isSaved(item.id)}
                  onToggleSave={() => onToggleSave(item)}
                  onStoryOpen={() => onStoryOpen(i)}
                  activeKeywords={activeKeywords}
                />
              );
            }

            return (
              <div key={item.id} className={colSpan}>
                <NewsCard
                  item={item}
                  index={i}
                  sector={sector}
                  isSaved={isSaved(item.id)}
                  onToggleSave={() => onToggleSave(item)}
                  onStoryOpen={() => onStoryOpen(i)}
                  activeKeywords={activeKeywords}
                  featured={featured}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
