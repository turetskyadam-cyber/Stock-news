const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from',
  'as','is','was','are','were','be','been','have','has','had','do','does','did','will',
  'would','could','should','may','might','must','can','its','it','this','that','these',
  'those','than','then','so','if','up','out','no','not','over','after','into','also',
  'about','amid','says','said','say','new','more','now','just','get','got','set','back',
  'all','one','two','they','what','when','how','who','why','which','our','your','his',
  'her','we','us','make','take','made','well','some','still','first','while','share',
  'shares','stock','stocks','market','markets','year','years','quarter','report','week',
  'month','amid','amid','after','with','from','than','that','have','been','their',
  'will','year','said','million','billion','percent','rate','company','companies',
]);

export interface Keyword {
  word: string;
  count: number;
}

export function extractKeywords(texts: string[], topN = 24): Keyword[] {
  const freq = new Map<string, number>();
  for (const text of texts) {
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
    for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .filter(([, c]) => c >= 2) // must appear in at least 2 headlines
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}
