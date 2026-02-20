# Specification

## Summary
**Goal:** Optimize task loading performance to reduce load times when displaying 116+ tasks.

**Planned changes:**
- Implement pagination or virtual scrolling for the task list to load tasks in batches (20-50 at a time)
- Replace generic loading spinner with skeleton UI that shows progressive rendering of task items
- Optimize backend getAllTasks query and captain details lookup to avoid N+1 query pattern
- Configure React Query staleTime for tasks to reduce unnecessary refetches on navigation

**User-visible outcome:** Tasks page loads significantly faster with initial results appearing within 2 seconds, showing skeleton placeholders while data loads progressively, and reusing cached data when navigating back to the page.
