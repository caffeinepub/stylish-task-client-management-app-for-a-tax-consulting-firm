import { useEffect } from "react";

/**
 * Hook that extracts caffeineAdminToken from URL hash, stores it in sessionStorage,
 * and cleans the URL after a short delay to prevent flash of modified URL.
 */
export function useDeferredUrlCleanup() {
  useEffect(() => {
    console.log("🧹 [useDeferredUrlCleanup] Starting URL cleanup process");

    try {
      const hash = window.location.hash;
      console.log("🧹 [useDeferredUrlCleanup] Current hash:", hash);

      if (hash?.includes("caffeineAdminToken=")) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get("caffeineAdminToken");

        if (token) {
          console.log(
            "🧹 [useDeferredUrlCleanup] Found caffeineAdminToken, storing in sessionStorage",
          );
          sessionStorage.setItem("caffeineAdminToken", token);
        }

        // Clean URL after a short delay
        const timeoutId = setTimeout(() => {
          console.log("🧹 [useDeferredUrlCleanup] Cleaning URL hash");

          try {
            // Remove the hash entirely
            const newUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, "", newUrl);
            console.log("🧹 [useDeferredUrlCleanup] URL cleaned successfully");
          } catch (error) {
            console.error(
              "🧹 [useDeferredUrlCleanup] Error cleaning URL:",
              error,
            );
          }
        }, 100);

        return () => {
          console.log("🧹 [useDeferredUrlCleanup] Cleanup: clearing timeout");
          clearTimeout(timeoutId);
        };
      }
      console.log(
        "🧹 [useDeferredUrlCleanup] No caffeineAdminToken found in hash",
      );
    } catch (error) {
      console.error(
        "🧹 [useDeferredUrlCleanup] Error during URL cleanup:",
        error,
      );
    }
  }, []);
}
