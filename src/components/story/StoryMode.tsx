import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { toRelativeTime } from '../../lib/utils';
import { FaviconImage } from '../ui/FaviconImage';
import { BookmarkButton } from '../ui/BookmarkButton';
import { getFreshness, FreshnessIndicator } from '../ui/FreshnessIndicator';
import { analyzeSentiment } from '../../lib/sentiment';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

const STORY_DURATION = 12; // seconds per story

interface StoryModeProps {
  items: FinnhubNewsItem[];
  initialIndex: number;
  sector: SectorConfig;
  onClose: () => void;
  isSaved: (id: number) => boolean;
  onToggleSave: (item: FinnhubNewsItem) => void;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.18, ease: 'easeIn' as const },
  }),
};

export function StoryMode({
  items,
  initialIndex,
  sector,
  onClose,
  isSaved,
  onToggleSave,
}: StoryModeProps) {
  const [[current, direction], setPage] = useState<[number, number]>([initialIndex, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const timerKey = useRef(0);

  const item = items[current];
  const sentiment = item ? analyzeSentiment(item.headline) : null;
  const freshness = item ? getFreshness(item.datetime) : null;

  const sentimentColors = {
    positive: { glow: 'rgba(16,185,129,0.3)', ring: '#10b981' },
    negative: { glow: 'rgba(244,63,94,0.3)', ring: '#f43f5e' },
    neutral:  { glow: 'transparent', ring: 'transparent' },
  };
  const sc = sentimentColors[sentiment?.sentiment ?? 'neutral'];

  const navigate = useCallback(
    (dir: number) => {
      setPage(([cur]) => {
        const next = cur + dir;
        if (next < 0 || next >= items.length) return [cur, 0];
        timerKey.current++;
        return [next, dir];
      });
    },
    [items.length]
  );

  const next = useCallback(() => navigate(1), [navigate]);
  const previous = useCallback(() => navigate(-1), [navigate]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const t = setTimeout(() => {
      if (current < items.length - 1) next();
      else onClose();
    }, STORY_DURATION * 1000);
    return () => clearTimeout(t);
  }, [current, isPaused, items.length, next, onClose]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') previous();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [next, previous, onClose]);

  // Drag-to-navigate
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.4, 1, 0.4]);

  if (!item) return null;

  const hasImage = Boolean(item.image);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-xl"
    >
      {/* Blurred background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            background: hasImage
              ? undefined
              : `radial-gradient(ellipse 120% 80% at 50% 50%, ${sector.gradientFrom}, ${sector.gradientTo})`,
          }}
        >
          {hasImage && (
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover opacity-35"
              style={{ filter: 'blur(24px)' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Progress bars */}
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-4 pt-safe pt-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            {i < current && (
              <div className="h-full w-full bg-white/70" />
            )}
            {i === current && (
              <motion.div
                key={`prog-${timerKey.current}-${current}`}
                className="h-full origin-left bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPaused ? undefined : 1 }}
                transition={{
                  duration: isPaused ? 0 : STORY_DURATION,
                  ease: 'linear',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Top controls */}
      <div className="absolute left-0 right-0 top-8 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sector.icon}</span>
          <span className="text-sm font-semibold text-white/80">{sector.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/50 tabular-nums">
            {current + 1} / {items.length}
          </span>
          {/* Pause/play */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            aria-label="Close story mode (Escape)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tap zones — invisible left/right half of screen */}
      <button
        onClick={previous}
        className="absolute inset-y-0 left-0 z-10 w-1/3"
        aria-label="Previous story"
      />
      <button
        onClick={next}
        className="absolute inset-y-0 right-0 z-10 w-1/3"
        aria-label="Next story"
      />

      {/* Article card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          style={{ x: dragX, opacity: dragOpacity }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) next();
            else if (info.offset.x > 60) previous();
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative z-20 mx-auto w-full max-w-md cursor-grab px-4 active:cursor-grabbing"
        >
          <div
            className="overflow-hidden rounded-3xl bg-[rgba(15,15,20,0.85)] shadow-2xl backdrop-blur-xl"
            style={{
              border: `1px solid ${sc.ring}30`,
              boxShadow:
                sentiment?.sentiment !== 'neutral'
                  ? `0 0 40px ${sc.glow}, 0 24px 60px rgba(0,0,0,0.6)`
                  : '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Image */}
            {hasImage && (
              <div className="relative overflow-hidden pb-[48%]">
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,15,20,0.9)] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-5">
              {/* Meta */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <FaviconImage source={item.source} />
                <span className="text-xs font-medium text-white/60">{item.source}</span>
                <span className="text-[10px] text-white/35">{toRelativeTime(item.datetime)}</span>
                {freshness && freshness.level !== 'normal' && (
                  <FreshnessIndicator datetime={item.datetime} />
                )}
                {sentiment && sentiment.sentiment !== 'neutral' && (
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ color: sc.ring, backgroundColor: sc.glow }}
                  >
                    {sentiment.sentiment === 'positive' ? '↑ Positive' : '↓ Negative'}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h2 className="mb-3 text-base font-bold leading-snug text-white">
                {item.headline}
              </h2>

              {/* Summary */}
              {item.summary && (
                <p className="mb-4 text-sm leading-relaxed text-white/55 line-clamp-4">
                  {item.summary}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/18 hover:text-white"
                >
                  Read Full Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <BookmarkButton
                  isSaved={isSaved(item.id)}
                  onToggle={() => onToggleSave(item)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Navigation hints */}
          <div className="mt-3 flex justify-between px-2 text-[10px] text-white/25">
            {current > 0 ? <span>← Prev</span> : <span />}
            {current < items.length - 1 ? <span>Next →</span> : <span>Last story</span>}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
