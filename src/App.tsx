import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { SectorTabs } from './components/sectors/SectorTabs';
import { CuratedFeed } from './components/news/CuratedFeed';
import { StoryMode } from './components/story/StoryMode';
import { AdamsBriefing } from './components/editorial/AdamsBriefing';
import { useSectorNews } from './hooks/useSectorNews';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { SECTORS, SECTOR_MAP } from './lib/sectors';
import { fetchSectorLeads, type SectorLead } from './lib/marketaux';
import type { SectorKey } from './types/news';

export function App() {
  const [activeSector, setActiveSector] = useState<SectorKey>('technology');
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  // Adam's Briefing
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingLeads, setBriefingLeads] = useState<SectorLead[]>([]);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const { items, status, error, refetch } = useSectorNews(activeSector);
  const { secondsUntilRefresh } = useAutoRefresh(refetch);

  const sector = SECTOR_MAP.get(activeSector)!;

  const openBriefing = useCallback(() => {
    setBriefingOpen(true);
    setBriefingLoading(true);
    const controller = new AbortController();
    fetchSectorLeads(controller.signal)
      .then((leads) => setBriefingLeads(leads))
      .catch(() => {})
      .finally(() => setBriefingLoading(false));
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (briefingOpen) return;

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
  }, [activeSector, storyIndex, items.length, briefingOpen]);

  return (
    <Layout activeSector={activeSector}>
      <Header secondsUntilRefresh={secondsUntilRefresh} onOpenBriefing={openBriefing} />

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

      {/* Adam's Briefing — fullscreen overlay */}
      <AnimatePresence>
        {briefingOpen && (
          <AdamsBriefing
            leads={briefingLeads}
            loading={briefingLoading}
            onClose={() => setBriefingOpen(false)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
