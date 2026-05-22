import { useState } from 'react';
import { getSourceDomain } from '../../lib/utils';

interface FaviconImageProps {
  source: string;
}

export function FaviconImage({ source }: FaviconImageProps) {
  const [failed, setFailed] = useState(false);
  const domain = getSourceDomain(source);
  const letter = source.charAt(0).toUpperCase();

  if (failed) {
    return (
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[8px] font-bold text-white/80 dark:bg-white/20 dark:text-white/80">
        {letter}
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt={source}
      width={16}
      height={16}
      className="h-4 w-4 flex-shrink-0 rounded-sm object-contain"
      onError={() => setFailed(true)}
    />
  );
}
