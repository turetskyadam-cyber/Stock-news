import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { SectorTabs } from './components/sectors/SectorTabs';
import { CuratedFeed } from './components/news/CuratedFeed';
import { StoryMode } from './components/story/StoryMode';
import { useSectorNews } from './hooks/useSectorNews';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { SECTORS, SECTOR_MAP } from './lib/sectors';
import type { SectorKey } from './types/news';

export function App() {
  const [activeSector, setActiveSector] = useState<SectorKey>('technology');
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  const { items, status, error, refetch } = useSectorNews(activeSector);
  const { secondsUntilRefresh } = useAutoRefresh(refetch);

  const sector = SECTOR_MAP.get(activeSector)!;

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
      if (e.key === ' ' && storyIndex === null) {
        e.preventDefault();
        if (items.length > 0) setStoryIndex(0);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeSector, storyIndex, items.length]);

  return (
    <Layout activeSector={activeSector}>
      <Header secondsUntilRefresh={secondsUntilRefresh} />

      <SectorTabs activeSector={activeSector} onChange={setActiveSector} />

      <CuratedFeed
        items={items}
        status={status}
        error={error}
        sector={sector}
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
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
