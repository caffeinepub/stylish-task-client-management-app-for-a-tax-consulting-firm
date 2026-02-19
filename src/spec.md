# Specification

## Summary
**Goal:** Fix the auto-population of Completion Date when tasks are marked as Completed, ensuring valid dates are displayed instead of "Invalid Date".

**Planned changes:**
- Fix backend Task update logic to automatically set completionDate to Time.now() when status changes to 'Completed'
- Verify frontend task update mutations send complete payloads including status field to enable backend detection of status transitions
- Add defensive date validation in frontend utilities to handle null, invalid, or out-of-range timestamps gracefully

**User-visible outcome:** When users mark a task as Completed, the Completion Date field automatically populates with a valid, readable date instead of showing "Invalid Date" or remaining empty.
