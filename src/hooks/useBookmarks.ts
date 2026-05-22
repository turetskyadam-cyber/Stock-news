import { useCallback, useEffect, useState } from 'react';
import type { FinnhubNewsItem, SectorKey } from '../types/news';

const STORAGE_KEY = 'market-pulse-bookmarks-v1';

export interface BookmarkedArticle extends FinnhubNewsItem {
  savedAt: number;
  sectorKey: SectorKey;
}

function load(): BookmarkedArticle[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as BookmarkedArticle[]) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks]);

  const save = useCallback((item: FinnhubNewsItem, sectorKey: SectorKey) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      return [{ ...item, savedAt: Date.now(), sectorKey }, ...prev];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isSaved = useCallback(
    (id: number) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggle = useCallback(
    (item: FinnhubNewsItem, sectorKey: SectorKey) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === item.id)) return prev.filter((b) => b.id !== item.id);
        return [{ ...item, savedAt: Date.now(), sectorKey }, ...prev];
      });
    },
    []
  );

  return { bookmarks, save, remove, isSaved, toggle };
}
