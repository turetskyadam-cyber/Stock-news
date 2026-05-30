import { useState } from 'react';
import { motion } from 'framer-motion';
import { toRelativeTime } from '../../lib/utils';
import { FaviconImage } from '../ui/FaviconImage';
import { AdamsOverview } from '../editorial/AdamsOverview';
import { LoadingGrid } from '../states/LoadingGrid';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';
import type { FetchStatus, FinnhubNewsItem, SectorConfig } from '../../types/news';

interface CuratedFeedProps {
  items: FinnhubNewsItem[];
  status: FetchStatus;
  error: string | null;
  sector: SectorConfig;
  onStoryOpen: (index: number) => void;
  onRetry: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

function Meta({ item }: { item: FinnhubNewsItem }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 dark:text-white/45 text-black/45">
      <FaviconImage source={item.source} />
      <span className="truncate">{item.source}</span>
      <span className="opacity-40">·</span>
      <span className="whitespace-nowrap opacity-80">{toRelativeTime(item.datetime)}</span>
    </div>
  );
}

function LeadStory({
  item,
  sector,
}: {
  item: FinnhubNewsItem;
  sector: SectorConfig;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(item.image) && !imgError;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="group relative col-span-full block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] dark:border-white/10 dark:bg-white/[0.03] border-black/[0.07] bg-black/[0.02]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
        {hasImage ? (
          <img
            src={item.image}
            alt=""
            loading="eager"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(120% 120% at 20% 0%, ${sector.gradientFrom}, ${sector.gradientTo} 60%, transparent)`,
            }}
          />
        )}
        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            Lead Story
          </span>
          <Meta item={item} />
        </div>
        <h2 className="font-display text-balance max-w-3xl text-2xl font-medium leading-[1.12] text-white sm:text-3xl md:text-[2.6rem]">
          {item.headline}
        </h2>
        {item.summary && (
          <p className="mt-3 max-w-2xl text-balance text-sm leading-relaxed text-white/65 line-clamp-2 sm:text-[15px]">
            {item.summary}
          </p>
        )}
      </div>
    </motion.a>
  );
}

function SelectionCard({
  item,
  rank,
  index,
}: {
  item: FinnhubNewsItem;
  rank: number;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(item.image) && !imgError;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative flex gap-4 rounded-2xl border border-transparent p-3 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.03] hover:border-black/[0.06] hover:bg-black/[0.02]"
    >
      {/* Rank number */}
      <span className="font-display mt-1 w-7 flex-shrink-0 text-lg font-medium tabular-nums text-white/25 dark:text-white/25 text-black/25">
        {String(rank).padStart(2, '0')}
      </span>

      {/* Thumbnail */}
      <div className="relative h-[68px] w-[92px] flex-shrink-0 overflow-hidden rounded-xl bg-white/5 dark:bg-white/5 bg-black/5 sm:h-[80px] sm:w-[112px]">
        {hasImage ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl opacity-40">📰</div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <Meta item={item} />
        <h3 className="font-display mt-1.5 text-balance text-[15px] font-medium leading-snug text-white/90 line-clamp-3 transition-colors group-hover:text-white sm:text-base">
          {item.headline}
        </h3>
      </div>
    </motion.a>
  );
}

export function CuratedFeed({
  items,
  status,
  error,
  sector,
  onStoryOpen,
  onRetry,
}: CuratedFeedProps) {
  if (status === 'loading' && items.length === 0) return <LoadingGrid />;
  if (status === 'error' && items.length === 0)
    return <ErrorState error={error ?? 'Unknown error'} onRetry={onRetry} />;
  if (status === 'success' && items.length === 0) return <EmptyState sector={sector} />;

  const [lead, ...rest] = items;

  return (
    <motion.section
      key={sector.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Adam's editorial overview + 90-day forecast */}
      <AdamsOverview items={items} sector={sector} />

      {/* Section eyebrow */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35 dark:text-white/35 text-black/35">
            The Selection
          </p>
          <h2 className="font-display mt-0.5 text-xl font-medium text-white/90 dark:text-white/90 text-gray-900">
            {sector.label}
          </h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => onStoryOpen(0)}
            className="group flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/65 transition-all hover:border-white/25 hover:text-white dark:border-white/12 dark:bg-white/[0.04] dark:text-white/65 border-black/10 bg-black/[0.03] text-black/55 hover:border-black/20 hover:text-black/80"
            title="Read one by one"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Read
          </button>
        )}
      </div>

      {lead && (
        <div className="mb-8 grid grid-cols-1">
          <LeadStory item={lead} sector={sector} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
        {rest.map((item, i) => (
          <SelectionCard key={item.id} item={item} rank={i + 2} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
