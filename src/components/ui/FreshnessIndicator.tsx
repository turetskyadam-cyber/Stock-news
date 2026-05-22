import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export type FreshnessLevel = 'breaking' | 'hot' | 'fresh' | 'normal';

export function getFreshness(datetimeSeconds: number): { level: FreshnessLevel; ageMinutes: number } {
  const ageMinutes = (Date.now() / 1000 - datetimeSeconds) / 60;
  if (ageMinutes < 30) return { level: 'breaking', ageMinutes };
  if (ageMinutes < 120) return { level: 'hot', ageMinutes };
  if (ageMinutes < 360) return { level: 'fresh', ageMinutes };
  return { level: 'normal', ageMinutes };
}

interface FreshnessIndicatorProps {
  datetime: number;
  className?: string;
}

const config = {
  breaking: {
    label: 'BREAKING',
    dot: true,
    classes: 'bg-red-500/20 text-red-400 border border-red-500/30',
    dotClass: 'bg-red-400 animate-pulse',
  },
  hot: {
    label: 'HOT',
    dot: false,
    classes: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
    dotClass: '',
  },
  fresh: {
    label: 'NEW',
    dot: false,
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    dotClass: '',
  },
  normal: { label: '', dot: false, classes: '', dotClass: '' },
} as const;

export function FreshnessIndicator({ datetime, className }: FreshnessIndicatorProps) {
  const { level } = getFreshness(datetime);
  if (level === 'normal') return null;
  const { label, dot, classes, dotClass } = config[level];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-widest',
        classes,
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />}
      {label}
    </motion.span>
  );
}

interface FreshnessGlowBarProps {
  datetime: number;
  gradientFrom: string;
  gradientTo: string;
}

export function FreshnessGlowBar({ datetime, gradientFrom, gradientTo }: FreshnessGlowBarProps) {
  const { level } = getFreshness(datetime);
  if (level === 'normal') return null;
  const opacity = level === 'breaking' ? 1 : level === 'hot' ? 0.6 : 0.3;

  return (
    <div
      className="absolute left-0 right-0 top-0 z-30 h-0.5 rounded-t-2xl"
      style={{
        background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
        opacity,
        boxShadow: level === 'breaking' ? `0 1px 12px ${gradientFrom}` : undefined,
      }}
      aria-hidden
    />
  );
}
