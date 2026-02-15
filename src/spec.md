# Specification

## Summary
**Goal:** Fix the TanStack Router initial-load blank-screen crash by making app/router bootstrap safe (no early URL mutation), hardening startup queries/validation, and adding a top-level error fallback.

**Planned changes:**
- Prevent URL mutation (e.g., history.replaceState triggered by admin-token parsing) during initial bootstrap so the root route can render at least once before any URL cleanup occurs.
- Make root initialization resilient by guarding current-user-profile fetching so it cannot throw/crash when unauthenticated or when actor/identity is not ready.
- Harden `/tasks` route `validateSearch` to be fully defensive against missing/malformed/unexpected search param shapes and return safe defaults.
- Add a top-level user-visible error fallback (error screen with plain-English message + reload action) to avoid fully blank pages on unexpected startup errors.

**User-visible outcome:** Loading the app at `/`, `/dashboard`, `/tasks`, or `/clients` reliably renders either the Signed Out screen or the authenticated layout (with existing loading states as needed) without blank screens or requiring a hard refresh; unexpected startup errors show an error screen with a reload option.
