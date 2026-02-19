# Specification

## Summary
**Goal:** Enable users to edit all task fields when performing bulk updates on multiple tasks.

**Planned changes:**
- Expand the bulk edit dialog to include form fields for all editable task properties (Client Name, Task Category, Sub Category, Status, Comment, Assigned Name, Due Date, Assignment Date, Completion Date, Bill, Advance Received, Outstanding Amount, Payment Status)
- Update backend bulk update API to accept partial updates for all task fields
- Ensure each field in the bulk edit form remains optional with an 'Unchanged' default value
- Wire the expanded form submission to the backend mutation with proper data type handling

**User-visible outcome:** Users can now selectively update any combination of task fields across multiple selected tasks in a single bulk edit operation, with unchanged fields preserving their existing values.
