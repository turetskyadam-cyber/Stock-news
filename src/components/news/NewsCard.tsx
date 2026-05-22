import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { toRelativeTime } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { FaviconImage } from '../ui/FaviconImage';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

interface NewsCardProps {
  item: FinnhubNewsItem;
  index: number;
  sector: SectorConfig;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: Math.min(i * 0.05, 0.4),
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' } },
};

const accentColors: Record<string, string> = {
  blue: 'rgba(59,130,246,0.12)',
  amber: 'rgba(245,158,11,0.12)',
  emerald: 'rgba(16,185,129,0.12)',
  violet: 'rgba(139,92,246,0.12)',
  rose: 'rgba(244,63,94,0.12)',
  orange: 'rgba(249,115,22,0.12)',
  yellow: 'rgba(234,179,8,0.12)',
  slate: 'rgba(100,116,139,0.12)',
};

export function NewsCard({ item, index, sector }: NewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [imageError, setImageError] = useState(false);

  // Cursor-following spotlight background
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color, rgba(255,255,255,0.07)), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const hasImage = item.image && !imageError;
  const relativeTime = toRelativeTime(item.datetime);

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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 border-black/8 bg-black/3 hover:border-black/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
    >
      {/* Cursor spotlight overlay */}
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      {/* Sector-color hover tint */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: accentColors[sector.color] ?? 'transparent' }}
        aria-hidden
      />

      {/* Image */}
      {hasImage ? (
        <div className="relative overflow-hidden pb-[52%]">
          <motion.img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
          {/* Gradient fade-to-card-bg */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent dark:from-[#0a0a0f]/80 from-white/80" />
        </div>
      ) : (
        <div
          className="flex items-center justify-center pb-[30%]"
          style={{
            background: `linear-gradient(135deg, ${sector.gradientFrom}, ${sector.gradientTo})`,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
            {sector.icon}
          </span>
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
          <Badge variant="time" className="ml-auto">
            {relativeTime}
          </Badge>
        </div>

        {/* Headline */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link block"
          aria-label={item.headline}
        >
          <h3 className="mb-2 line-clamp-3 text-sm font-semibold leading-snug text-white/90 transition-colors duration-150 group-hover/link:text-white dark:text-white/90 dark:group-hover/link:text-white text-gray-900/90 group-hover/link:text-gray-900">
            {item.headline}
          </h3>
        </a>

        {/* Summary */}
        {item.summary && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/45 dark:text-white/45 text-black/45">
            {item.summary}
          </p>
        )}

        {/* Source row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FaviconImage source={item.source} />
            <span className="text-[11px] font-medium text-white/40 dark:text-white/40 text-black/40">
              {item.source}
            </span>
          </div>

          {/* External link — appears on hover */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read full article from ${item.source}`}
            className="flex items-center gap-1 text-[11px] text-white/30 opacity-0 transition-all duration-200 hover:text-white/80 group-hover:opacity-100 dark:text-white/30 dark:hover:text-white/80 text-black/30 hover:text-black/70"
          >
            Read
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
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
