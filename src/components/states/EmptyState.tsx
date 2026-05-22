import { motion } from 'framer-motion';
import type { SectorConfig } from '../../types/news';

interface EmptyStateProps {
  sector: SectorConfig;
}

export function EmptyState({ sector }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        className="mb-5 text-6xl"
        aria-hidden
      >
        {sector.icon}
      </motion.div>
      <h3 className="mb-2 text-base font-semibold text-white/70 dark:text-white/70 text-gray-600">
        No {sector.label} news today
      </h3>
      <p className="max-w-xs text-sm text-white/35 dark:text-white/35 text-black/35">
        Markets may be closed or no articles have been published yet. Check back on a trading day.
      </p>
    </motion.div>
  );
}
