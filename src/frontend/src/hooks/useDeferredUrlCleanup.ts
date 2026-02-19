import { useEffect, useRef } from 'react';

/**
 * Hook that extracts the caffeineAdminToken from URL hash and stores it in sessionStorage
 * The URL cleanup is deferred to ensure router initialization completes first
 */
export function useDeferredUrlCleanup() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      console.log('[useDeferredUrlCleanup] Already executed, skipping');
      return;
    }
    hasRun.current = true;

    console.log('[useDeferredUrlCleanup] Starting URL cleanup');
    console.log('[useDeferredUrlCleanup] Current URL:', window.location.href);

    try {
      // Read the token from hash without mutating the URL yet
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const hashContent = hash.substring(1);
        const params = new URLSearchParams(hashContent);
        const token = params.get('caffeineAdminToken');
        
        if (token) {
          console.log('[useDeferredUrlCleanup] Admin token found, storing in sessionStorage');
          sessionStorage.setItem('caffeineAdminToken', token);

          // Clean up the URL after a short delay to ensure router has initialized
          const timeoutId = setTimeout(() => {
            const urlBefore = window.location.href;
            console.log('[useDeferredUrlCleanup] Cleaning URL hash');
            
            // Remove the token from the hash
            if (!window.history.replaceState) {
              console.warn('[useDeferredUrlCleanup] history.replaceState not available');
              return;
            }

            const currentHash = window.location.hash;
            if (!currentHash || currentHash.length <= 1) {
              return;
            }

            const currentHashContent = currentHash.substring(1);
            const queryStartIndex = currentHashContent.indexOf('?');

            if (queryStartIndex === -1) {
              return;
            }

            const routePath = currentHashContent.substring(0, queryStartIndex);
            const queryString = currentHashContent.substring(queryStartIndex + 1);

            const currentParams = new URLSearchParams(queryString);
            currentParams.delete('caffeineAdminToken');

            const newQueryString = currentParams.toString();
            let newHash = routePath;

            if (newQueryString) {
              newHash += '?' + newQueryString;
            }

            const newUrl = window.location.pathname + window.location.search + (newHash ? '#' + newHash : '');
            window.history.replaceState(null, '', newUrl);
            
            const urlAfter = window.location.href;
            console.log('[useDeferredUrlCleanup] URL cleaned', { urlBefore, urlAfter });
          }, 100);

          return () => {
            console.log('[useDeferredUrlCleanup] Cleanup function called');
            clearTimeout(timeoutId);
          };
        } else {
          console.log('[useDeferredUrlCleanup] No admin token in URL hash');
        }
      } else {
        console.log('[useDeferredUrlCleanup] No hash in URL');
      }
    } catch (error) {
      console.error('[useDeferredUrlCleanup] Error during URL cleanup:', error);
    }
  }, []);
}
