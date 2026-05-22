export interface FinnhubNewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export type SectorKey =
  | 'technology'
  | 'energy'
  | 'healthcare'
  | 'finance'
  | 'consumer'
  | 'industrials'
  | 'crypto'
  | 'general';

export interface SectorConfig {
  key: SectorKey;
  label: string;
  icon: string;
  symbols?: string[];
  category?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SectorNewsState {
  items: FinnhubNewsItem[];
  status: FetchStatus;
  error: string | null;
  lastUpdated: Date | null;
}
