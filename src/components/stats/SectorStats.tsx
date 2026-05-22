import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { analyzeMultiple } from '../../lib/sentiment';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

interface SectorStatsProps {
  items: FinnhubNewsItem[];
  sector: SectorConfig;
  onStoryMode: () => void;
}

function HourlyChart({ items, sector }: { items: FinnhubNewsItem[]; sector: SectorConfig }) {
  const now = new Date();
  const currentHour = now.getHours();

  const hourCounts = useMemo(() => {
    return Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: items.filter((item) => new Date(item.datetime * 1000).getHours() === h).length,
    }));
  }, [items]);

  const maxCount = Math.max(...hourCounts.map((h) => h.count), 1);

  return (
    <div className="flex items-end gap-[2px]" style={{ height: 28 }} aria-label="Hourly news distribution">
      {hourCounts.map(({ hour, count }) => {
        const pct = count === 0 ? 4 : Math.max(12, (count / maxCount) * 100);
        const isCurrent = hour === currentHour;
        const isPast = hour < currentHour;
        const opacity = count === 0 ? 0.12 : isPast ? 0.45 : isCurrent ? 1 : 0.3;

        return (
          <motion.div
            key={hour}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: hour * 0.015, type: 'spring', stiffness: 400, damping: 24 }}
            style={{
              height: `${pct}%`,
              width: 5,
              flexShrink: 0,
              backgroundColor: sector.gradientFrom,
              opacity,
              borderRadius: '1px 1px 0 0',
              transformOrigin: 'bottom',
              boxShadow: isCurrent && count > 0 ? `0 0 6px ${sector.gradientFrom}` : undefined,
            }}
            title={`${hour}:00 — ${count} article${count !== 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}

export function SectorStats({ items, sector, onStoryMode }: SectorStatsProps) {
  const uniqueSources = useMemo(
    () => new Set(items.map((i) => i.source)).size,
    [items]
  );

  const sentiment = useMemo(
    () => analyzeMultiple(items.map((i) => i.headline)),
    [items]
  );

  const newestItem = items[0];
  const newestMinutesAgo = newestItem
    ? Math.round((Date.now() / 1000 - newestItem.datetime) / 60)
    : null;

  const sentimentConfig = {
    positive: { label: 'Positive', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    negative: { label: 'Negative', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
    neutral:  { label: 'Neutral',  color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  };
  const sc = sentimentConfig[sentiment.sentiment];

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mb-5 flex flex-wrap items-center gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur-sm dark:border-white/8 dark:bg-white/4 border-black/6 bg-black/3"
    >
      {/* Article count */}
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 dark:text-white/30 text-black/30">
          Articles
        </span>
        <span className="text-sm font-bold text-white/80 dark:text-white/80 text-gray-800 tabular-nums">
          {items.length}
        </span>
      </div>

      <div className="h-7 w-px bg-white/10 dark:bg-white/10 bg-black/10" />

      {/* Unique sources */}
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 dark:text-white/30 text-black/30">
          Sources
        </span>
        <span className="text-sm font-bold text-white/80 dark:text-white/80 text-gray-800 tabular-nums">
          {uniqueSources}
        </span>
      </div>

      <div className="h-7 w-px bg-white/10 dark:bg-white/10 bg-black/10" />

      {/* Freshest */}
      {newestMinutesAgo !== null && (
        <>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 dark:text-white/30 text-black/30">
              Freshest
            </span>
            <span className="text-sm font-bold text-white/80 dark:text-white/80 text-gray-800 tabular-nums">
              {newestMinutesAgo < 60
                ? `${newestMinutesAgo}m ago`
                : `${Math.round(newestMinutesAgo / 60)}h ago`}
            </span>
          </div>
          <div className="h-7 w-px bg-white/10 dark:bg-white/10 bg-black/10" />
        </>
      )}

      {/* Sentiment */}
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 dark:text-white/30 text-black/30">
          Sentiment
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: sc.color, boxShadow: `0 0 6px ${sc.color}` }}
          />
          <span className="text-sm font-bold" style={{ color: sc.color }}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Sentiment bar */}
      <div className="hidden items-center gap-1 sm:flex">
        <span className="text-[9px] text-red-400/60">–</span>
        <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/10 dark:bg-white/10 bg-black/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${((sentiment.normalized + 1) / 2) * 100}%`,
              background: `linear-gradient(90deg, #f43f5e, #94a3b8, #10b981)`,
            }}
          />
          {/* Indicator */}
          <div
            className="absolute top-0 h-full w-0.5 bg-white/80 dark:bg-white/80 bg-gray-900/80 transition-all duration-700"
            style={{ left: `calc(${((sentiment.normalized + 1) / 2) * 100}% - 1px)` }}
          />
        </div>
        <span className="text-[9px] text-emerald-400/60">+</span>
      </div>

      <div className="h-7 w-px hidden bg-white/10 dark:bg-white/10 bg-black/10 sm:block" />

      {/* Hourly chart */}
      <div className="hidden flex-col gap-1 sm:flex">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30 dark:text-white/30 text-black/30">
          Today's Activity
        </span>
        <HourlyChart items={items} sector={sector} />
      </div>

      {/* Story mode button */}
      <button
        onClick={onStoryMode}
        className="ml-auto flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/12 hover:text-white dark:border-white/15 dark:bg-white/8 dark:text-white/70 dark:hover:border-white/25 dark:hover:bg-white/12 dark:hover:text-white border-black/12 bg-black/5 text-black/60 hover:border-black/20 hover:bg-black/8 hover:text-black/80"
        title="Read stories one by one (Space)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Story Mode
      </button>
    </motion.div>
  );
}
