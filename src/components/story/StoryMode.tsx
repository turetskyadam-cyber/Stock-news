import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { toRelativeTime } from '../../lib/utils';
import { FaviconImage } from '../ui/FaviconImage';
import { analyzeSentiment } from '../../lib/sentiment';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

const STORY_DURATION = 12;

interface StoryModeProps {
  items: FinnhubNewsItem[];
  initialIndex: number;
  sector: SectorConfig;
  onClose: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 18 : -18, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as number[] },
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -18 : 18,
    opacity: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.6, 1] as number[] },
  }),
};

const sentimentColors = {
  positive: { glow: 'rgba(16,185,129,0.28)', ring: '#10b981' },
  negative: { glow: 'rgba(244,63,94,0.28)', ring: '#f43f5e' },
  neutral:  { glow: 'transparent',           ring: 'rgba(255,255,255,0.15)' },
};

export function StoryMode({
  items,
  initialIndex,
  sector,
  onClose,
}: StoryModeProps) {
  const [[current, direction], setPage] = useState<[number, number]>([initialIndex, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const progressKey = useRef(0);

  const item = items[current];
  const sentiment = item ? analyzeSentiment(item.headline) : null;
  const sc = sentimentColors[sentiment?.sentiment ?? 'neutral'];
  const hasImage = Boolean(item?.image);

  const navigate = useCallback(
    (dir: number) => {
      setPage(([cur]) => {
        const next = cur + dir;
        if (next < 0 || next >= items.length) return [cur, 0];
        progressKey.current += 1;
        return [next, dir];
      });
    },
    [items.length]
  );

  const next     = useCallback(() => navigate(1),  [navigate]);
  const previous = useCallback(() => navigate(-1), [navigate]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    const t = setTimeout(() => {
      if (current < items.length - 1) next();
      else onClose();
    }, STORY_DURATION * 1000);
    return () => clearTimeout(t);
  }, [current, isPaused, items.length, next, onClose]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); previous(); }
      if (e.key === 'Escape')     onClose();
      if (e.key === ' ')          { e.preventDefault(); setIsPaused(p => !p); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [next, previous, onClose]);

  // Drag wrapper — separate from slide animation to avoid x-value conflict
  const dragX      = useMotionValue(0);
  const dragScale  = useTransform(dragX, [-150, 0, 150], [0.96, 1, 0.96]);
  const dragOpacity = useTransform(dragX, [-180, 0, 180], [0.5, 1, 0.5]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/92 backdrop-blur-2xl"
    >
      {/* Blurred background — crossfades between articles */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
        >
          {hasImage ? (
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: 'blur(28px)', transform: 'scale(1.08)', opacity: 0.3 }}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `radial-gradient(ellipse 100% 70% at 50% 40%, ${sector.gradientFrom}, transparent 70%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
        </motion.div>
      </AnimatePresence>

      {/* Progress bars */}
      <div className="absolute left-0 right-0 top-0 z-30 flex gap-1 px-4 pt-4 safe-top">
        {items.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
            {i < current && <div className="h-full w-full bg-white/60" />}
            {i === current && (
              <motion.div
                key={`p-${progressKey.current}`}
                className="h-full origin-left bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPaused ? undefined : 1 }}
                transition={{ duration: isPaused ? 0 : STORY_DURATION, ease: 'linear' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="absolute left-0 right-0 top-6 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-base">{sector.icon}</span>
          <span className="text-sm font-semibold text-white/80">{sector.label}</span>
          <span className="text-[10px] text-white/35 tabular-nums">
            {current + 1} / {items.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            {isPaused
              ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            }
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Invisible tap zones */}
      <button onClick={previous} className="absolute inset-y-0 left-0 z-10 w-1/3" aria-label="Previous" />
      <button onClick={next}     className="absolute inset-y-0 right-0 z-10 w-1/3" aria-label="Next" />

      {/* Drag wrapper — owns the x motion value, does NOT animate */}
      <motion.div
        className="relative z-20 mx-auto w-full max-w-md cursor-grab px-4 active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        style={{ x: dragX, scale: dragScale, opacity: dragOpacity }}
        onDragEnd={(_, info) => {
          dragX.set(0);
          if (info.offset.x < -55)      next();
          else if (info.offset.x > 55)  previous();
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide animation wrapper — separate x from drag x */}
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div
              className="overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl"
              style={{
                background: 'rgba(12,12,18,0.88)',
                border: `1px solid ${sc.ring}40`,
                boxShadow:
                  sentiment?.sentiment !== 'neutral'
                    ? `0 0 48px ${sc.glow}, 0 24px 64px rgba(0,0,0,0.65)`
                    : '0 24px 64px rgba(0,0,0,0.65)',
              }}
            >
              {/* Article image */}
              {hasImage && (
                <div className="relative overflow-hidden pb-[46%]">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,12,18,0.95)] via-[rgba(12,12,18,0.2)] to-transparent" />
                </div>
              )}

              <div className={hasImage ? 'p-5' : 'p-6'}>
                {/* Meta row */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <FaviconImage source={item.source} />
                  <span className="text-xs font-medium text-white/60">{item.source}</span>
                  <span className="text-[10px] text-white/35">{toRelativeTime(item.datetime)}</span>
                  {sentiment?.sentiment !== 'neutral' && (
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ color: sc.ring, background: sc.glow }}
                    >
                      {sentiment?.sentiment === 'positive' ? '↑ Positive' : '↓ Negative'}
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h2 className="mb-3 text-[15px] font-bold leading-snug text-white">
                  {item.headline}
                </h2>

                {/* Summary */}
                {item.summary && (
                  <p className="mb-5 text-sm leading-relaxed text-white/55 line-clamp-4">
                    {item.summary}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/18 hover:text-white"
                  >
                    Read Full Article
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between px-1 text-[10px] text-white/20">
              <span>{current > 0 ? '← swipe or tap left' : ''}</span>
              <span>{current < items.length - 1 ? 'tap right or swipe →' : 'last story'}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
