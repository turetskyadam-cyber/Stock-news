import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshIndicator } from '../ui/RefreshIndicator';

interface HeaderProps {
  secondsUntilRefresh: number;
}

export function Header({ secondsUntilRefresh }: HeaderProps) {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-9 flex items-start justify-between gap-4"
    >
      {/* Masthead */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[28px] font-medium tracking-tight text-white">
            Market&nbsp;Pulse
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Members
            </span>
          </span>
        </div>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
          Curated market intelligence
        </p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/25">
          {today}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5">
        <RefreshIndicator secondsUntilRefresh={secondsUntilRefresh} />
      </div>
    </motion.header>
  );
}
