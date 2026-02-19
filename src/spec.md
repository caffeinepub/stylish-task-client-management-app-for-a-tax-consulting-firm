# Specification

## Summary
**Goal:** Fix the JavaScript module loading error that prevents the application from loading in production.

**Planned changes:**
- Verify and fix the frontend build configuration to correctly output ES modules
- Ensure index.html includes type="module" attribute for the main script entry point
- Configure the production server to serve JavaScript files with the correct Content-Type header (application/javascript instead of text/html)
- Test that all routes (dashboard, tasks, clients, assignees, todos) load successfully after the fix

**User-visible outcome:** The application loads successfully in production without module script errors, and all routes render correctly in the browser.
