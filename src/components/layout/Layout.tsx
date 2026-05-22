import { AnimatePresence, motion } from 'framer-motion';
import type { SectorKey } from '../../types/news';
import { SECTOR_MAP } from '../../lib/sectors';

interface LayoutProps {
  children: React.ReactNode;
  activeSector: SectorKey;
}

export function Layout({ children, activeSector }: LayoutProps) {
  const sector = SECTOR_MAP.get(activeSector);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f8fc] text-gray-900 transition-colors duration-500 dark:bg-[#0a0a0f] dark:text-white">
      {/* Sector-keyed ambient gradient — crossfades on sector change */}
      <AnimatePresence>
        <motion.div
          key={activeSector}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: sector
              ? `radial-gradient(ellipse 90% 55% at 50% -5%, ${sector.gradientFrom}, ${sector.gradientTo} 50%, transparent 75%)`
              : undefined,
          }}
          aria-hidden
        />
      </AnimatePresence>

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
