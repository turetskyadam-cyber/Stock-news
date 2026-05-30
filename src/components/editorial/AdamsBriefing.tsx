import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toRelativeTime } from '../../lib/utils';
import { briefingLine, dailyMotto } from '../../lib/editorial';
import type { SectorLead } from '../../lib/marketaux';

interface AdamsBriefingProps {
  leads: SectorLead[];
  loading: boolean;
  onClose: () => void;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function BriefingItem({ lead, index }: { lead: SectorLead; index: number }) {
  const [imgError, setImgError] = useState(false);
  const { sector, item } = lead;
  const hasImage = Boolean(item.image) && !imgError;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.5) }}
      className="group block border-t border-white/10 py-8 first:border-t-0 sm:py-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10">
        {/* Text */}
        <div className="order-2 md:order-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg" aria-hidden>{sector.icon}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {sector.label}
            </span>
          </div>
          <h3 className="font-display text-balance text-2xl font-medium leading-[1.15] text-white sm:text-3xl">
            {item.headline}
          </h3>
          <p className="mt-3 font-display text-[15px] italic leading-relaxed text-white/55">
            “{briefingLine([item], sector)}”
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
            <span>{item.source}</span>
            <span className="opacity-40">·</span>
            <span>{toRelativeTime(item.datetime)}</span>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 overflow-hidden rounded-2xl md:order-2">
          <div className="relative aspect-[16/10] w-full bg-white/5">
            {hasImage ? (
              <img
                src={item.image}
                alt=""
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background: `radial-gradient(120% 120% at 20% 0%, ${sector.gradientFrom}, ${sector.gradientTo} 60%, transparent)`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function AdamsBriefing({ leads, loading, onClose }: AdamsBriefingProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0f]"
    >
      {/* Ambient top glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-64 opacity-60"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(99,102,241,0.18), transparent 70%)' }}
        aria-hidden
      />

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close briefing"
        className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white sm:right-6 sm:top-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
            {greeting()} · {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl">
            Adam&rsquo;s Briefing
          </h1>
          <p className="mt-4 font-display text-lg italic text-white/45">
            {dailyMotto()}
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/40">
            The one story that matters in every sector today — read in two minutes,
            curated by hand.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 gap-6 border-t border-white/10 py-10 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                  <div className="h-7 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-7 w-2/3 animate-pulse rounded bg-white/10" />
                </div>
                <div className="aspect-[16/10] animate-pulse rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {leads
              .filter((l) => l.item)
              .map((lead, i) => (
                <BriefingItem key={lead.sector.key} lead={lead} index={i} />
              ))}
          </div>
        )}

        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-14 border-t border-white/10 pt-8 text-center font-display text-lg italic text-white/40"
          >
            That&rsquo;s the brief. Trade well. — Adam
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
