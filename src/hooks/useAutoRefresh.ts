import { useEffect, useRef, useState } from 'react';
import { REFRESH_INTERVAL_MS } from '../lib/constants';

export function useAutoRefresh(refetch: () => void): { secondsUntilRefresh: number } {
  const totalSeconds = Math.round(REFRESH_INTERVAL_MS / 1000);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(totalSeconds);

  const lastFetchRef = useRef(Date.now());
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastFetchRef.current;
      const remaining = Math.max(0, Math.round((REFRESH_INTERVAL_MS - elapsed) / 1000));
      setSecondsUntilRefresh(remaining);

      if (elapsed >= REFRESH_INTERVAL_MS) {
        lastFetchRef.current = Date.now();
        setSecondsUntilRefresh(totalSeconds);
        refetchRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;

      const elapsed = Date.now() - lastFetchRef.current;
      if (elapsed >= REFRESH_INTERVAL_MS) {
        lastFetchRef.current = Date.now();
        setSecondsUntilRefresh(totalSeconds);
        refetchRef.current();
      } else {
        setSecondsUntilRefresh(Math.round((REFRESH_INTERVAL_MS - elapsed) / 1000));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [totalSeconds]);

  return { secondsUntilRefresh };
}
