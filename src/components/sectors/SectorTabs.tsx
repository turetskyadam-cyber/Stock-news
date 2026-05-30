import { motion } from 'framer-motion';
import { SECTORS } from '../../lib/sectors';
import type { SectorKey } from '../../types/news';
import { SectorTab } from './SectorTab';

interface SectorTabsProps {
  activeSector: SectorKey;
  onChange: (key: SectorKey) => void;
}

export function SectorTabs({ activeSector, onChange }: SectorTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-9 flex flex-wrap gap-2"
    >
      {SECTORS.map((sector) => (
        <SectorTab
          key={sector.key}
          sector={sector}
          isActive={activeSector === sector.key}
          onClick={() => onChange(sector.key)}
        />
      ))}
    </motion.div>
  );
}
