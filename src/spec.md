# Specification

## Summary
**Goal:** Build a stylish, authenticated (Internet Identity) single-tenant task + client management app for a tax consulting workflow, with per-principal data storage and a responsive UI.

**Planned changes:**
- Add Internet Identity authentication gating (sign-in required to view/manage any clients or tasks) and sign-out behavior.
- Implement a single Motoko actor backend with per-principal persistence and full CRUD for Clients and Tasks, including task listing by clientId and basic task filtering (status, due date range).
- Build responsive Clients UI (list with search + status filter, create/edit/delete forms, client detail with embedded task list).
- Build responsive Tasks UI (list with status/priority filters, sort by due date, create/edit/delete with client assignment, quick inline status changes, overdue visual indicator).
- Add a dashboard showing key metrics (active clients, open tasks, overdue tasks, tasks due in next 7 days) with links to filtered views.
- Wire frontend data fetching/mutations via React Query with loading, empty, and error+retry states and cache invalidation on mutations.
- Apply a coherent visual theme (avoid blue/purple as primary colors) consistently across navigation, typography, spacing, and interactive states.
- Generate and integrate static brand imagery from `frontend/public/assets/generated` (brand mark in header; subtle dashboard banner).

**User-visible outcome:** After signing in with Internet Identity, a user can manage their own clients and tasks (create, view, edit, delete), see a dashboard overview with actionable metrics, and use a polished, responsive interface with consistent styling and embedded brand imagery.
