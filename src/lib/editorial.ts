import type { FinnhubNewsItem, SectorConfig } from '../types/news';
import { analyzeMultiple } from './sentiment';

// ---------------------------------------------------------------------------
// Adam's editorial voice. Everything here is generated client-side from the
// live headlines, so each sector reads like a short, confident take written by
// Adam — no backend or API key required.
// ---------------------------------------------------------------------------

export interface Forecast {
  stance: 'Bullish' | 'Bearish' | 'Neutral';
  glyph: string;
  conviction: 'High' | 'Moderate' | 'Building';
  confidence: number; // 0–100, for that "precise analyst" feel
  color: string;
}

export interface Editorial {
  overview: string;
  forecast: Forecast;
  watch: string | null; // a single ticker — "Adam's Watch" easter egg
}

// Small, stable daily mottos that rotate — a subtle brand easter egg.
const MOTTOS = [
  'Conviction over consensus.',
  'Early, never loud.',
  'Signal first. Noise never.',
  'Position, then patience.',
  'The tape rewards the prepared.',
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function dailyMotto(): string {
  return pick(MOTTOS, hash(new Date().toDateString()));
}

function topTickers(items: FinnhubNewsItem[], sector: SectorConfig): string[] {
  const counts = new Map<string, number>();
  const symbols = new Set(sector.symbols ?? []);
  for (const it of items) {
    const related = it.related ? it.related.split(',').filter(Boolean) : [];
    for (const t of related) {
      if (symbols.size === 0 || symbols.has(t)) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function getForecast(items: FinnhubNewsItem[]): Forecast {
  const s = analyzeMultiple(items.map((i) => i.headline));
  const n = s.normalized; // -1 … 1
  const mag = Math.abs(n);

  let stance: Forecast['stance'];
  let glyph: string;
  let color: string;
  if (n > 0.1) {
    stance = 'Bullish';
    glyph = '▲';
    color = '#34d399';
  } else if (n < -0.1) {
    stance = 'Bearish';
    glyph = '▼';
    color = '#fb7185';
  } else {
    stance = 'Neutral';
    glyph = '▬';
    color = '#94a3b8';
  }

  const conviction = mag > 0.45 ? 'High' : mag > 0.2 ? 'Moderate' : 'Building';
  const confidence = Math.round(58 + mag * 38); // ~58–96%

  return { stance, glyph, conviction, confidence, color };
}

function buildOverview(
  sector: SectorConfig,
  forecast: Forecast,
  tickers: string[],
  count: number,
  freshCount: number,
  seed: number
): string {
  const name = sector.label;

  const openers: Record<Forecast['stance'], string[]> = {
    Bullish: [
      `${name} is leaning green today, and I like what I'm seeing.`,
      `There's real momentum running through ${name} right now — the tape is working.`,
      `${name} is one of the brighter corners of the market this session.`,
    ],
    Bearish: [
      `${name} is under pressure today, and I'm not going to fight it.`,
      `It's a heavy session for ${name} — caution is the smart play here.`,
      `${name} is on the back foot today, so I'd keep some powder dry.`,
    ],
    Neutral: [
      `${name} is range-bound today — no need to force anything.`,
      `It's a wait-and-see session across ${name}.`,
      `${name} is quiet today, and quiet isn't always a bad thing.`,
    ],
  };

  let driver: string;
  if (tickers.length >= 2) {
    driver = `Most of the conversation is centered on ${tickers[0]} and ${tickers[1]}.`;
  } else if (tickers.length === 1) {
    driver = `${tickers[0]} is doing most of the talking.`;
  } else {
    driver = `Coverage is broad rather than concentrated on any one name.`;
  }

  const freshNote =
    freshCount >= 3
      ? ` ${freshCount} of them landed in just the last few hours.`
      : '';
  const volume = `I've had ${count} stories cross my desk for this one.${freshNote}`;

  const closers: Record<Forecast['stance'], string[]> = {
    Bullish: [
      `This is where I'd be paying attention.`,
      `I'd rather be early here than late.`,
      `Worth leaning in — carefully.`,
    ],
    Bearish: [
      `I'd let this one come to me.`,
      `Protect capital first; the opportunities will come.`,
      `Respect the trend and stay nimble.`,
    ],
    Neutral: [
      `I'm watching, not chasing.`,
      `Patience tends to pay here.`,
      `No edge yet — and that's fine.`,
    ],
  };

  return [
    pick(openers[forecast.stance], seed),
    `${driver} ${volume}`,
    pick(closers[forecast.stance], seed >> 2),
  ].join(' ');
}

export function getEditorial(items: FinnhubNewsItem[], sector: SectorConfig): Editorial {
  const forecast = getForecast(items);
  const tickers = topTickers(items, sector);
  const nowSec = Date.now() / 1000;
  const freshCount = items.filter((i) => nowSec - i.datetime < 6 * 3600).length;
  const seed = hash(sector.key + new Date().toDateString());

  return {
    overview: buildOverview(sector, forecast, tickers, items.length, freshCount, seed),
    forecast,
    watch: tickers[0] ?? null,
  };
}

/** One-line take for the briefing — punchy, sector-aware. */
export function briefingLine(items: FinnhubNewsItem[], sector: SectorConfig): string {
  const f = getForecast(items);
  const tickers = topTickers(items, sector);
  const lead = tickers[0];
  const seed = hash('brief' + sector.key + new Date().toDateString());

  const lines: Record<Forecast['stance'], string[]> = {
    Bullish: [
      `Strength here${lead ? `, led by ${lead}` : ''} — I'm constructive.`,
      `The bid is real${lead ? `; ${lead} is carrying it` : ''}.`,
    ],
    Bearish: [
      `Heavy tape${lead ? `, ${lead} in focus` : ''} — staying defensive.`,
      `Pressure is building${lead ? ` around ${lead}` : ''}; patience.`,
    ],
    Neutral: [
      `Balanced${lead ? `, with ${lead} in the headlines` : ''} — watching closely.`,
      `No clear edge yet${lead ? `; eyes on ${lead}` : ''}.`,
    ],
  };
  return pick(lines[f.stance], seed);
}
