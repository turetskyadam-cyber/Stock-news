import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshIndicator } from '../ui/RefreshIndicator';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  secondsUntilRefresh: number;
  bookmarkCount: number;
  onOpenReadingList: () => void;
}

export function Header({
  secondsUntilRefresh,
  bookmarkCount,
  onOpenReadingList,
}: HeaderProps) {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-9 flex flex-wrap items-start justify-between gap-4"
    >
      {/* Masthead */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[28px] font-medium tracking-tight text-white dark:text-white text-gray-900">
            Market&nbsp;Pulse
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 dark:border-white/15 dark:bg-white/[0.06] border-black/12 bg-black/[0.04]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70 dark:text-white/70 text-black/55">
              Members
            </span>
          </span>
        </div>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/35 dark:text-white/35 text-black/40">
          Curated market intelligence · {today}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5">
        {/* Saved articles */}
        <button
          onClick={onOpenReadingList}
          title="Saved (R)"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/90 border-black/10 bg-black/5 text-black/50 hover:bg-black/8 hover:text-black/80"
          aria-label="Open saved articles"
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
