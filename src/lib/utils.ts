import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import type { FinnhubNewsItem } from '../types/news';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deduplicateAndSort(items: FinnhubNewsItem[], limit = 30): FinnhubNewsItem[] {
  const seen = new Set<number>();
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => b.datetime - a.datetime)
    .slice(0, limit);
}

export function toRelativeTime(unixSeconds: number): string {
  return formatDistanceToNow(new Date(unixSeconds * 1000), { addSuffix: true });
}

export function getTodayRange(): { from: string; to: string } {
  const today = format(new Date(), 'yyyy-MM-dd');
  return { from: today, to: today };
}

// Source domain lookup for favicons
const SOURCE_DOMAINS: Record<string, string> = {
  Reuters: 'reuters.com',
  Bloomberg: 'bloomberg.com',
  CNBC: 'cnbc.com',
  'MarketWatch': 'marketwatch.com',
  'The Wall Street Journal': 'wsj.com',
  WSJ: 'wsj.com',
  'Financial Times': 'ft.com',
  FT: 'ft.com',
  'Yahoo Finance': 'finance.yahoo.com',
  Barron: 'barrons.com',
  Investopedia: 'investopedia.com',
  Forbes: 'forbes.com',
  'Business Insider': 'businessinsider.com',
  Fortune: 'fortune.com',
  'The Motley Fool': 'fool.com',
  Seeking: 'seekingalpha.com',
  Zacks: 'zacks.com',
  Benzinga: 'benzinga.com',
  Axios: 'axios.com',
  TechCrunch: 'techcrunch.com',
  Wired: 'wired.com',
};

export function getSourceDomain(source: string): string {
  for (const [key, domain] of Object.entries(SOURCE_DOMAINS)) {
    if (source.toLowerCase().includes(key.toLowerCase())) return domain;
  }
  // best-guess fallback: lowercase first word + .com
  const word = source.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${word}.com`;
}
