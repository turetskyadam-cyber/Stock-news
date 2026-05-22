import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { SectorTabs } from './components/sectors/SectorTabs';
import { NewsGrid } from './components/news/NewsGrid';
import { useSectorNews } from './hooks/useSectorNews';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { SECTOR_MAP } from './lib/sectors';
import type { SectorKey } from './types/news';

export function App() {
  const [activeSector, setActiveSector] = useState<SectorKey>('technology');
  const { items, status, error, lastUpdated, refetch } = useSectorNews(activeSector);
  const { secondsUntilRefresh } = useAutoRefresh(refetch);

  const sector = SECTOR_MAP.get(activeSector)!;

  return (
    <Layout activeSector={activeSector}>
      <Header secondsUntilRefresh={secondsUntilRefresh} lastUpdated={lastUpdated} />
      <SectorTabs activeSector={activeSector} onChange={setActiveSector} />
      <NewsGrid
        items={items}
        status={status}
        error={error}
        sector={sector}
        onRetry={refetch}
      />
    </Layout>
  );
}
