import { motion } from 'framer-motion';
import { REFRESH_INTERVAL_MS } from '../../lib/constants';

interface RefreshIndicatorProps {
  secondsUntilRefresh: number;
}

const RADIUS = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL = Math.round(REFRESH_INTERVAL_MS / 1000);

export function RefreshIndicator({ secondsUntilRefresh }: RefreshIndicatorProps) {
  const offset = CIRCUMFERENCE * (1 - secondsUntilRefresh / TOTAL);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-9 w-9 items-center justify-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/10 dark:text-white/10 text-black/10"
          />
          {/* Countdown arc */}
          <motion.circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white/50 dark:text-white/50 text-black/30"
          />
        </svg>
        {/* Pulse dot in center */}
        <span className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
      </div>

      <div className="hidden flex-col items-start sm:flex">
        <span className="text-[10px] font-medium text-white/30 dark:text-white/30 text-black/30">
          LIVE
        </span>
      </div>
    </div>
  );
}
