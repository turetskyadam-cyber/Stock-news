import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaviconImage } from '../ui/FaviconImage';
import { SECTOR_MAP } from '../../lib/sectors';
import type { BookmarkedArticle } from '../../hooks/useBookmarks';

interface ReadingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkedArticle[];
  onRemove: (id: number) => void;
}

export function ReadingListDrawer({ isOpen, onClose, bookmarks, onRemove }: ReadingListDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-[#0d0d14] shadow-2xl dark:border-white/10 dark:bg-[#0d0d14] border-black/12 bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 dark:border-white/8 border-black/8">
              <div>
                <h2 className="text-sm font-semibold text-white/90 dark:text-white/90 text-gray-900">
                  Reading List
                </h2>
                <p className="text-xs text-white/35 dark:text-white/35 text-black/40">
                  {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/8 hover:text-white/80 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80 text-black/40 hover:bg-black/6 hover:text-black/70"
                aria-label="Close reading list"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Articles */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="mb-3 text-4xl" aria-hidden>🔖</span>
                  <p className="text-sm font-medium text-white/50 dark:text-white/50 text-black/50">
                    No saved articles yet
                  </p>
                  <p className="mt-1 text-xs text-white/25 dark:text-white/25 text-black/30">
                    Tap the bookmark icon on any article
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {bookmarks.map((article) => {
                      const sectorConfig = SECTOR_MAP.get(article.sectorKey);
                      return (
                        <motion.div
                          key={article.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/4 p-3 dark:border-white/8 dark:bg-white/4 border-black/6 bg-black/3"
                        >
                          {/* Sector color strip */}
                          {sectorConfig && (
                            <div
                              className="absolute bottom-0 left-0 top-0 w-0.5 rounded-l-xl"
                              style={{ backgroundColor: sectorConfig.gradientFrom }}
                            />
                          )}

                          <div className="pl-2">
                            {/* Source + sector + time */}
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <FaviconImage source={article.source} />
                              <span className="text-[10px] text-white/40 dark:text-white/40 text-black/40">
                                {article.source}
                              </span>
                              {sectorConfig && (
                                <span className="text-[10px] text-white/30 dark:text-white/30 text-black/30">
                                  · {sectorConfig.icon} {sectorConfig.label}
                                </span>
                              )}
                              <span className="ml-auto text-[10px] text-white/25 dark:text-white/25 text-black/25">
                                {formatDistanceToNow(new Date(article.savedAt), { addSuffix: true })}
                              </span>
                            </div>

                            {/* Headline */}
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs font-semibold leading-snug text-white/80 transition-colors hover:text-white dark:text-white/80 dark:hover:text-white text-gray-800 hover:text-gray-900 line-clamp-2"
                            >
                              {article.headline}
                            </a>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => onRemove(article.id)}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-white/0 transition-all group-hover:text-white/40 hover:!text-white/80 dark:text-white/0 dark:group-hover:text-white/40"
                            aria-label="Remove from reading list"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
