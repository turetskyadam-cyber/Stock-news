import { useMemo, useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { SectorTabs } from './components/sectors/SectorTabs';
import { NewsGrid } from './components/news/NewsGrid';
import { SectorStats } from './components/stats/SectorStats';
import { KeywordFilter } from './components/stats/KeywordFilter';
import { StoryMode } from './components/story/StoryMode';
import { ReadingListDrawer } from './components/bookmarks/ReadingListDrawer';
import { useSectorNews } from './hooks/useSectorNews';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useBookmarks } from './hooks/useBookmarks';
import { SECTORS, SECTOR_MAP } from './lib/sectors';
import { extractKeywords } from './lib/keywords';
import type { SectorKey } from './types/news';
import type { Layout as LayoutType } from './components/ui/LayoutToggle';
import type { FinnhubNewsItem } from './types/news';

export function App() {
  const [activeSector, setActiveSector] = useState<SectorKey>('technology');
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [isReadingListOpen, setIsReadingListOpen] = useState(false);
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');

  const { items, status, error, refetch } = useSectorNews(activeSector);
  const { secondsUntilRefresh } = useAutoRefresh(refetch);
  const { bookmarks, remove, isSaved, toggle } = useBookmarks();

  const sector = SECTOR_MAP.get(activeSector)!;

  // Reset filters when sector changes
  useEffect(() => {
    setActiveKeywords([]);
    setFilterText('');
  }, [activeSector]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesText =
        !filterText ||
        item.headline.toLowerCase().includes(filterText.toLowerCase()) ||
        item.source.toLowerCase().includes(filterText.toLowerCase());
      const matchesKeywords =
        activeKeywords.length === 0 ||
        activeKeywords.some((kw) =>
          item.headline.toLowerCase().includes(kw.toLowerCase())
        );
      return matchesText && matchesKeywords;
    });
  }, [items, filterText, activeKeywords]);

  // Keywords from current sector headlines
  const keywords = useMemo(
    () => extractKeywords(items.map((i) => i.headline), 16),
    [items]
  );

  const handleToggleSave = useCallback(
    (item: FinnhubNewsItem) => toggle(item, activeSector),
    [toggle, activeSector]
  );

  const handleKeywordToggle = useCallback((word: string) => {
    setActiveKeywords((prev) =>
      prev.includes(word) ? prev.filter((k) => k !== word) : [...prev, word]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveKeywords([]);
    setFilterText('');
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Sector navigation
      if (e.key === 'ArrowLeft' && !storyIndex) {
        const idx = SECTORS.findIndex((s) => s.key === activeSector);
        if (idx > 0) setActiveSector(SECTORS[idx - 1].key);
      }
      if (e.key === 'ArrowRight' && !storyIndex) {
        const idx = SECTORS.findIndex((s) => s.key === activeSector);
        if (idx < SECTORS.length - 1) setActiveSector(SECTORS[idx + 1].key);
      }

      // Story mode
      if (e.key === ' ' && storyIndex === null && !isReadingListOpen) {
        e.preventDefault();
        if (filteredItems.length > 0) setStoryIndex(0);
      }

      // Reading list
      if ((e.key === 'r' || e.key === 'R') && storyIndex === null) {
        setIsReadingListOpen((o) => !o);
      }

      // Layout toggle
      if ((e.key === 'l' || e.key === 'L') && storyIndex === null) {
        setLayout((l) => l === 'grid' ? 'magazine' : l === 'magazine' ? 'list' : 'grid');
      }

      // Escape to close
      if (e.key === 'Escape') {
        if (isReadingListOpen) setIsReadingListOpen(false);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeSector, storyIndex, isReadingListOpen, filteredItems.length]);

  return (
    <Layout activeSector={activeSector}>
      <Header
        secondsUntilRefresh={secondsUntilRefresh}
        layout={layout}
        onLayoutChange={setLayout}
        bookmarkCount={bookmarks.length}
        onOpenReadingList={() => setIsReadingListOpen(true)}
      />

      <SectorTabs activeSector={activeSector} onChange={setActiveSector} />

      {/* Stats + keyword filter — only when we have data */}
      {items.length > 0 && (
        <>
          <SectorStats
            items={items}
            sector={sector}
            onStoryMode={() => setStoryIndex(0)}
          />
          <KeywordFilter
            keywords={keywords}
            active={activeKeywords}
            onToggle={handleKeywordToggle}
            onClear={handleClearFilters}
            filterText={filterText}
            onFilterTextChange={setFilterText}
            sector={sector}
            resultCount={filteredItems.length}
            totalCount={items.length}
          />
        </>
      )}

      <NewsGrid
        items={filteredItems}
        status={status}
        error={error}
        sector={sector}
        layout={layout}
        activeKeywords={activeKeywords}
        isSaved={isSaved}
        onToggleSave={handleToggleSave}
        onStoryOpen={setStoryIndex}
        onRetry={refetch}
      />

      {/* Story Mode — fullscreen overlay */}
      <AnimatePresence>
        {storyIndex !== null && filteredItems.length > 0 && (
          <StoryMode
            items={filteredItems}
            initialIndex={Math.min(storyIndex, filteredItems.length - 1)}
            sector={sector}
            onClose={() => setStoryIndex(null)}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
          />
        )}
      </AnimatePresence>

      {/* Reading List Drawer */}
      <ReadingListDrawer
        isOpen={isReadingListOpen}
        onClose={() => setIsReadingListOpen(false)}
        bookmarks={bookmarks}
        onRemove={remove}
      />
    </Layout>
  );
}
