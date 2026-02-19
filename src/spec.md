# Specification

## Summary
**Goal:** Add searchable dropdown/select controls to improve usability when selecting from large lists of clients, task categories, assignees, and statuses.

**Planned changes:**
- Replace all dropdown selects in the Task create/edit dialog with searchable/filterable select components
- Add searchable select controls to the Tasks page filter controls for Client Name, Task Category, Sub Category, Assigned Name, and Status
- Replace the Client Name selector in the ClientDetailPage task list with a searchable select component
- Implement all searchable selects using Shadcn/Radix UI Combobox or Command components for consistency and accessibility

**User-visible outcome:** Users can type to search and filter options in all dropdown selects for clients, task categories, sub-categories, assignees, and statuses, making it easier to work with large lists.
