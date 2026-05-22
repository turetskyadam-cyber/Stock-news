import { AnimatePresence, motion } from 'framer-motion';
import type { FetchStatus, FinnhubNewsItem, SectorConfig } from '../../types/news';
import { NewsCard } from './NewsCard';
import { LoadingGrid } from '../states/LoadingGrid';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';

interface NewsGridProps {
  items: FinnhubNewsItem[];
  status: FetchStatus;
  error: string | null;
  sector: SectorConfig;
  onRetry: () => void;
}

export function NewsGrid({ items, status, error, sector, onRetry }: NewsGridProps) {
  if (status === 'loading' && items.length === 0) {
    return <LoadingGrid />;
  }

  if (status === 'error' && items.length === 0) {
    return <ErrorState error={error ?? 'Unknown error'} onRetry={onRetry} />;
  }

  if (status === 'success' && items.length === 0) {
    return <EmptyState sector={sector} />;
  }

  return (
    <motion.div
      key={sector.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Refreshing indicator (stale-while-revalidate) */}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} sector={sector} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
