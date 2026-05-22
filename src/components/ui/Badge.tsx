import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'source' | 'category' | 'time';
  className?: string;
}

export function Badge({ children, variant = 'source', className }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-none',
        variant === 'source' &&
          'bg-white/10 text-white/60 dark:bg-white/10 dark:text-white/60 bg-black/8 text-black/50',
        variant === 'category' &&
          'bg-white/10 text-white/70 dark:bg-white/10 dark:text-white/70 bg-black/6 text-black/60',
        variant === 'time' && 'text-white/40 dark:text-white/40 text-black/40',
        className
      )}
    >
      {children}
    </motion.span>
  );
}
