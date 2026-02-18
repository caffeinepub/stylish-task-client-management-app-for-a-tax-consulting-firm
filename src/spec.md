# Specification

## Summary
**Goal:** Add Sub Category analytics to the Dashboard with drill-down into filtered Tasks, and enable inline Comment editing directly in the Tasks table.

**Planned changes:**
- Extend the Dashboard with three new Sub Category breakdown sections: Revenue by Sub Category (sum of Bill, treating missing/null as 0), Tasks by Sub Category (count), and a combined Category + Sub Category table (count + total revenue), each sorted descending by its primary metric and showing a clear English empty state when no data.
- Add row click drill-down from the new Dashboard tables to `/tasks` using route search params: `subCategory` alone, or `taskCategory` + `subCategory` for the combined table.
- Update `/tasks` route search-param validation to defensively accept `subCategory` (string only) and update Tasks page filtering to apply `subCategory` when present.
- Add inline editing for the Comment column in the Tasks list table with Save/Cancel, saving via existing task update APIs, including row-level loading state, clear English error messaging, retry support, and allowing clearing the comment to empty.

**User-visible outcome:** Users can view new Sub Category analytics on the Dashboard, click rows to jump into the Tasks page with Sub Category (and optionally Category) filters applied, and edit a task’s Comment inline in the Tasks table without opening the edit dialog.
