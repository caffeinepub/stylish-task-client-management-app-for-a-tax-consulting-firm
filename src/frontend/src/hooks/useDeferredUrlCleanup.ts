import { useEffect } from 'react';
import { flushPendingUrlCleanups } from '../utils/urlParams';

/**
 * Hook that flushes pending URL cleanups after the component has mounted
 * This ensures URL cleanup happens after the router has initialized
 */
export function useDeferredUrlCleanup() {
  useEffect(() => {
    // Defer cleanup to next tick to ensure router is fully initialized
    const timeoutId = setTimeout(() => {
      flushPendingUrlCleanups();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);
}
