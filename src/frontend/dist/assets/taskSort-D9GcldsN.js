import { g as getStatusDisplayLabel } from "./taskStatus-AmY6QXne.js";
function compareValues(a, b, direction, compareFn) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const result = compareFn(a, b);
  return direction === "asc" ? result : -result;
}
function compareBigInt(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
function compareNumber(a, b) {
  return a - b;
}
function compareString(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
function sortTasks(tasks, field, direction) {
  return [...tasks].sort((a, b) => {
    switch (field) {
      case "dueDate":
        return compareValues(a.dueDate, b.dueDate, direction, compareBigInt);
      case "assignmentDate":
        return compareValues(
          a.assignmentDate,
          b.assignmentDate,
          direction,
          compareBigInt
        );
      case "completionDate":
        return compareValues(
          a.completionDate,
          b.completionDate,
          direction,
          compareBigInt
        );
      case "status": {
        const statusA = getStatusDisplayLabel(a.status);
        const statusB = getStatusDisplayLabel(b.status);
        return compareValues(
          a.status ? statusA : null,
          b.status ? statusB : null,
          direction,
          compareString
        );
      }
      case "taskCategory":
        return compareValues(
          a.taskCategory,
          b.taskCategory,
          direction,
          compareString
        );
      case "subCategory":
        return compareValues(
          a.subCategory,
          b.subCategory,
          direction,
          compareString
        );
      case "clientName":
        return compareValues(
          a.clientName,
          b.clientName,
          direction,
          compareString
        );
      case "assignedName": {
        const assigneeA = a.assignedName && a.assignedName.trim() !== "" ? a.assignedName : null;
        const assigneeB = b.assignedName && b.assignedName.trim() !== "" ? b.assignedName : null;
        return compareValues(assigneeA, assigneeB, direction, compareString);
      }
      case "bill":
        return compareValues(a.bill, b.bill, direction, compareNumber);
      case "advanceReceived":
        return compareValues(
          a.advanceReceived,
          b.advanceReceived,
          direction,
          compareNumber
        );
      case "outstandingAmount":
        return compareValues(
          a.outstandingAmount,
          b.outstandingAmount,
          direction,
          compareNumber
        );
      case "createdAt":
        return compareValues(
          a.createdAt,
          b.createdAt,
          direction,
          compareBigInt
        );
      default:
        return 0;
    }
  });
}
export {
  sortTasks as s
};
