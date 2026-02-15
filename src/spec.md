# Specification

## Summary
**Goal:** Update Clients to use the new fields (Name, GSTIN, PAN, Notes) and add bulk upload plus bulk selection/delete for Clients.

**Planned changes:**
- Update backend Client model and Client CRUD APIs to store/return: name (required), gstin (optional), pan (optional), notes (optional), replacing the legacy contactInfo/projects encoding.
- Add backend bulk client APIs: bulk create from a list of client inputs, and bulk delete by a list of client IDs, enforcing the same auth rules as existing client APIs.
- Add conditional backend state migration to map legacy client records into the new model (preserve name; map any legacy notes when present; default gstin/pan to null), and do nothing on fresh deployments.
- Update frontend client parsing/encoding utilities and all client UI surfaces (form, list, detail) to reflect the new fields and remove reliance on legacy derived fields.
- Implement Clients list bulk selection UI (row checkboxes, select-all, selected count bar) and a confirmed bulk delete flow, consistent with the existing Tasks bulk selection behavior.
- Add a Clients bulk upload (CSV) dialog flow: download template, upload CSV, preview parsed rows, show validation errors in English, and submit to create clients in batch.
- Add React Query hooks for client bulk create and bulk delete and wire the UI to use hooks (with clients list invalidation/refetch on success).

**User-visible outcome:** Users can create/edit/view clients using Name/GSTIN/PAN/Notes, select multiple clients in the Clients list to delete in bulk, and upload a CSV to create many clients at once with preview and validation.
