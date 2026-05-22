import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  className?: string;
}

export function BookmarkButton({ isSaved, onToggle, className }: BookmarkButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isSaved ? 'Remove from reading list' : 'Save to reading list'}
      title={isSaved ? 'Saved' : 'Save'}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSaved ? (
          <motion.svg
            key="saved"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-400"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="unsaved"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
