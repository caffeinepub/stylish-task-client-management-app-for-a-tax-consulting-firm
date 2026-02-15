# Specification

## Summary
**Goal:** Expand Tasks to use the full user-specified field set and add bulk upload plus bulk edit/delete capabilities.

**Planned changes:**
- Update backend Task data model and CRUD APIs to include required fields (Client Name, Task Category, Sub Category) and optional fields (Status, Comment, Assigned Name, Due Date, Assignment Date, Completion Date, Bill, Advance Received, Outstanding Amount, Payment Status), while keeping tasks scoped to the signed-in principal and preserving existing auth behavior.
- Add backend bulk APIs for tasks: bulk create from a list of task inputs, bulk delete by task ID list, and bulk update by ID list using a partial patch payload (only provided fields change).
- Update Tasks UI create/edit form and Tasks table to match the expanded Task field set, with responsive handling for many columns.
- Add a frontend bulk upload flow: downloadable CSV template with all task field headers, CSV upload with client-side parsing, preview, and validation errors before submitting to bulk create.
- Add bulk selection in the Tasks list plus bulk actions (Edit Selected, Delete Selected), with bulk edit applying only fields explicitly set by the user.
- Update frontend task parsing/encoding and React Query hooks to align with the new Task model and new bulk APIs, removing any legacy encoding of metadata inside the description field.

**User-visible outcome:** Users can create and manage tasks with the expanded set of fields, upload many tasks at once via a CSV template with preview/validation, and select multiple tasks to bulk edit optional fields or bulk delete.
