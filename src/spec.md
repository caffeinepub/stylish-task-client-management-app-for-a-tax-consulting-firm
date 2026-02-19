# Specification

## Summary
**Goal:** Fix production application loading failure that causes blank screen after deployment.

**Planned changes:**
- Diagnose and resolve production loading failure causing app to remain stuck on blank screen or 'Loading...' state
- Add enhanced error logging during application startup to capture router initialization, actor creation, and authentication state
- Verify useDeferredUrlCleanup hook executes once without causing infinite loops or interfering with router initialization
- Harden actor creation logic to eliminate 'agent and agentOptions both passed' warnings and handle missing/invalid admin tokens gracefully
- Ensure AppStartupErrorBoundary catches all initialization errors and displays StartupErrorScreen
- Test production build locally with production-like server configuration before deployment

**User-visible outcome:** Production application loads successfully, renders all routes without blank screens, and displays clear error messages if startup issues occur.
