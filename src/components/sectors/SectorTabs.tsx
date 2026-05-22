import { motion } from 'framer-motion';
import { SECTORS } from '../../lib/sectors';
import type { SectorKey } from '../../types/news';
import { SectorTab } from './SectorTab';
import { SECTOR_MAP } from '../../lib/sectors';

interface SectorTabsProps {
  activeSector: SectorKey;
  onChange: (key: SectorKey) => void;
}

export function SectorTabs({ activeSector, onChange }: SectorTabsProps) {
  const activeSectorConfig = SECTOR_MAP.get(activeSector);

  const pillColors: Record<string, string> = {
    blue: 'rgba(59,130,246,0.2)',
    amber: 'rgba(245,158,11,0.2)',
    emerald: 'rgba(16,185,129,0.2)',
    violet: 'rgba(139,92,246,0.2)',
    rose: 'rgba(244,63,94,0.2)',
    orange: 'rgba(249,115,22,0.2)',
    yellow: 'rgba(234,179,8,0.2)',
    slate: 'rgba(100,116,139,0.2)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8"
    >
      <div className="scrollbar-hide relative flex gap-0.5 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 border-black/8 bg-black/4">
        {/* Gliding pill — layoutId handles all position/size animation */}
        <motion.div
          layoutId="sector-pill"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-y-1 rounded-xl border border-white/10 dark:border-white/10 border-black/8"
          style={{
            backgroundColor:
              activeSectorConfig ? pillColors[activeSectorConfig.color] : 'rgba(255,255,255,0.1)',
          }}
          aria-hidden
        />

        {SECTORS.map((sector) => (
          <SectorTab
            key={sector.key}
            sector={sector}
            isActive={activeSector === sector.key}
            onClick={() => onChange(sector.key)}
          />
        ))}
      </div>
    </motion.div>
  );
}
