import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { SectorTabs } from './components/sectors/SectorTabs';
import { CuratedFeed } from './components/news/CuratedFeed';
import { StoryMode } from './components/story/StoryMode';
import { ReadingListDrawer } from './components/bookmarks/ReadingListDrawer';
import { useSectorNews } from './hooks/useSectorNews';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useBookmarks } from './hooks/useBookmarks';
import { SECTORS, SECTOR_MAP } from './lib/sectors';
import type { SectorKey, FinnhubNewsItem } from './types/news';

export function App() {
  const [activeSector, setActiveSector] = useState<SectorKey>('technology');
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [isReadingListOpen, setIsReadingListOpen] = useState(false);

  const { items, status, error, refetch } = useSectorNews(activeSector);
  const { secondsUntilRefresh } = useAutoRefresh(refetch);
  const { bookmarks, remove, isSaved, toggle } = useBookmarks();

  const sector = SECTOR_MAP.get(activeSector)!;

  const handleToggleSave = useCallback(
    (item: FinnhubNewsItem) => toggle(item, activeSector),
    [toggle, activeSector]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && storyIndex === null) {
        const idx = SECTORS.findIndex((s) => s.key === activeSector);
        if (idx > 0) setActiveSector(SECTORS[idx - 1].key);
      }
      if (e.key === 'ArrowRight' && storyIndex === null) {
        const idx = SECTORS.findIndex((s) => s.key === activeSector);
        if (idx < SECTORS.length - 1) setActiveSector(SECTORS[idx + 1].key);
      }
      if (e.key === ' ' && storyIndex === null && !isReadingListOpen) {
        e.preventDefault();
        if (items.length > 0) setStoryIndex(0);
      }
      if ((e.key === 'r' || e.key === 'R') && storyIndex === null) {
        setIsReadingListOpen((o) => !o);
      }
      if (e.key === 'Escape' && isReadingListOpen) setIsReadingListOpen(false);
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeSector, storyIndex, isReadingListOpen, items.length]);

  return (
    <Layout activeSector={activeSector}>
      <Header
        secondsUntilRefresh={secondsUntilRefresh}
        bookmarkCount={bookmarks.length}
        onOpenReadingList={() => setIsReadingListOpen(true)}
      />

      <SectorTabs activeSector={activeSector} onChange={setActiveSector} />

      <CuratedFeed
        items={items}
        status={status}
        error={error}
        sector={sector}
        isSaved={isSaved}
        onToggleSave={handleToggleSave}
        onStoryOpen={setStoryIndex}
        onRetry={refetch}
      />

      {/* Story Mode — fullscreen overlay */}
      <AnimatePresence>
        {storyIndex !== null && items.length > 0 && (
          <StoryMode
            items={items}
            initialIndex={Math.min(storyIndex, items.length - 1)}
            sector={sector}
            onClose={() => setStoryIndex(null)}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
          />
        )}
      </AnimatePresence>

      {/* Saved articles drawer */}
      <ReadingListDrawer
        isOpen={isReadingListOpen}
        onClose={() => setIsReadingListOpen(false)}
        bookmarks={bookmarks}
        onRemove={remove}
      />
    </Layout>
  );
}
