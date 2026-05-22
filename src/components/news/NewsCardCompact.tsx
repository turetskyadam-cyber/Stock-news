import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSymbolDomain } from '../ui/CompanyBanner';
import { toRelativeTime } from '../../lib/utils';
import { analyzeSentiment } from '../../lib/sentiment';
import { FreshnessIndicator } from '../ui/FreshnessIndicator';
import { FaviconImage } from '../ui/FaviconImage';
import { BookmarkButton } from '../ui/BookmarkButton';
import { HighlightedText } from '../ui/HighlightedText';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

interface NewsCardCompactProps {
  item: FinnhubNewsItem;
  index: number;
  sector: SectorConfig;
  isSaved: boolean;
  onToggleSave: () => void;
  onStoryOpen: () => void;
  activeKeywords: string[];
}

const sentimentDot: Record<string, string> = {
  positive: 'bg-emerald-400',
  negative: 'bg-rose-400',
  neutral: 'bg-white/20',
};

export function NewsCardCompact({
  item,
  index,
  sector,
  isSaved,
  onToggleSave,
  onStoryOpen,
  activeKeywords,
}: NewsCardCompactProps) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const sentiment = analyzeSentiment(item.headline);
  const hasImage = Boolean(item.image) && !imageError;
  const symbolDomain = !hasImage ? getSymbolDomain(item.related) : null;

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ delay: Math.min(index * 0.025, 0.25), duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      layout
      className="group flex gap-3 rounded-xl border border-white/8 bg-white/4 p-3 transition-all duration-200 hover:border-white/16 hover:bg-white/7 dark:border-white/8 dark:bg-white/4 dark:hover:border-white/16 dark:hover:bg-white/7 border-black/6 bg-black/2 hover:border-black/12 hover:bg-black/4"
      style={{ borderLeftColor: sector.gradientFrom, borderLeftWidth: '2px' }}
    >
      {/* Thumbnail: Finnhub image or Clearbit company logo */}
      {hasImage ? (
        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : symbolDomain && !logoError ? (
        <div
          className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: `linear-gradient(135deg, ${sector.gradientFrom}50, ${sector.gradientTo}20)` }}
        >
          <img
            src={`https://logo.clearbit.com/${symbolDomain}`}
            alt=""
            className="h-9 w-9 rounded-lg object-contain"
            onError={() => setLogoError(true)}
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top row: source + indicators + time */}
        <div className="mb-1 flex items-center gap-1.5">
          <FaviconImage source={item.source} />
          <span className="text-[10px] text-white/40 dark:text-white/40 text-black/40 truncate max-w-[80px]">
            {item.source}
          </span>
          <span
            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${sentimentDot[sentiment.sentiment]}`}
            title={`Sentiment: ${sentiment.sentiment}`}
          />
          <FreshnessIndicator datetime={item.datetime} />
          <span className="ml-auto flex-shrink-0 text-[10px] text-white/30 dark:text-white/30 text-black/30 tabular-nums">
            {toRelativeTime(item.datetime)}
          </span>
        </div>

        {/* Headline */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs font-semibold leading-snug text-white/85 transition-colors hover:text-white dark:text-white/85 dark:hover:text-white text-gray-800 hover:text-gray-900 line-clamp-2"
        >
          <HighlightedText text={item.headline} keywords={activeKeywords} />
        </a>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => { e.preventDefault(); onStoryOpen(); }}
          title="Open in Story Mode"
          className="text-white/30 transition-colors hover:text-white/80 dark:text-white/30 dark:hover:text-white/80 text-black/30 hover:text-black/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <BookmarkButton
          isSaved={isSaved}
          onToggle={onToggleSave}
          className="text-white/30 transition-colors hover:text-amber-400 dark:text-white/30 text-black/30"
        />
      </div>
    </motion.div>
  );
}
