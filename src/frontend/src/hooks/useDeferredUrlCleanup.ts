import { useEffect } from 'react';
import { readSecretFromHashNonMutating, storeSessionParameter, clearParamFromHash } from '../utils/urlParams';

/**
 * Hook that performs deferred URL cleanup for secret parameters
 * This hook captures secret parameters from the URL and stores them in sessionStorage,
 * then removes them from the URL in a post-mount effect to prevent router initialization hangs
 * 
 * MUST be called from a mounted component (e.g., RootComponent in App.tsx)
 * to ensure cleanup happens only after the router has fully initialized
 */
export function useDeferredUrlCleanup() {
  useEffect(() => {
    // Read caffeineAdminToken from URL without mutating
    const token = readSecretFromHashNonMutating('caffeineAdminToken');
    
    if (token) {
      // Store in sessionStorage for actor initialization
      storeSessionParameter('caffeineAdminToken', token);
      
      // Clean up URL in post-mount effect (safe for router)
      clearParamFromHash('caffeineAdminToken');
    }
  }, []); // Run once on mount
}
