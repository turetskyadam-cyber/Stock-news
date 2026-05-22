import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export type Layout = 'grid' | 'magazine' | 'list';

interface LayoutToggleProps {
  layout: Layout;
  onChange: (l: Layout) => void;
}

const options: { value: Layout; icon: React.ReactNode; label: string }[] = [
  {
    value: 'grid',
    label: 'Grid',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <rect x="0" y="0" width="6" height="6" rx="1" />
        <rect x="8" y="0" width="6" height="6" rx="1" />
        <rect x="0" y="8" width="6" height="6" rx="1" />
        <rect x="8" y="8" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    value: 'magazine',
    label: 'Magazine',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <rect x="0" y="0" width="8" height="14" rx="1" />
        <rect x="10" y="0" width="4" height="6" rx="1" />
        <rect x="10" y="8" width="4" height="6" rx="1" />
      </svg>
    ),
  },
  {
    value: 'list',
    label: 'List',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <rect x="0" y="0" width="14" height="3" rx="1" />
        <rect x="0" y="5.5" width="14" height="3" rx="1" />
        <rect x="0" y="11" width="14" height="3" rx="1" />
      </svg>
    ),
  },
];

export function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/5 p-0.5 dark:border-white/10 dark:bg-white/5 border-black/8 bg-black/4">
      {options.map((opt) => {
        const isActive = layout === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            className={cn(
              'relative rounded-lg px-2 py-1.5 transition-colors duration-150',
              isActive
                ? 'text-white dark:text-white text-gray-900'
                : 'text-white/35 hover:text-white/70 dark:text-white/35 dark:hover:text-white/70 text-black/35 hover:text-black/60'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="layout-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute inset-0 rounded-lg bg-white/12 dark:bg-white/12 bg-black/8"
              />
            )}
            <span className="relative z-10">{opt.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
