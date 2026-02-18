# Specification

## Summary
**Goal:** Prevent the CSWA Task Manager frontend from hanging on the startup “Loading...” screen by deferring caffeineAdminToken URL handling until after mount and using sessionStorage during actor initialization.

**Planned changes:**
- Update `useActor` so actor initialization does not read or mutate the browser URL (and does not call any helper that can trigger `history.replaceState`) during the `useQuery` `queryFn`.
- Change actor initialization to read `caffeineAdminToken` only from sessionStorage and call `_initializeAccessControlWithSecret` only when a non-empty, non-whitespace token exists.
- Make `readSecretFromHashNonMutating('caffeineAdminToken')` reliably parse tokens from both `#caffeineAdminToken=<token>` and `#/route?caffeineAdminToken=<token>` hash styles without mutating the URL and returning `null` safely when missing/malformed.
- Ensure `useDeferredUrlCleanup` is the only code path that reads `caffeineAdminToken` from `window.location`, captures it post-mount, persists it to sessionStorage, and then clears it from the address bar without reload.

**User-visible outcome:** Visiting the app with a URL containing `#caffeineAdminToken=<token>` no longer gets stuck on “Loading...”; the app loads the root route reliably, and the token is captured after mount and then removed from the URL while authenticated behavior continues to work as before.
