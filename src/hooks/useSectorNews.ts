import { useCallback, useEffect, useRef, useState } from 'react';
import type { FinnhubNewsItem, FetchStatus, SectorKey } from '../types/news';
import { SECTOR_MAP } from '../lib/sectors';
import { fetchSectorItems } from '../lib/finnhub';
import { REFRESH_INTERVAL_MS } from '../lib/constants';

interface CacheEntry {
  items: FinnhubNewsItem[];
  timestamp: number;
}

export interface SectorNewsResult {
  items: FinnhubNewsItem[];
  status: FetchStatus;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export function useSectorNews(activeSector: SectorKey): SectorNewsResult {
  const [items, setItems] = useState<FinnhubNewsItem[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const cacheRef = useRef<Map<SectorKey, CacheEntry>>(new Map());

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const cached = cacheRef.current.get(activeSector);
    const isStale = !cached || Date.now() - cached.timestamp > REFRESH_INTERVAL_MS;

    // Instantly show cached data while re-fetching in background
    if (cached) {
      setItems(cached.items);
      setStatus('success');
      setLastUpdated(new Date(cached.timestamp));
      setError(null);
    } else {
      setStatus('loading');
      setError(null);
    }

    if (!isStale && refreshKey === 0) {
      // Not stale and no manual refetch — skip network call
      return () => controller.abort();
    }

    const sector = SECTOR_MAP.get(activeSector);
    if (!sector) return () => controller.abort();

    fetchSectorItems(sector, controller.signal)
      .then((fetched) => {
        if (controller.signal.aborted) return;
        const now = new Date();
        cacheRef.current.set(activeSector, { items: fetched, timestamp: now.getTime() });
        setItems(fetched);
        setStatus('success');
        setLastUpdated(now);
        setError(null);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted || err.name === 'AbortError') return;
        if (cached) {
          // Silently keep showing stale data on error
          setStatus('success');
        } else {
          setError(err.message || 'Failed to load news');
          setStatus('error');
        }
      });

    return () => controller.abort();
  }, [activeSector, refreshKey]);

  return { items, status, error, lastUpdated, refetch };
}
