import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Keyword } from '../../lib/keywords';
import type { SectorConfig } from '../../types/news';

interface KeywordFilterProps {
  keywords: Keyword[];
  active: string[];
  onToggle: (word: string) => void;
  onClear: () => void;
  filterText: string;
  onFilterTextChange: (text: string) => void;
  sector: SectorConfig;
  resultCount: number;
  totalCount: number;
}

const accentBorder: Record<string, string> = {
  blue:     'border-blue-500/50 bg-blue-500/15 text-blue-300',
  amber:    'border-amber-500/50 bg-amber-500/15 text-amber-300',
  emerald:  'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
  violet:   'border-violet-500/50 bg-violet-500/15 text-violet-300',
  rose:     'border-rose-500/50 bg-rose-500/15 text-rose-300',
  orange:   'border-orange-500/50 bg-orange-500/15 text-orange-300',
  yellow:   'border-yellow-500/50 bg-yellow-500/15 text-yellow-300',
  slate:    'border-slate-500/50 bg-slate-500/15 text-slate-300',
};

export function KeywordFilter({
  keywords,
  active,
  onToggle,
  onClear,
  filterText,
  onFilterTextChange,
  sector,
  resultCount,
  totalCount,
}: KeywordFilterProps) {
  const isFiltered = active.length > 0 || filterText.length > 0;

  return (
    <div className="mb-6 space-y-2.5">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 dark:text-white/30 text-black/30"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Search headlines…"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white/80 placeholder-white/25 outline-none transition-all focus:border-white/25 focus:bg-white/8 focus:ring-0 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder-white/25 dark:focus:border-white/25 dark:focus:bg-white/8 border-black/10 bg-black/4 text-gray-700 placeholder-black/25 focus:border-black/20 focus:bg-black/6"
        />
        <AnimatePresence>
          {filterText && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onFilterTextChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 dark:text-white/30 dark:hover:text-white/70 text-black/30 hover:text-black/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Keyword pills */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/25 dark:text-white/25 text-black/25">
            Trending:
          </span>
          {keywords.map((kw) => {
            const isActive = active.includes(kw.word);
            return (
              <motion.button
                key={kw.word}
                onClick={() => onToggle(kw.word)}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className={cn(
                  'group flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all duration-150',
                  isActive
                    ? accentBorder[sector.color] ?? accentBorder.slate
                    : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70 dark:border-white/10 dark:text-white/40 dark:hover:border-white/25 dark:hover:text-white/70 border-black/8 text-black/40 hover:border-black/18 hover:text-black/65'
                )}
              >
                {kw.word}
                <span className={cn('text-[9px]', isActive ? 'opacity-80' : 'opacity-50')}>
                  {kw.count}
                </span>
              </motion.button>
            );
          })}

          <AnimatePresence>
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                onClick={onClear}
                className="ml-1 text-[11px] text-white/35 underline underline-offset-2 hover:text-white/70 dark:text-white/35 dark:hover:text-white/70 text-black/35 hover:text-black/60"
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>

          {/* Result count */}
          <AnimatePresence>
            {isFiltered && resultCount !== totalCount && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-auto text-[11px] text-white/30 dark:text-white/30 text-black/35 tabular-nums"
              >
                {resultCount} of {totalCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
