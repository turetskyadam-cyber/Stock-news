import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { toRelativeTime } from '../../lib/utils';
import { analyzeSentiment } from '../../lib/sentiment';
import { getFreshness, FreshnessIndicator, FreshnessGlowBar } from '../ui/FreshnessIndicator';
import { Badge } from '../ui/Badge';
import { FaviconImage } from '../ui/FaviconImage';
import { BookmarkButton } from '../ui/BookmarkButton';
import { HighlightedText } from '../ui/HighlightedText';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

export interface NewsCardProps {
  item: FinnhubNewsItem;
  index: number;
  sector: SectorConfig;
  isSaved: boolean;
  onToggleSave: () => void;
  onStoryOpen: () => void;
  activeKeywords: string[];
  featured?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: Math.min(i * 0.04, 0.35),
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1] as number[],
    },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' as const } },
};

const sentimentColors = {
  positive: { border: 'rgba(16,185,129,0.55)', glow: 'rgba(16,185,129,0.08)' },
  negative: { border: 'rgba(244,63,94,0.55)', glow: 'rgba(244,63,94,0.08)' },
  neutral: { border: 'transparent', glow: 'transparent' },
};

const accentHover: Record<string, string> = {
  blue: 'rgba(59,130,246,0.10)',
  amber: 'rgba(245,158,11,0.10)',
  emerald: 'rgba(16,185,129,0.10)',
  violet: 'rgba(139,92,246,0.10)',
  rose: 'rgba(244,63,94,0.10)',
  orange: 'rgba(249,115,22,0.10)',
  yellow: 'rgba(234,179,8,0.10)',
  slate: 'rgba(100,116,139,0.10)',
};

export function NewsCard({
  item,
  index,
  sector,
  isSaved,
  onToggleSave,
  onStoryOpen,
  activeKeywords,
  featured = false,
}: NewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [imageError, setImageError] = useState(false);

  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color, rgba(255,255,255,0.07)), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const sentiment = analyzeSentiment(item.headline);
  const { level: freshnessLevel } = getFreshness(item.datetime);
  const sc = sentimentColors[sentiment.sentiment];
  const hasImage = Boolean(item.image) && !imageError;

  const imagePb = featured ? 'pb-[60%]' : 'pb-[52%]';

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 border-black/8 bg-black/3 hover:border-black/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      style={{ borderLeftColor: sc.border, borderLeftWidth: '2px' }}
    >
      {/* Freshness glow bar */}
      <FreshnessGlowBar
        datetime={item.datetime}
        gradientFrom={sector.gradientFrom}
        gradientTo={sector.gradientTo}
      />

      {/* Cursor spotlight */}
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      {/* Sector-color hover tint */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: accentHover[sector.color] ?? 'transparent' }}
        aria-hidden
      />

      {/* Sentiment glow tint */}
      {sentiment.sentiment !== 'neutral' && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: sc.glow }}
          aria-hidden
        />
      )}

      {/* Image — only render when we have one; no placeholder */}
      {hasImage && (
        <div className={`relative overflow-hidden ${imagePb}`}>
          <motion.img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent dark:from-[#0a0a0f]/80 from-[#f8f8fc]/80" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 p-4">
        {/* Meta row */}
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="source">{item.source}</Badge>
          {item.category && item.category !== item.source.toLowerCase() && (
            <Badge variant="category">{item.category}</Badge>
          )}
          {freshnessLevel !== 'normal' && (
            <FreshnessIndicator datetime={item.datetime} />
          )}
          <Badge variant="time" className="ml-auto">
            {toRelativeTime(item.datetime)}
          </Badge>
        </div>

        {/* Headline with optional keyword highlighting */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link block"
        >
          <h3
            className={`mb-2 leading-snug text-white/90 transition-colors duration-150 group-hover/link:text-white dark:text-white/90 dark:group-hover/link:text-white text-gray-900/90 group-hover/link:text-gray-900 ${
              featured ? 'line-clamp-4 text-base font-bold' : 'line-clamp-3 text-sm font-semibold'
            }`}
          >
            <HighlightedText text={item.headline} keywords={activeKeywords} />
          </h3>
        </a>

        {/* Summary */}
        {item.summary && (
          <p className={`mb-3 leading-relaxed text-white/45 dark:text-white/45 text-black/45 ${featured ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs'}`}>
            {item.summary}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center gap-2">
          <FaviconImage source={item.source} />
          <span className="text-[11px] font-medium text-white/40 dark:text-white/40 text-black/40 truncate">
            {item.source}
          </span>

          {/* Story mode trigger */}
          <button
            onClick={(e) => { e.preventDefault(); onStoryOpen(); }}
            title="Read in Story Mode"
            className="ml-auto flex items-center gap-1 text-[11px] text-white/25 opacity-0 transition-all duration-200 hover:text-white/70 group-hover:opacity-100 dark:text-white/25 dark:hover:text-white/70 text-black/25 hover:text-black/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          {/* Bookmark */}
          <BookmarkButton
            isSaved={isSaved}
            onToggle={onToggleSave}
            className="flex h-6 w-6 items-center justify-center text-white/30 opacity-0 transition-all duration-200 hover:text-amber-400 group-hover:opacity-100 dark:text-white/30 text-black/30"
          />

          {/* External link */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read full article from ${item.source}`}
            className="flex items-center gap-1 text-[11px] text-white/25 opacity-0 transition-all duration-200 hover:text-white/80 group-hover:opacity-100 dark:text-white/25 dark:hover:text-white/80 text-black/25 hover:text-black/70"
          >
            Read
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
