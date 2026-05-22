import { API_BASE, MAX_NEWS_PER_SECTOR, REQUEST_DELAY_MS } from './constants';
import { deduplicateAndSort, getTodayRange } from './utils';
import type { FinnhubNewsItem, SectorConfig } from '../types/news';

const KEY = import.meta.env.VITE_FINNHUB_KEY as string;

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited — try again in a minute');
    throw new Error(`API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCategoryNews(
  category: string,
  signal?: AbortSignal
): Promise<FinnhubNewsItem[]> {
  return request<FinnhubNewsItem[]>(`${API_BASE}/news?category=${category}&token=${KEY}`, signal);
}

export async function fetchCompanyNews(
  symbol: string,
  from: string,
  to: string,
  signal?: AbortSignal
): Promise<FinnhubNewsItem[]> {
  return request<FinnhubNewsItem[]>(
    `${API_BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${KEY}`,
    signal
  );
}

export async function fetchSectorItems(
  sector: SectorConfig,
  signal: AbortSignal
): Promise<FinnhubNewsItem[]> {
  if (sector.category) {
    return fetchCategoryNews(sector.category, signal);
  }

  const { from, to } = getTodayRange();
  const symbols = sector.symbols!;

  const results = await Promise.allSettled(
    symbols.map(
      (symbol, i) =>
        new Promise<FinnhubNewsItem[]>((resolve, reject) => {
          if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));

          const timer = setTimeout(async () => {
            if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
            try {
              resolve(await fetchCompanyNews(symbol, from, to, signal));
            } catch (e) {
              reject(e);
            }
          }, i * REQUEST_DELAY_MS);

          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    )
  );

  const allItems = results
    .filter((r): r is PromiseFulfilledResult<FinnhubNewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  const allRateLimited = results.every(
    (r) => r.status === 'rejected' && (r as PromiseRejectedResult).reason?.message?.includes('Rate')
  );
  if (allRateLimited) throw new Error('Rate limited — try again in a minute');

  return deduplicateAndSort(allItems, MAX_NEWS_PER_SECTOR);
}
