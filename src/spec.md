# Specification

## Summary
**Goal:** Add a Todo List feature with full CRUD operations and display captain names alongside assignee names in all task views.

**Planned changes:**
- Add Todo List management with create, read, update, delete operations scoped per authenticated user
- Add bulk operations for todos including CSV upload/download and bulk delete
- Display captain name after assignee (team) name in all task result views (tasks table, task details, client detail page, dashboard widgets, Excel exports)
- Extend backend to resolve and include captain names in task query responses by matching assignedName against existing Assignees records

**User-visible outcome:** Users can manage their personal todo lists with full CRUD and bulk operations. In all task views, users will see both the team name and captain name displayed together (e.g., "Team Name (Captain: Captain Name)") for better task assignment visibility.
