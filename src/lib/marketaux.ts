import { deduplicateAndSort } from './utils';
import { MAX_NEWS_PER_SECTOR } from './constants';
import { getDemoItems } from './demoNews';
import { curateForSector } from './sectorRelevance';
import type { FinnhubNewsItem, SectorConfig } from '../types/news';

// Default key so the deployed site works without a Vercel env var.
// Override anytime by setting VITE_MARKETAUX_KEY in the build environment.
// This is a free, low-stakes, client-side key — rotate it in the Marketaux
// dashboard if needed (and update this fallback or set the env var).
const FALLBACK_KEY = 'L9XCjYwQBQ5ryjzKH4BMOhzzrjMGWnPoZOyGGBiL';
const KEY = ((import.meta.env.VITE_MARKETAUX_KEY as string) || '').trim() || FALLBACK_KEY;
const BASE = 'https://api.marketaux.com/v1/news/all';

interface MarketauxEntity {
  symbol?: string;
  name?: string;
}

interface MarketauxArticle {
  uuid: string;
  title: string;
  description?: string;
  snippet?: string;
  url: string;
  image_url?: string | null;
  published_at: string;
  source?: string;
  entities?: MarketauxEntity[];
}

interface MarketauxResponse {
  data?: MarketauxArticle[];
  error?: { code: string; message: string };
}

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function toNewsItem(a: MarketauxArticle, sectorKey: string): FinnhubNewsItem {
  const tickers = (a.entities ?? [])
    .map((e) => e.symbol)
    .filter((s): s is string => Boolean(s));

  return {
    id: hashId(a.uuid),
    headline: a.title,
    summary: a.description || a.snippet || '',
    url: a.url,
    image: a.image_url ?? '',
    source: a.source ?? 'Marketaux',
    datetime: Math.floor(Date.parse(a.published_at) / 1000),
    category: sectorKey,
    related: tickers.join(','),
  };
}

// Marketaux wants ISO 8601; look back a few days to cover weekends/quiet news days.
function getPublishedAfter(): string {
  return new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('.')[0];
}

async function request(url: string, signal?: AbortSignal): Promise<MarketauxArticle[]> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited — try again in a minute');
    if (res.status === 401 || res.status === 402)
      throw new Error('Invalid or missing Marketaux API key');
    throw new Error(`API error ${res.status}`);
  }
  const data: MarketauxResponse = await res.json();
  if (data.error) throw new Error(data.error.message || 'Marketaux API error');
  return data.data ?? [];
}

// Marketaux's free tier returns 3 articles per request, so fetch several pages
// to fill the grid with real news. Each page is one API call against the daily
// quota; the 15-min cache in useSectorNews keeps usage low.
const PAGES_TO_FETCH = 4;

function buildParams(sector: SectorConfig, page: number): string {
  const params = new URLSearchParams({
    api_token: KEY,
    language: 'en',
    filter_entities: 'true',
    published_after: getPublishedAfter(),
    limit: '3',
    page: String(page),
  });

  const symbols = sector.symbols ?? [];
  if (symbols.length > 0) {
    // Marketaux accepts a comma-separated symbol list in a single request.
    params.set('symbols', symbols.join(','));
  } else {
    // General feed: broad market/business industries.
    params.set('industries', 'Technology,Financial Services,Energy,Healthcare,Industrials');
  }
  return params.toString();
}

export async function fetchSectorItems(
  sector: SectorConfig,
  signal: AbortSignal
): Promise<FinnhubNewsItem[]> {
  try {
    const pages = Array.from({ length: PAGES_TO_FETCH }, (_, i) => i + 1);
    const results = await Promise.allSettled(
      pages.map((page) => request(`${BASE}?${buildParams(sector, page)}`, signal))
    );

    // If the very first page was aborted, propagate so the hook can ignore it.
    const aborted = results.find(
      (r) => r.status === 'rejected' && (r.reason as Error)?.name === 'AbortError'
    );
    if (aborted) throw (aborted as PromiseRejectedResult).reason;

    const items = results
      .filter((r): r is PromiseFulfilledResult<MarketauxArticle[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .map((a) => toNewsItem(a, sector.key));

    // Empty feed (e.g. quiet day or plan limits) → show demo rather than blank.
    if (items.length === 0) return getDemoItems(sector.key);

    const deduped = deduplicateAndSort(items, MAX_NEWS_PER_SECTOR);
    // Re-rank so the most on-topic stories lead — the "hand-selected" feel.
    return curateForSector(deduped, sector);
  } catch (err) {
    // Preserve user-initiated cancellations so the hook can ignore them.
    if (err instanceof Error && err.name === 'AbortError') throw err;
    // Any other failure (bad key, rate limit, network) → demo content,
    // so the site never shows an error screen.
    return getDemoItems(sector.key);
  }
}
