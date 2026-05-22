import { useState } from 'react';

// Maps stock symbols → company domains for Clearbit logo API
const SYMBOL_DOMAINS: Record<string, string> = {
  AAPL:  'apple.com',
  MSFT:  'microsoft.com',
  NVDA:  'nvidia.com',
  GOOGL: 'google.com',
  META:  'meta.com',
  AMD:   'amd.com',
  XOM:   'exxonmobil.com',
  CVX:   'chevron.com',
  COP:   'conocophillips.com',
  SLB:   'slb.com',
  OXY:   'oxy.com',
  BP:    'bp.com',
  JNJ:   'jnj.com',
  PFE:   'pfizer.com',
  UNH:   'unitedhealthgroup.com',
  ABBV:  'abbvie.com',
  MRK:   'merck.com',
  LLY:   'lilly.com',
  JPM:   'jpmorganchase.com',
  BAC:   'bankofamerica.com',
  GS:    'goldmansachs.com',
  MS:    'morganstanley.com',
  WFC:   'wellsfargo.com',
  BLK:   'blackrock.com',
  AMZN:  'amazon.com',
  TSLA:  'tesla.com',
  NKE:   'nike.com',
  HD:    'homedepot.com',
  MCD:   'mcdonalds.com',
  SBUX:  'starbucks.com',
  GE:    'ge.com',
  CAT:   'caterpillar.com',
  BA:    'boeing.com',
  HON:   'honeywell.com',
  UPS:   'ups.com',
  DE:    'deere.com',
};

export function getSymbolDomain(related: string): string | null {
  const symbol = related?.split(',')[0].trim().toUpperCase();
  return SYMBOL_DOMAINS[symbol] ?? null;
}

interface CompanyBannerProps {
  related: string;
  gradientFrom: string;
  gradientTo: string;
  featured?: boolean;
}

export function CompanyBanner({ related, gradientFrom, gradientTo, featured }: CompanyBannerProps) {
  const [logoError, setLogoError] = useState(false);
  const domain = getSymbolDomain(related);
  const symbol = related?.split(',')[0].trim().toUpperCase();
  const height = featured ? 'pb-[32%]' : 'pb-[26%]';

  return (
    <div
      className={`relative overflow-hidden ${height}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}55 0%, ${gradientTo}20 60%, transparent 100%)`,
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {domain && !logoError ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-lg dark:bg-white/90">
              <img
                src={`https://logo.clearbit.com/${domain}`}
                alt={symbol}
                className="h-10 w-10 rounded-xl object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/70 backdrop-blur-sm dark:text-white/70 text-black/50">
              {symbol}
            </span>
          </div>
        ) : (
          /* Source-based fallback */
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="h-10 w-10 rounded-2xl bg-white/20" />
            <span className="text-[9px] font-bold tracking-widest text-white/60 dark:text-white/60 text-black/40">
              {symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
