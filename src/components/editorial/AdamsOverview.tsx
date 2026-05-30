import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getEditorial } from '../../lib/editorial';
import type { FinnhubNewsItem, SectorConfig } from '../../types/news';

interface AdamsOverviewProps {
  items: FinnhubNewsItem[];
  sector: SectorConfig;
}

export function AdamsOverview({ items, sector }: AdamsOverviewProps) {
  const { overview, forecast, watch } = useMemo(
    () => getEditorial(items, sector),
    [items, sector]
  );

  return (
    <motion.div
      key={sector.key}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
      style={{
        background: `linear-gradient(180deg, ${sector.gradientFrom}, rgba(255,255,255,0.02) 70%)`,
      }}
    >
      {/* Byline */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 font-display text-sm font-semibold text-white">
          A
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-white/90">
            Adam&rsquo;s {sector.label} Overview
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
            Member briefing
          </span>
        </div>
      </div>

      {/* The take */}
      <p className="font-display text-balance text-[17px] leading-relaxed text-white/85 sm:text-lg">
        {overview}
      </p>

      {/* Signals row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
            Adam&rsquo;s 90-Day Forecast
          </span>
          <span
            className="flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{
              color: forecast.color,
              borderColor: `${forecast.color}66`,
              backgroundColor: `${forecast.color}1a`,
            }}
          >
            <span>{forecast.glyph}</span>
            {forecast.stance}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/45">
          <span className="uppercase tracking-[0.12em] text-white/30">Conviction</span>
          <span className="font-semibold text-white/70">
            {forecast.conviction}
          </span>
          <span className="tabular-nums text-white/40">· {forecast.confidence}%</span>
        </div>

        {watch && (
          <div className="flex items-center gap-1.5 text-xs text-white/45">
            <span className="uppercase tracking-[0.12em] text-white/30">Adam&rsquo;s Watch</span>
            <span className="rounded-md bg-white/8 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white/80">
              {watch}
            </span>
          </div>
        )}

        <span className="ml-auto font-display text-sm italic text-white/35">— Adam</span>
      </div>
    </motion.div>
  );
}
