# Specification

## Summary
**Goal:** Auto-populate Assignment Date and Completion Date based on task state changes.

**Planned changes:**
- Update backend Task update logic to automatically set assignmentDate when a task is assigned to a user (assignedName transitions from null/empty to non-empty)
- Update backend Task update logic to automatically set completionDate when task status is changed to 'Completed'
- Ensure frontend task update mutations send complete task payloads to enable reliable state transition detection
- Auto-population only occurs when dates are not already set (no overwriting existing dates)

**User-visible outcome:** When users assign a task or mark it as completed, the assignment and completion dates are automatically recorded without manual input.
