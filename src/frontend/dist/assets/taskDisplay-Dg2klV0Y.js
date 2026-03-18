const PLACEHOLDER = "—";
function formatTaskDate(timestamp) {
  if (!timestamp) return PLACEHOLDER;
  try {
    const milliseconds = Number(timestamp) / 1e6;
    if (!Number.isFinite(milliseconds) || Number.isNaN(milliseconds)) {
      return PLACEHOLDER;
    }
    if (milliseconds < -864e13 || milliseconds > 864e13) {
      return PLACEHOLDER;
    }
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) {
      return PLACEHOLDER;
    }
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return PLACEHOLDER;
  }
}
function formatCurrency(amount) {
  if (amount === void 0 || amount === null) return PLACEHOLDER;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return PLACEHOLDER;
  }
}
function formatOptionalText(text) {
  if (!text || text.trim() === "") return PLACEHOLDER;
  return text;
}
function formatAssigneeWithCaptain(assignedName, captainName) {
  if (!assignedName || assignedName.trim() === "") {
    return PLACEHOLDER;
  }
  if (captainName && captainName.trim() !== "") {
    return `${assignedName} (Captain: ${captainName})`;
  }
  return assignedName;
}
function formatAssigneeName(assignedName, captainName) {
  if (!assignedName || assignedName.trim() === "") {
    return PLACEHOLDER;
  }
  if (captainName && captainName.trim() !== "") {
    return `${assignedName} (${captainName})`;
  }
  return assignedName;
}
export {
  formatTaskDate as a,
  formatCurrency as b,
  formatOptionalText as c,
  formatAssigneeName as d,
  formatAssigneeWithCaptain as f
};
