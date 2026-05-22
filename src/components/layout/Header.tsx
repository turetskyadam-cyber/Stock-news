import { motion } from 'framer-motion';
import { RefreshIndicator } from '../ui/RefreshIndicator';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LayoutToggle, type Layout } from '../ui/LayoutToggle';

interface HeaderProps {
  secondsUntilRefresh: number;
  layout: Layout;
  onLayoutChange: (l: Layout) => void;
  bookmarkCount: number;
  onOpenReadingList: () => void;
}

export function Header({
  secondsUntilRefresh,
  layout,
  onLayoutChange,
  bookmarkCount,
  onOpenReadingList,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8 flex flex-wrap items-start justify-between gap-4"
    >
      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:via-white/90 dark:to-white/60 from-gray-900 via-gray-700 to-gray-500">
            Market Pulse
          </h1>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
              Live
            </span>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-white/30 dark:text-white/30 text-black/40">
          Real-time sector news
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <LayoutToggle layout={layout} onChange={onLayoutChange} />

        {/* Reading list */}
        <button
          onClick={onOpenReadingList}
          title="Reading list (R)"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/90 border-black/10 bg-black/5 text-black/50 hover:bg-black/8 hover:text-black/80"
          aria-label="Open reading list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {bookmarkCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-black">
              {bookmarkCount > 99 ? '99+' : bookmarkCount}
            </span>
          )}
        </button>

        <RefreshIndicator secondsUntilRefresh={secondsUntilRefresh} />
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
