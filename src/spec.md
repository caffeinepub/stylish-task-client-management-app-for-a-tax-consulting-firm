# Specification

## Summary
**Goal:** Add assignee-wise sorting to the Tasks list alongside existing sort options.

**Planned changes:**
- Update `frontend/src/utils/taskSort.ts` to add an assignee sort field (e.g., `assignedName`) to the sort field type/labels and implement sorting by `Task.assignedName` using the existing null-safe, case-insensitive string comparison (missing/empty values sort last).
- Update `frontend/src/pages/TasksPage.tsx` to include the new "Assignee" option in the “Sort by” select and apply it to the rendered task ordering.
- Ensure all existing sort options (Due Date, Status, Task Category, Client Name, Bill Amount, Created At) continue working unchanged.

**User-visible outcome:** Users can sort the Tasks list by assignee name from the “Sort by” control, in addition to the current sorting options.
