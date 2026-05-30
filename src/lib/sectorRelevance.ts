import type { FinnhubNewsItem, SectorConfig } from '../types/news';

// Topical vocabulary per sector. Used to score how genuinely on-topic an article
// is, so a tab like "Crypto" surfaces crypto stories — not generic market wraps
// that merely happen to tag a ticker in passing.
const SECTOR_KEYWORDS: Record<string, string[]> = {
  technology: [
    'ai', 'artificial intelligence', 'chip', 'semiconductor', 'software', 'cloud',
    'iphone', 'gpu', 'data center', 'app', 'tech', 'silicon', 'model', 'compute',
  ],
  energy: [
    'oil', 'gas', 'crude', 'energy', 'opec', 'barrel', 'solar', 'renewable',
    'drilling', 'refinery', 'pipeline', 'lng', 'power',
  ],
  healthcare: [
    'drug', 'fda', 'health', 'pharma', 'vaccine', 'trial', 'therapy', 'biotech',
    'medical', 'patient', 'clinical', 'treatment', 'disease',
  ],
  finance: [
    'bank', 'fed', 'rate', 'interest', 'loan', 'deposit', 'yield', 'credit',
    'lending', 'mortgage', 'financial', 'wall street', 'asset management',
  ],
  consumer: [
    'retail', 'consumer', 'sales', 'store', 'brand', 'delivery', 'ev', 'vehicle',
    'shopper', 'spending', 'restaurant', 'commerce', 'demand',
  ],
  industrials: [
    'factory', 'manufactur', 'aircraft', 'engine', 'industrial', 'aerospace',
    'machinery', 'freight', 'defense', 'jet', 'logistics', 'construction',
  ],
  crypto: [
    'bitcoin', 'crypto', 'ethereum', 'blockchain', 'token', 'btc', 'eth', 'coin',
    'digital asset', 'miner', 'mining', 'stablecoin', 'web3', 'defi',
  ],
};

function scoreRelevance(item: FinnhubNewsItem, sector: SectorConfig): number {
  const symbols = sector.symbols ?? [];
  const related = item.related ? item.related.split(',').filter(Boolean) : [];
  const text = `${item.headline} ${item.summary}`.toLowerCase();

  let score = 0;

  // Direct ticker match — the article is explicitly about one of the sector's names.
  const tickerMatches = related.filter((t) => symbols.includes(t)).length;
  if (tickerMatches > 0) score += 6;

  // Topical keyword matches — confirms the story is really about this theme.
  const keywords = SECTOR_KEYWORDS[sector.key] ?? [];
  for (const kw of keywords) {
    if (text.includes(kw)) score += 3;
  }

  // Penalise generic "market wrap" stories that tag many tickers at once — these
  // are what bleed across every tab and make the curation feel sloppy.
  if (related.length >= 6) score -= 4;

  return score;
}

/**
 * Order and trim a sector's articles so the most genuinely on-topic stories lead,
 * producing a "hand-selected" feel. Falls back gracefully so a tab is never empty.
 */
export function curateForSector(
  items: FinnhubNewsItem[],
  sector: SectorConfig
): FinnhubNewsItem[] {
  // General feed isn't theme-specific — just keep it fresh.
  if (sector.key === 'general' || !(sector.symbols && sector.symbols.length)) {
    return [...items].sort((a, b) => b.datetime - a.datetime);
  }

  const scored = items.map((item) => ({ item, score: scoreRelevance(item, sector) }));
  const onTopic = scored.filter((s) => s.score > 0);

  // Only drop low-signal stories if enough strong ones remain; otherwise keep all
  // so the tab still has content.
  const pool = onTopic.length >= 5 ? onTopic : scored;

  return pool
    .sort((a, b) => b.score - a.score || b.item.datetime - a.item.datetime)
    .map((s) => s.item);
}
