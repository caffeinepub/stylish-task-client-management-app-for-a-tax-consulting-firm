const ALLOWED_TASK_STATUSES = [
  "Pending",
  "Docs Pending",
  "In Progress",
  "Checking",
  "Payment Pending",
  "Completed",
  "Hold"
];
const LEGACY_STATUS_MAP = {
  "To Do": "Pending",
  Done: "Completed",
  Blocked: "Hold"
};
function normalizeStatus(status) {
  if (!status || status.trim() === "") return "";
  const trimmed = status.trim();
  return LEGACY_STATUS_MAP[trimmed] || trimmed;
}
function isValidStatus(status) {
  if (!status || status.trim() === "") return false;
  const normalized = normalizeStatus(status);
  return ALLOWED_TASK_STATUSES.includes(normalized);
}
function getStatusDisplayLabel(status) {
  if (!status) return "Pending";
  return normalizeStatus(status);
}
function coerceStatusForSelect(status, sentinel) {
  if (!status || status.trim() === "") return sentinel;
  const normalized = normalizeStatus(status);
  if (!normalized || !ALLOWED_TASK_STATUSES.includes(normalized)) {
    return sentinel;
  }
  return normalized;
}
export {
  ALLOWED_TASK_STATUSES as A,
  coerceStatusForSelect as c,
  getStatusDisplayLabel as g,
  isValidStatus as i
};
