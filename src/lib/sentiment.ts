const POSITIVE = new Set([
  'rally', 'rallies', 'surge', 'surges', 'gain', 'gains', 'profit', 'profits', 'beat',
  'beats', 'record', 'rise', 'rises', 'jump', 'jumps', 'soar', 'soars', 'boost',
  'strong', 'stronger', 'bullish', 'upgrade', 'upgraded', 'outperform', 'outperforms',
  'win', 'wins', 'success', 'expand', 'expands', 'launch', 'launches', 'breakthrough',
  'innovation', 'deal', 'deals', 'acquire', 'acquisition', 'dividend', 'dividends',
  'approve', 'approved', 'growth', 'growing', 'increase', 'increases', 'positive',
  'better', 'best', 'higher', 'exceeds', 'exceeded', 'revenue', 'earnings', 'boom',
  'recovery', 'rebound', 'opportunity', 'invest',
]);

const NEGATIVE = new Set([
  'crash', 'crashes', 'fall', 'falls', 'drop', 'drops', 'loss', 'losses', 'miss',
  'misses', 'missed', 'decline', 'declines', 'plunge', 'plunges', 'tumble', 'tumbles',
  'warn', 'warns', 'warning', 'cut', 'cuts', 'layoff', 'layoffs', 'bankrupt',
  'bankruptcy', 'default', 'fear', 'fears', 'risk', 'risks', 'bearish', 'downgrade',
  'downgraded', 'underperform', 'fail', 'fails', 'failure', 'debt', 'recall', 'recalls',
  'suspend', 'suspended', 'investigate', 'investigation', 'fraud', 'fine', 'fined',
  'penalty', 'lower', 'weak', 'weaker', 'worse', 'worst', 'negative', 'concern',
  'concerns', 'crisis', 'collapse', 'collapses', 'slump', 'slumps', 'shrink', 'shrinks',
  'halt', 'halts', 'probe', 'lawsuit', 'sue', 'sued', 'sanctions', 'inflation',
]);

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  score: number;
  normalized: number;   // -1 to 1
  sentiment: Sentiment;
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/);
  let pos = 0;
  let neg = 0;
  for (const w of words) {
    if (POSITIVE.has(w)) pos++;
    if (NEGATIVE.has(w)) neg++;
  }
  const score = pos - neg;
  const total = pos + neg || 1;
  const normalized = Math.max(-1, Math.min(1, score / total));
  return {
    score,
    normalized,
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
  };
}

export function analyzeMultiple(texts: string[]): SentimentResult {
  if (!texts.length) return { score: 0, normalized: 0, sentiment: 'neutral' };
  const results = texts.map(analyzeSentiment);
  const avg = results.reduce((s, r) => s + r.normalized, 0) / results.length;
  return {
    score: results.reduce((s, r) => s + r.score, 0),
    normalized: avg,
    sentiment: avg > 0.1 ? 'positive' : avg < -0.1 ? 'negative' : 'neutral',
  };
}
