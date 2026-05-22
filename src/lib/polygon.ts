import { deduplicateAndSort } from './utils';
import { MAX_NEWS_PER_SECTOR } from './constants';
import type { FinnhubNewsItem, SectorConfig } from '../types/news';

const KEY = import.meta.env.VITE_POLYGON_KEY as string;
const BASE = 'https://api.polygon.io/v2/reference/news';

interface PolygonPublisher {
  name: string;
  favicon_url?: string;
}

interface PolygonArticle {
  id: string;
  publisher: PolygonPublisher;
  title: string;
  published_utc: string;
  article_url: string;
  image_url?: string | null;
  description?: string;
  tickers?: string[];
}

interface PolygonResponse {
  results: PolygonArticle[];
  status: string;
}

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function toNewsItem(a: PolygonArticle, sectorKey: string): FinnhubNewsItem {
  return {
    id: hashId(a.id),
    headline: a.title,
    summary: a.description ?? '',
    url: a.article_url,
    image: a.image_url ?? '',
    source: a.publisher.name,
    datetime: Math.floor(Date.parse(a.published_utc) / 1000),
    category: sectorKey,
    related: (a.tickers ?? []).join(','),
  };
}

function getFromDate(): string {
  // Last 7 days to cover weekends and get maximum article coverage
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

async function fetchForTicker(
  ticker: string,
  sectorKey: string,
  signal?: AbortSignal
): Promise<FinnhubNewsItem[]> {
  const from = getFromDate();
  const url = `${BASE}?ticker=${encodeURIComponent(ticker)}&published_utc.gte=${from}&limit=50&order=desc&apiKey=${KEY}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited — try again in a minute');
    throw new Error(`API error ${res.status}`);
  }
  const data: PolygonResponse = await res.json();
  return (data.results ?? []).map((a) => toNewsItem(a, sectorKey));
}

async function fetchGeneral(sectorKey: string, signal?: AbortSignal): Promise<FinnhubNewsItem[]> {
  const from = getFromDate();
  const url = `${BASE}?published_utc.gte=${from}&limit=50&order=desc&apiKey=${KEY}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited — try again in a minute');
    throw new Error(`API error ${res.status}`);
  }
  const data: PolygonResponse = await res.json();
  return (data.results ?? []).map((a) => toNewsItem(a, sectorKey));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSectorItems(
  sector: SectorConfig,
  signal: AbortSignal
): Promise<FinnhubNewsItem[]> {
  const symbols = sector.symbols ?? [];

  // General sector: fetch all recent market news without a ticker filter
  if (symbols.length === 0) {
    return fetchGeneral(sector.key, signal);
  }

  const results = await Promise.allSettled(
    symbols.slice(0, 5).map(async (sym, i) => {
      if (i > 0) await delay(i * 250);
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      return fetchForTicker(sym, sector.key, signal);
    })
  );

  const items = results
    .filter((r): r is PromiseFulfilledResult<FinnhubNewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  const allFailed = results.every((r) => r.status === 'rejected');
  if (allFailed) {
    const firstErr = (results[0] as PromiseRejectedResult).reason as Error;
    throw firstErr;
  }

  return deduplicateAndSort(items, MAX_NEWS_PER_SECTOR);
}
