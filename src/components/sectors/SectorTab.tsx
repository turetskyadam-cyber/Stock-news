import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { SectorConfig } from '../../types/news';

interface SectorTabProps {
  sector: SectorConfig;
  isActive: boolean;
  onClick: () => void;
}

export function SectorTab({ sector, isActive, onClick }: SectorTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative z-10 flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        isActive
          ? 'text-white dark:text-white text-gray-900'
          : 'text-white/45 hover:text-white/80 dark:text-white/45 dark:hover:text-white/80 text-black/40 hover:text-black/70'
      )}
      aria-pressed={isActive}
    >
      <motion.span
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="text-base leading-none"
        aria-hidden
      >
        {sector.icon}
      </motion.span>
      <span className="whitespace-nowrap">{sector.label}</span>
    </button>
  );
}
