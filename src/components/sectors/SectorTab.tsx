import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { SectorConfig } from '../../types/news';

interface SectorTabProps {
  sector: SectorConfig;
  isActive: boolean;
  onClick: () => void;
}

// Shorter labels so every bubble fits and reads cleanly.
const SHORT: Record<string, string> = {
  technology: 'Tech',
  healthcare: 'Health',
  industrials: 'Industry',
};

// Per-sector colour for the active bubble.
const ACTIVE: Record<string, { bg: string; border: string; text: string }> = {
  blue:    { bg: 'rgba(59,130,246,0.16)',  border: 'rgba(59,130,246,0.55)',  text: '#93c5fd' },
  amber:   { bg: 'rgba(245,158,11,0.16)',  border: 'rgba(245,158,11,0.55)',  text: '#fcd34d' },
  emerald: { bg: 'rgba(16,185,129,0.16)',  border: 'rgba(16,185,129,0.55)',  text: '#6ee7b7' },
  violet:  { bg: 'rgba(139,92,246,0.16)',  border: 'rgba(139,92,246,0.55)',  text: '#c4b5fd' },
  rose:    { bg: 'rgba(244,63,94,0.16)',   border: 'rgba(244,63,94,0.55)',   text: '#fda4af' },
  orange:  { bg: 'rgba(249,115,22,0.16)',  border: 'rgba(249,115,22,0.55)',  text: '#fdba74' },
  yellow:  { bg: 'rgba(234,179,8,0.16)',   border: 'rgba(234,179,8,0.55)',   text: '#fde047' },
  slate:   { bg: 'rgba(100,116,139,0.18)', border: 'rgba(100,116,139,0.55)', text: '#cbd5e1' },
};

export function SectorTab({ sector, isActive, onClick }: SectorTabProps) {
  const label = SHORT[sector.key] ?? sector.label;
  const active = ACTIVE[sector.color] ?? ACTIVE.slate;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={cn(
        'flex flex-shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
        !isActive &&
          'border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80'
      )}
      style={
        isActive
          ? { backgroundColor: active.bg, borderColor: active.border, color: active.text }
          : undefined
      }
      aria-pressed={isActive}
    >
      <span className="text-base leading-none" aria-hidden>
        {sector.icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
