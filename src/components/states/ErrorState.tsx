import { motion } from 'framer-motion';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-5 text-5xl"
        aria-hidden
      >
        ⚠️
      </motion.div>
      <h3 className="mb-2 text-base font-semibold text-white/80 dark:text-white/80 text-gray-700">
        Couldn't load news
      </h3>
      <p className="mb-6 max-w-xs text-sm text-white/40 dark:text-white/40 text-black/40">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="group inline-flex items-center gap-1.5 text-sm text-white/50 underline-offset-4 transition-colors hover:text-white/90 hover:underline dark:text-white/50 dark:hover:text-white/90 text-black/50 hover:text-black/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:rotate-180"
          aria-hidden
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        Try again
      </button>
    </motion.div>
  );
}
