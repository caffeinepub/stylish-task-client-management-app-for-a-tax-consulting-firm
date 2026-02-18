# Specification

## Summary
**Goal:** Fix the production blank screen by preventing actor initialization from reading/mutating the browser URL for `caffeineAdminToken` during startup.

**Planned changes:**
- Update `frontend/src/hooks/useActor.ts` to stop importing/calling `getSecretParameter('caffeineAdminToken')` (or any URL-reading helper that may trigger `history.replaceState`) and instead read the token only from `sessionStorage` via `getSessionParameter('caffeineAdminToken')`.
- Adjust actor initialization so `_initializeAccessControlWithSecret` is called only when a non-empty `caffeineAdminToken` exists in `sessionStorage` (do not call it with an empty string).
- Ensure `frontend/src/hooks/useDeferredUrlCleanup.ts` remains the only place that reads `caffeineAdminToken` from the URL and that it performs token capture + URL cleanup only after mount (in an effect), so initial render happens before any URL changes.

**User-visible outcome:** The app reliably loads (no startup freeze/blank screen) when opening routes directly (e.g., `/`, `/tasks`, `/dashboard`), regardless of whether the URL includes a `caffeineAdminToken` fragment; the token (if present) is captured after first paint and then removed from the address bar.
