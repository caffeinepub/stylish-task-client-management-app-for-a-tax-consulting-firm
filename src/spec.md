# Specification

## Summary
**Goal:** Fix the single-task Add/Edit Task dialog to stop crashing, remove Client/Assignee dropdowns, and make all task fields optional during creation/editing.

**Planned changes:**
- Update the single Task create/edit dialog to remove the Client and Assignee dropdown/select controls and replace them with free-text inputs for Client Name and Assigned Name.
- Make all fields optional in the single Task create flow UI by removing required markers and HTML `required` validation (including Client Name, Task Category, and Sub Category), while keeping existing backend API calls unchanged.
- Fix the Add Task dialog crash by ensuring no Radix SelectItem uses an empty-string value and Select components in the task form never receive `""` as a controlled value (e.g., use a non-empty sentinel for “None” or avoid empty selection patterns).

**User-visible outcome:** Users can open the Create/Edit Task dialog without errors, type client/assignee names directly (no dropdowns), and submit tasks with any fields left blank without the UI crashing (showing a clear error only if the backend rejects the submission).
