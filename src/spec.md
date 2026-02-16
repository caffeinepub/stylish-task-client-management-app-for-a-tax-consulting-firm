# Specification

## Summary
**Goal:** Fix the Task create/edit dialog crash caused by Radix Select receiving an empty-string or invalid status value.

**Planned changes:**
- In `frontend/src/components/tasks/TaskFormDialog.tsx`, normalize task status when initializing edit-mode form state so empty-string/whitespace/missing/unknown values map to the existing non-empty `STATUS_NONE_SENTINEL` (`"__none__"`), never `""`.
- Ensure the Status `<Select>` is never controlled with `""`, and no `Select.Item` uses `value=""` in the task edit flow.
- On submit, when the sentinel (“None”) is selected, send `status: null` to clear status instead of sending an empty string.

**User-visible outcome:** Users can open and use the Edit Task dialog even for tasks that have an empty/invalid stored status, without the page crashing, and can clear status safely via the “None” option.
