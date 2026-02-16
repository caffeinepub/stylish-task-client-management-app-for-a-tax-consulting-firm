# Specification

## Summary
**Goal:** Fix the Tasks page so editing a task works reliably and task sorting correctly supports client-wise and assignee-wise ordering.

**Planned changes:**
- Repair the single-task edit flow: ensure the Edit action opens the TaskFormDialog in “Edit Task” mode, pre-fills fields from the selected task (including optional fields), and saves via the existing updateTask API.
- Ensure the Tasks table updates immediately after a successful edit (no manual refresh required) and displays an error message in the dialog if the update fails.
- Update the Tasks page sorting UI/logic to include “Client Name” and “Assignee” sort options and apply the selected sort (including direction toggle) to reorder the visible task table, handling missing assignedName consistently.

**User-visible outcome:** Users can click Edit on any task to modify it in a pre-filled dialog and see changes reflected immediately, and they can sort tasks by Client Name or Assignee (with ascending/descending) directly in the Tasks page.
