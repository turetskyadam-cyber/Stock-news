import { motion } from 'framer-motion';
import { RefreshIndicator } from '../ui/RefreshIndicator';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  secondsUntilRefresh: number;
  lastUpdated: Date | null;
}

export function Header({ secondsUntilRefresh, lastUpdated }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8 flex items-center justify-between"
    >
      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:via-white/90 dark:to-white/60 from-gray-900 via-gray-700 to-gray-500">
            Market Pulse
          </h1>
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
              Live
            </span>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-white/30 dark:text-white/30 text-black/40">
          Real-time sector news · Powered by Finnhub
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <RefreshIndicator
          secondsUntilRefresh={secondsUntilRefresh}
          lastUpdated={lastUpdated}
        />
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
