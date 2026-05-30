import type { FinnhubNewsItem, SectorKey } from '../types/news';

/**
 * Demo fallback content.
 *
 * Shown only when no Marketaux API key is configured (VITE_MARKETAUX_KEY),
 * so the site looks like a populated, photo-rich news app out of the box.
 * The moment a real key is added, live articles replace all of this.
 *
 * Images are royalty-free Unsplash photos (free to hot-link).
 */

export function hasApiKey(): boolean {
  const key = import.meta.env.VITE_MARKETAUX_KEY as string | undefined;
  return Boolean(key && key.trim() && key !== 'your_marketaux_api_key_here');
}

interface DemoSeed {
  headline: string;
  summary: string;
  source: string;
  image: string;
  related: string;
  /** hours ago */
  ago: number;
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const SEEDS: Record<SectorKey, DemoSeed[]> = {
  technology: [
    {
      headline: 'Nvidia extends AI rally as data-center demand outpaces supply',
      summary:
        'Chipmaker says hyperscaler orders remain booked out for the next several quarters, with new accelerator shipments ramping into year-end.',
      source: 'Reuters',
      image: UNSPLASH('photo-1518770660439-4636190af475'),
      related: 'NVDA',
      ago: 1,
    },
    {
      headline: 'Apple unveils on-device AI features in latest software update',
      summary:
        'The company is pushing more generative models directly onto its silicon, sidestepping cloud costs and addressing privacy concerns.',
      source: 'CNBC',
      image: UNSPLASH('photo-1611532736597-de2d4265fba3'),
      related: 'AAPL',
      ago: 3,
    },
    {
      headline: 'Microsoft cloud revenue beats as Azure AI workloads accelerate',
      summary:
        'Commercial bookings climbed sharply on enterprise adoption of Copilot, lifting the stock in after-hours trading.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1633419461186-7d40a38105ec'),
      related: 'MSFT',
      ago: 5,
    },
    {
      headline: 'AMD launches next-gen accelerators to challenge AI chip lead',
      summary:
        'New parts target inference workloads at lower power, with cloud partners lined up for early deployments.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1591488320449-011701bb6704'),
      related: 'AMD',
      ago: 8,
    },
    {
      headline: 'Meta ramps capital spending on AI infrastructure buildout',
      summary:
        'Executives defended the outlay, framing custom silicon and new data centers as central to the long-term roadmap.',
      source: 'The Wall Street Journal',
      image: UNSPLASH('photo-1562408590-e32931084e23'),
      related: 'META',
      ago: 11,
    },
    {
      headline: 'Alphabet search and cloud both top estimates in latest quarter',
      summary:
        'Ad resilience and momentum in cloud helped the company deliver a broad earnings beat.',
      source: 'Yahoo Finance',
      image: UNSPLASH('photo-1573804633927-bfcbcd909acd'),
      related: 'GOOGL',
      ago: 14,
    },
  ],
  energy: [
    {
      headline: 'Oil steadies as traders weigh supply cuts against demand outlook',
      summary:
        'Crude held near recent ranges as the market balanced producer discipline with signs of softer global growth.',
      source: 'Reuters',
      image: UNSPLASH('photo-1605000797499-95a51c5269ae'),
      related: 'XOM',
      ago: 2,
    },
    {
      headline: 'ExxonMobil lifts buybacks on strong cash flow',
      summary:
        'The supermajor returned more to shareholders as upstream volumes and refining margins held up.',
      source: 'CNBC',
      image: UNSPLASH('photo-1473341304170-971dccb5ac1e'),
      related: 'XOM',
      ago: 6,
    },
    {
      headline: 'Chevron advances LNG projects amid global demand shift',
      summary:
        'Management highlighted long-dated supply agreements underpinning new export capacity.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1466611653911-95081537e5b7'),
      related: 'CVX',
      ago: 9,
    },
    {
      headline: 'Renewables investment hits record as utilities pivot',
      summary:
        'Grid-scale solar and storage led new commitments, with policy incentives accelerating timelines.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1509391366360-2e959784a276'),
      related: 'COP',
      ago: 13,
    },
  ],
  healthcare: [
    {
      headline: 'Eli Lilly raises outlook as weight-loss drug demand surges',
      summary:
        'Capacity expansions are underway to meet booming prescriptions for its metabolic franchise.',
      source: 'Reuters',
      image: UNSPLASH('photo-1631549916768-4119b2e5f926'),
      related: 'LLY',
      ago: 2,
    },
    {
      headline: 'Pfizer advances late-stage pipeline after restructuring',
      summary:
        'The drugmaker outlined cost cuts and several catalysts expected to read out over the coming year.',
      source: 'CNBC',
      image: UNSPLASH('photo-1576091160550-2173dba999ef'),
      related: 'PFE',
      ago: 7,
    },
    {
      headline: 'UnitedHealth reaffirms guidance despite cost pressures',
      summary:
        'Executives pointed to membership growth and care-management initiatives offsetting medical inflation.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1505751172876-fa1923c5c528'),
      related: 'UNH',
      ago: 10,
    },
    {
      headline: 'Merck oncology data lifts long-term sales view',
      summary:
        'New trial results support label expansions for its flagship immunotherapy.',
      source: 'Yahoo Finance',
      image: UNSPLASH('photo-1579165466741-7f35e4755660'),
      related: 'MRK',
      ago: 15,
    },
  ],
  finance: [
    {
      headline: 'JPMorgan posts record net interest income on resilient lending',
      summary:
        'The bank flagged healthy consumer balance sheets while setting aside reserves for a softer outlook.',
      source: 'Reuters',
      image: UNSPLASH('photo-1564514271935-f31f0fb0d8a5'),
      related: 'JPM',
      ago: 1,
    },
    {
      headline: 'Goldman Sachs trading desk drives earnings beat',
      summary:
        'Volatility across rates and currencies boosted markets revenue, offsetting a slower dealmaking backdrop.',
      source: 'CNBC',
      image: UNSPLASH('photo-1486406146926-c627a92ad1ab'),
      related: 'GS',
      ago: 4,
    },
    {
      headline: 'BlackRock assets hit new high as inflows accelerate',
      summary:
        'ETF demand and institutional mandates pushed total assets under management to a fresh record.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1554224155-6726b3ff858f'),
      related: 'BLK',
      ago: 9,
    },
    {
      headline: 'Bank of America lifts deposit outlook amid rate shifts',
      summary:
        'The lender pointed to sticky retail deposits as a buffer against margin pressure.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1601597111158-2fceff292cdc'),
      related: 'BAC',
      ago: 12,
    },
  ],
  consumer: [
    {
      headline: 'Amazon cloud and ads power another quarter of margin expansion',
      summary:
        'Operating income climbed as the retail-and-cloud giant balanced cost discipline with AI investment.',
      source: 'Reuters',
      image: UNSPLASH('photo-1523474253046-8cd2748b5fd2'),
      related: 'AMZN',
      ago: 2,
    },
    {
      headline: 'Tesla deliveries beat as price cuts spur demand',
      summary:
        'Volume gains came at the expense of margins, with the automaker betting on scale and software.',
      source: 'CNBC',
      image: UNSPLASH('photo-1560958089-b8a1929cea89'),
      related: 'TSLA',
      ago: 5,
    },
    {
      headline: 'Starbucks rolls out loyalty revamp to reignite traffic',
      summary:
        'The chain is leaning on personalization and new beverages to win back occasional customers.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1453614512568-c4024d13c247'),
      related: 'SBUX',
      ago: 8,
    },
    {
      headline: 'Nike resets inventory as demand normalizes',
      summary:
        'Management said cleaner channels position the brand for healthier full-price selling ahead.',
      source: 'Yahoo Finance',
      image: UNSPLASH('photo-1542291026-7eec264c27ff'),
      related: 'NKE',
      ago: 13,
    },
  ],
  industrials: [
    {
      headline: 'Caterpillar backlog stays elevated on infrastructure spending',
      summary:
        'Construction and energy-related demand supported orders despite a mixed macro picture.',
      source: 'Reuters',
      image: UNSPLASH('photo-1581094794329-c8112a89af12'),
      related: 'CAT',
      ago: 3,
    },
    {
      headline: 'Boeing steadies production as deliveries pick up',
      summary:
        'The planemaker reiterated quality milestones while working through its order book.',
      source: 'CNBC',
      image: UNSPLASH('photo-1436491865332-7a61a109cc05'),
      related: 'BA',
      ago: 6,
    },
    {
      headline: 'GE Aerospace lifts forecast on strong engine services',
      summary:
        'Aftermarket demand from rising flight hours boosted the company’s outlook.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1517058151321-1b994a47e7c0'),
      related: 'GE',
      ago: 10,
    },
    {
      headline: 'UPS volumes stabilize as e-commerce shipping firms up',
      summary:
        'Pricing discipline and network efficiency helped offset softer parcel trends.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      related: 'UPS',
      ago: 14,
    },
  ],
  crypto: [
    {
      headline: 'Bitcoin holds gains as spot ETF inflows continue',
      summary:
        'Steady institutional demand through regulated funds supported prices near recent highs.',
      source: 'Reuters',
      image: UNSPLASH('photo-1621761191319-c6fb62004040'),
      related: 'COIN',
      ago: 1,
    },
    {
      headline: 'Coinbase revenue climbs on trading and custody growth',
      summary:
        'Higher activity and subscription services lifted results for the exchange operator.',
      source: 'CNBC',
      image: UNSPLASH('photo-1518546305927-5a555bb7020d'),
      related: 'COIN',
      ago: 4,
    },
    {
      headline: 'MicroStrategy expands bitcoin holdings in latest purchase',
      summary:
        'The company added to its treasury position, reaffirming its long-term thesis.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1639762681485-074b7f938ba0'),
      related: 'MSTR',
      ago: 9,
    },
    {
      headline: 'Miners ramp capacity ahead of network upgrades',
      summary:
        'Operators highlighted efficiency improvements as they scale hashrate.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1605792657660-596af9009e82'),
      related: 'RIOT',
      ago: 12,
    },
  ],
  general: [
    {
      headline: 'Stocks edge higher as markets weigh rate path and earnings',
      summary:
        'Indexes drifted up amid a steady stream of corporate results and cooling inflation signals.',
      source: 'Reuters',
      image: UNSPLASH('photo-1611974789855-9c2a0a7236a3'),
      related: '',
      ago: 1,
    },
    {
      headline: 'Treasury yields ease as investors recalibrate Fed expectations',
      summary:
        'Bond markets reflected growing bets on a gradual easing cycle into next year.',
      source: 'Bloomberg',
      image: UNSPLASH('photo-1590283603385-17ffb3a7f29f'),
      related: '',
      ago: 4,
    },
    {
      headline: 'Dollar steadies as global growth data comes in mixed',
      summary:
        'Currency markets stayed range-bound ahead of a busy week of central-bank commentary.',
      source: 'CNBC',
      image: UNSPLASH('photo-1526304640581-d334cdbbf45e'),
      related: '',
      ago: 7,
    },
    {
      headline: 'Earnings season delivers broad beats across sectors',
      summary:
        'Cost control and resilient demand helped a majority of companies top estimates.',
      source: 'MarketWatch',
      image: UNSPLASH('photo-1535320903710-d993d3d77d29'),
      related: '',
      ago: 10,
    },
    {
      headline: 'Investors rotate into quality as volatility ticks up',
      summary:
        'Flows favored profitable large caps amid an uncertain macro backdrop.',
      source: 'Yahoo Finance',
      image: UNSPLASH('photo-1559526324-4b87b5e36e44'),
      related: '',
      ago: 13,
    },
  ],
};

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getDemoItems(sectorKey: SectorKey): FinnhubNewsItem[] {
  const seeds = SEEDS[sectorKey] ?? SEEDS.general;
  const nowSec = Math.floor(Date.now() / 1000);
  return seeds.map((s) => ({
    id: hashId(s.headline),
    headline: s.headline,
    summary: s.summary,
    url: '#',
    image: s.image,
    source: s.source,
    datetime: nowSec - s.ago * 3600,
    category: sectorKey,
    related: s.related,
  }));
}
