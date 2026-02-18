# Specification

## Summary
**Goal:** Replace the application logo with the new CSWA Group of Companies branding and optimize data update performance to make mutations feel instant.

**Planned changes:**
- Replace all existing CSWA logo assets with the new user-provided logo image
- Update logo references in SignedOutScreen and AppLayout header
- Optimize React Query mutation hooks to use targeted cache invalidation instead of broad wildcards
- Add optimistic updates to task, client, and assignee mutations where safe
- Implement loading states and disable UI controls during mutation submission
- Add visual feedback (spinners, 'Saving...' text) to form dialogs during updates

**User-visible outcome:** Users see the new CSWA Group of Companies logo throughout the application and experience near-instant feedback when updating tasks, clients, or assignees with clear loading indicators during save operations.
