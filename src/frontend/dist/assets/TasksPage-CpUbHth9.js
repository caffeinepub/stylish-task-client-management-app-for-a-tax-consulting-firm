import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, I as Input, X, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogDescription, k as Label, l as DialogFooter, L as LoaderCircle, o as ue, m as DialogTrigger, C as CircleAlert, p as cn, n as useInternetIdentity, x as useQueryClient, y as useSearch, a as Card, e as CardContent, b as CardHeader, d as CardTitle, S as Search, R as RefreshCw } from "./index-CIYCVZFK.js";
import { B as Badge } from "./badge-nn_00--e.js";
import { D as Download, C as Checkbox } from "./checkbox-CY8LbhKR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0qB5Vxp.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BQeX1_Qr.js";
import { a as useUpdateTaskComment, b as useBulkUpdateTasks, c as useCreateTask, d as useUpdateTask, e as useTasksWithCaptain, f as useBulkDeleteTasks, g as usePaginatedTasks } from "./tasks-g8CyW862.js";
import { C as Check } from "./check-Bm3Y5r9f.js";
import { T as Textarea } from "./textarea-Ba5fU_GZ.js";
import { A as ALLOWED_TASK_STATUSES, i as isValidStatus, g as getStatusDisplayLabel, c as coerceStatusForSelect } from "./taskStatus-AmY6QXne.js";
import { f as useGetAllAssignees, d as useAssignees } from "./assignees-BqBSX183.js";
import { u as useGetAllClients, b as useClients } from "./clients-I2sGyIgN.js";
import { A as Alert, a as AlertDescription } from "./alert-BJ4vRlvq.js";
import { S as ScrollArea } from "./scroll-area-CqeqKU-1.js";
import { c as formatOptionalText, a as formatTaskDate, b as formatCurrency, d as formatAssigneeName } from "./taskDisplay-Dg2klV0Y.js";
import { U as Upload, C as CircleCheck } from "./upload-Dt3D3mec.js";
import { P as Popover, a as PopoverTrigger, C as ChevronsUpDown, b as PopoverContent, c as Command, d as CommandInput, e as CommandList, f as CommandEmpty, g as CommandGroup, h as CommandItem } from "./popover-hLl8jF9_.js";
import { b as useTaskTypes } from "./taskTypes-C8zFpkj5.js";
import { e as exportTasksToExcel } from "./taskExcel-B3RMApwU.js";
import { P as Plus, T as Trash2 } from "./trash-2-DZzjCjdf.js";
import { S as SquarePen } from "./square-pen-BAsT1jt-.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
function InlineCommentEditor({
  task
}) {
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editedComment, setEditedComment] = reactExports.useState(task.comment || "");
  const [error, setError] = reactExports.useState(null);
  const { mutate: updateComment, isPending } = useUpdateTaskComment();
  const handleStartEdit = () => {
    setEditedComment(task.comment || "");
    setError(null);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setEditedComment(task.comment || "");
    setError(null);
    setIsEditing(false);
  };
  const handleSave = () => {
    setError(null);
    updateComment(
      { taskId: task.id, comment: editedComment },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to update comment"
          );
        }
      }
    );
  };
  if (!isEditing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-1 truncate", children: task.comment || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
          onClick: handleStartEdit,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: editedComment,
          onChange: (e) => setEditedComment(e.target.value),
          placeholder: "Enter comment...",
          className: "h-8 text-sm",
          disabled: isPending,
          autoFocus: true,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              handleSave();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950",
          onClick: handleSave,
          disabled: isPending,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
          onClick: handleCancel,
          disabled: isPending,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
  ] });
}
const UNCHANGED_SENTINEL = "__unchanged__";
function TaskBulkEditDialog({
  open,
  onOpenChange,
  selectedTasks,
  onSuccess
}) {
  const { mutate: bulkUpdateTasks, isPending } = useBulkUpdateTasks();
  const { data: clients } = useGetAllClients();
  const { data: assignees } = useGetAllAssignees();
  const [clientName, setClientName] = reactExports.useState(UNCHANGED_SENTINEL);
  const [taskCategory, setTaskCategory] = reactExports.useState("");
  const [subCategory, setSubCategory] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState(UNCHANGED_SENTINEL);
  const [comment, setComment] = reactExports.useState("");
  const [assignedName, setAssignedName] = reactExports.useState(UNCHANGED_SENTINEL);
  const [dueDate, setDueDate] = reactExports.useState("");
  const [assignmentDate, setAssignmentDate] = reactExports.useState("");
  const [completionDate, setCompletionDate] = reactExports.useState("");
  const [bill, setBill] = reactExports.useState("");
  const [advanceReceived, setAdvanceReceived] = reactExports.useState("");
  const [outstandingAmount, setOutstandingAmount] = reactExports.useState("");
  const [paymentStatus, setPaymentStatus] = reactExports.useState("");
  const uniqueCategories = reactExports.useMemo(() => {
    if (!selectedTasks || selectedTasks.length === 0) return [];
    const categories = new Set(selectedTasks.map((t) => t.taskCategory));
    return Array.from(categories).sort();
  }, [selectedTasks]);
  const uniqueSubCategories = reactExports.useMemo(() => {
    if (!selectedTasks || selectedTasks.length === 0) return [];
    const subCategories = new Set(selectedTasks.map((t) => t.subCategory));
    return Array.from(subCategories).sort();
  }, [selectedTasks]);
  const uniqueClientNames = reactExports.useMemo(() => {
    if (!clients) return [];
    return clients.map((c) => c.name).sort();
  }, [clients]);
  const uniqueAssigneeNames = reactExports.useMemo(() => {
    if (!assignees) return [];
    return assignees.map((a) => a.name).sort();
  }, [assignees]);
  reactExports.useEffect(() => {
    if (!open) {
      setClientName(UNCHANGED_SENTINEL);
      setTaskCategory("");
      setSubCategory("");
      setStatus(UNCHANGED_SENTINEL);
      setComment("");
      setAssignedName(UNCHANGED_SENTINEL);
      setDueDate("");
      setAssignmentDate("");
      setCompletionDate("");
      setBill("");
      setAdvanceReceived("");
      setOutstandingAmount("");
      setPaymentStatus("");
    }
  }, [open]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = selectedTasks.map((task) => {
      const update = { id: task.id };
      if (clientName !== UNCHANGED_SENTINEL && clientName.trim() !== "") {
        update.clientName = clientName.trim();
      }
      if (taskCategory.trim() !== "") {
        update.taskCategory = taskCategory.trim();
      }
      if (subCategory.trim() !== "") {
        update.subCategory = subCategory.trim();
      }
      if (status !== UNCHANGED_SENTINEL) {
        update.status = status;
      }
      if (comment.trim() !== "") {
        update.comment = comment.trim();
      }
      if (assignedName !== UNCHANGED_SENTINEL) {
        update.assignedName = assignedName;
      }
      if (dueDate.trim() !== "") {
        const dateObj = new Date(dueDate);
        update.dueDate = BigInt(dateObj.getTime()) * BigInt(1e6);
      }
      if (assignmentDate.trim() !== "") {
        const dateObj = new Date(assignmentDate);
        update.assignmentDate = BigInt(dateObj.getTime()) * BigInt(1e6);
      }
      if (completionDate.trim() !== "") {
        const dateObj = new Date(completionDate);
        update.completionDate = BigInt(dateObj.getTime()) * BigInt(1e6);
      }
      if (bill.trim() !== "") {
        const billNum = Number.parseFloat(bill);
        if (!Number.isNaN(billNum)) {
          update.bill = billNum;
        }
      }
      if (advanceReceived.trim() !== "") {
        const advNum = Number.parseFloat(advanceReceived);
        if (!Number.isNaN(advNum)) {
          update.advanceReceived = advNum;
        }
      }
      if (outstandingAmount.trim() !== "") {
        const outNum = Number.parseFloat(outstandingAmount);
        if (!Number.isNaN(outNum)) {
          update.outstandingAmount = outNum;
        }
      }
      if (paymentStatus.trim() !== "") {
        update.paymentStatus = paymentStatus.trim();
      }
      return update;
    });
    const hasChanges = updates.some((update) => Object.keys(update).length > 1);
    if (!hasChanges) {
      ue.info("No changes to apply");
      onOpenChange(false);
      return;
    }
    bulkUpdateTasks(updates, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess == null ? void 0 : onSuccess();
      },
      onError: (error) => {
        console.error("Bulk update error:", error);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: isPending ? void 0 : onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk Edit Tasks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Update ",
        selectedTasks.length,
        " selected task(s). Only fields you change will be updated."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "clientName", children: "Client Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: clientName,
              onValueChange: setClientName,
              disabled: isPending,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "clientName", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select client" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UNCHANGED_SENTINEL, children: "— No Change —" }),
                  uniqueClientNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: name, children: name }, name))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "taskCategory", children: "Task Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "taskCategory",
              value: taskCategory,
              onChange: (e) => setTaskCategory(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending,
              list: "categories-list"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "categories-list", children: uniqueCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat }, cat)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subCategory", children: "Sub Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "subCategory",
              value: subCategory,
              onChange: (e) => setSubCategory(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending,
              list: "subcategories-list"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "subcategories-list", children: uniqueSubCategories.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: sub }, sub)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: status,
              onValueChange: setStatus,
              disabled: isPending,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UNCHANGED_SENTINEL, children: "— No Change —" }),
                  ALLOWED_TASK_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "assignedName", children: "Assigned To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: assignedName,
              onValueChange: setAssignedName,
              disabled: isPending,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "assignedName", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select assignee" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UNCHANGED_SENTINEL, children: "— No Change —" }),
                  uniqueAssigneeNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: name, children: name }, name))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "dueDate",
              type: "date",
              value: dueDate,
              onChange: (e) => setDueDate(e.target.value),
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "assignmentDate", children: "Assignment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "assignmentDate",
              type: "date",
              value: assignmentDate,
              onChange: (e) => setAssignmentDate(e.target.value),
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "completionDate", children: "Completion Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "completionDate",
              type: "date",
              value: completionDate,
              onChange: (e) => setCompletionDate(e.target.value),
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bill", children: "Bill Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "bill",
              type: "number",
              step: "0.01",
              value: bill,
              onChange: (e) => setBill(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "advanceReceived", children: "Advance Received" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "advanceReceived",
              type: "number",
              step: "0.01",
              value: advanceReceived,
              onChange: (e) => setAdvanceReceived(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "outstandingAmount", children: "Outstanding Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "outstandingAmount",
              type: "number",
              step: "0.01",
              value: outstandingAmount,
              onChange: (e) => setOutstandingAmount(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paymentStatus", children: "Payment Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "paymentStatus",
              value: paymentStatus,
              onChange: (e) => setPaymentStatus(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "comment", children: "Comment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "comment",
              value: comment,
              onChange: (e) => setComment(e.target.value),
              placeholder: "Leave empty for no change",
              disabled: isPending,
              rows: 3
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: isPending,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Updating..."
        ] }) : "Update Tasks" })
      ] })
    ] })
  ] }) });
}
function generateTaskCsvTemplate() {
  const headers = [
    "Client Name",
    "Task Category",
    "Sub Category",
    "Status",
    "Comment",
    "Assigned Name",
    "Due Date",
    "Assignment Date",
    "Completion Date",
    "Bill",
    "Advance Received",
    "Outstanding Amount",
    "Payment Status"
  ];
  const exampleRow = [
    "ABC Corp",
    "GST Return",
    "GSTR-1",
    "Pending",
    '"Up to Dec Sales, purchase and Bank Completed"',
    "John Doe",
    "2026-03-15",
    "2026-02-01",
    "",
    "5000",
    "2000",
    "3000",
    "Partial"
  ];
  return [headers.join(","), exampleRow.join(",")].join("\n");
}
function parseDateToTimestamp(dateStr) {
  if (!dateStr || dateStr.trim() === "") return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return BigInt(date.getTime());
}
function parseNumber(numStr) {
  if (!numStr || numStr.trim() === "") return null;
  const num = Number.parseFloat(numStr);
  if (Number.isNaN(num)) {
    return null;
  }
  return num;
}
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
function parseCsvFile(csvContent) {
  const lines = csvContent.trim().split("\n");
  const tasks = [];
  const errors = [];
  if (lines.length < 2) {
    errors.push({
      row: 0,
      column: "File",
      message: "CSV file must contain at least a header row and one data row"
    });
    return { tasks, errors };
  }
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const requiredHeaders = ["Client Name", "Task Category", "Sub Category"];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      column: "Headers",
      message: `Missing required columns: ${missingHeaders.join(", ")}`
    });
    return { tasks, errors };
  }
  const clientNameIdx = headers.indexOf("Client Name");
  const taskCategoryIdx = headers.indexOf("Task Category");
  const subCategoryIdx = headers.indexOf("Sub Category");
  const statusIdx = headers.indexOf("Status");
  const commentIdx = headers.indexOf("Comment");
  const assignedNameIdx = headers.indexOf("Assigned Name");
  const dueDateIdx = headers.indexOf("Due Date");
  const assignmentDateIdx = headers.indexOf("Assignment Date");
  const completionDateIdx = headers.indexOf("Completion Date");
  const billIdx = headers.indexOf("Bill");
  const advanceReceivedIdx = headers.indexOf("Advance Received");
  const outstandingAmountIdx = headers.indexOf("Outstanding Amount");
  const paymentStatusIdx = headers.indexOf("Payment Status");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCsvLine(line).map((v) => v.trim());
    const rowNumber = i + 1;
    const clientName = values[clientNameIdx] || "";
    const taskCategory = values[taskCategoryIdx] || "";
    const subCategory = values[subCategoryIdx] || "";
    if (!clientName) {
      errors.push({
        row: rowNumber,
        column: "Client Name",
        message: "Client Name is required"
      });
    }
    if (!taskCategory) {
      errors.push({
        row: rowNumber,
        column: "Task Category",
        message: "Task Category is required"
      });
    }
    if (!subCategory) {
      errors.push({
        row: rowNumber,
        column: "Sub Category",
        message: "Sub Category is required"
      });
    }
    const status = statusIdx >= 0 ? values[statusIdx] || "" : "";
    const comment = commentIdx >= 0 ? values[commentIdx] || "" : "";
    const assignedName = assignedNameIdx >= 0 ? values[assignedNameIdx] || "" : "";
    const dueDateStr = dueDateIdx >= 0 ? values[dueDateIdx] || "" : "";
    const assignmentDateStr = assignmentDateIdx >= 0 ? values[assignmentDateIdx] || "" : "";
    const completionDateStr = completionDateIdx >= 0 ? values[completionDateIdx] || "" : "";
    const billStr = billIdx >= 0 ? values[billIdx] || "" : "";
    const advanceReceivedStr = advanceReceivedIdx >= 0 ? values[advanceReceivedIdx] || "" : "";
    const outstandingAmountStr = outstandingAmountIdx >= 0 ? values[outstandingAmountIdx] || "" : "";
    const paymentStatus = paymentStatusIdx >= 0 ? values[paymentStatusIdx] || "" : "";
    if (status && !isValidStatus(status)) {
      errors.push({
        row: rowNumber,
        column: "Status",
        message: `Invalid status: "${status}"`
      });
    }
    const dueDate = parseDateToTimestamp(dueDateStr);
    const assignmentDate = parseDateToTimestamp(assignmentDateStr);
    const completionDate = parseDateToTimestamp(completionDateStr);
    if (dueDateStr && !dueDate) {
      errors.push({
        row: rowNumber,
        column: "Due Date",
        message: "Invalid date format (use YYYY-MM-DD)"
      });
    }
    if (assignmentDateStr && !assignmentDate) {
      errors.push({
        row: rowNumber,
        column: "Assignment Date",
        message: "Invalid date format (use YYYY-MM-DD)"
      });
    }
    if (completionDateStr && !completionDate) {
      errors.push({
        row: rowNumber,
        column: "Completion Date",
        message: "Invalid date format (use YYYY-MM-DD)"
      });
    }
    const bill = parseNumber(billStr);
    const advanceReceived = parseNumber(advanceReceivedStr);
    const outstandingAmount = parseNumber(outstandingAmountStr);
    if (billStr && bill === null) {
      errors.push({
        row: rowNumber,
        column: "Bill",
        message: "Invalid number format"
      });
    }
    if (advanceReceivedStr && advanceReceived === null) {
      errors.push({
        row: rowNumber,
        column: "Advance Received",
        message: "Invalid number format"
      });
    }
    if (outstandingAmountStr && outstandingAmount === null) {
      errors.push({
        row: rowNumber,
        column: "Outstanding Amount",
        message: "Invalid number format"
      });
    }
    const task = {
      clientName,
      taskCategory,
      subCategory
    };
    if (status) task.status = status;
    if (comment) task.comment = comment;
    if (assignedName) task.assignedName = assignedName;
    if (dueDate) task.dueDate = dueDate;
    if (assignmentDate) task.assignmentDate = assignmentDate;
    if (completionDate) task.completionDate = completionDate;
    if (bill !== null) task.bill = bill;
    if (advanceReceived !== null) task.advanceReceived = advanceReceived;
    if (outstandingAmount !== null) task.outstandingAmount = outstandingAmount;
    if (paymentStatus) task.paymentStatus = paymentStatus;
    tasks.push(task);
  }
  return { tasks, errors };
}
function downloadTaskCsvTemplate() {
  const csvContent = generateTaskCsvTemplate();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `task_template_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function TaskBulkUploadDialog({
  open,
  onOpenChange
}) {
  const [parsedData, setParsedData] = reactExports.useState(null);
  const [fileName, setFileName] = reactExports.useState("");
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadSuccess, setUploadSuccess] = reactExports.useState(false);
  const [uploadError, setUploadError] = reactExports.useState(null);
  const { mutateAsync: createTask } = useCreateTask();
  const handleFileUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setFileName(file.name);
    setUploadSuccess(false);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      var _a2;
      const text = (_a2 = event.target) == null ? void 0 : _a2.result;
      const parsed = parseCsvFile(text);
      setParsedData(parsed);
    };
    reader.readAsText(file);
  };
  const handleSubmit = async () => {
    if (!parsedData || parsedData.tasks.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      for (const task of parsedData.tasks) {
        await createTask({
          clientName: task.clientName,
          taskCategory: task.taskCategory,
          subCategory: task.subCategory
        });
      }
      setUploadSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setParsedData(null);
        setFileName("");
        setUploadSuccess(false);
      }, 1500);
    } catch (error) {
      setUploadError(error.message || "Failed to create tasks");
    } finally {
      setIsUploading(false);
    }
  };
  const validTasks = (parsedData == null ? void 0 : parsedData.tasks.filter((_, index) => {
    const rowErrors = parsedData.errors.filter((e) => e.row === index + 2);
    return rowErrors.length === 0;
  })) || [];
  const hasErrors = parsedData ? parsedData.errors.length > 0 : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
      "Bulk Upload"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-6xl max-h-[90vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk Upload Tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload a CSV file to create multiple tasks at once. Only Client Name, Task Category, and Sub Category will be imported." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Download CSV Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start with our template to ensure correct formatting" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: downloadTaskCsvTemplate,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Download"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "csv-upload", className: "block text-sm font-medium", children: "Upload CSV File" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "csv-upload",
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
              disabled: isUploading
            }
          ),
          fileName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Selected: ",
            fileName
          ] })
        ] }),
        parsedData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
            "Preview (",
            validTasks.length,
            " valid, ",
            parsedData.errors.length,
            " ",
            "errors)"
          ] }) }),
          hasErrors && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
              parsedData.errors.length,
              " validation error(s) found. Please fix them before uploading."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px] border rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[50px]", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Client Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Task Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sub Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Comment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Assigned Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Errors" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: parsedData.tasks.map((task, index) => {
              const rowErrors = parsedData.errors.filter(
                (e) => e.row === index + 2
              );
              const isValid = rowErrors.length === 0;
              const rowKey = `${task.clientName || "row"}-${task.taskCategory || ""}-${index}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  className: !isValid ? "bg-destructive/10" : "",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: isValid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: task.clientName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: task.taskCategory }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: task.subCategory }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: task.status ? getStatusDisplayLabel(task.status) : "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[200px] truncate", children: formatOptionalText(task.comment) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatOptionalText(task.assignedName) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(task.dueDate) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatCurrency(task.bill) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: rowErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: rowErrors.map((e) => `${e.column}: ${e.message}`).join("; ") }) })
                  ]
                },
                rowKey
              );
            }) })
          ] }) })
        ] }),
        uploadSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-green-600 bg-green-50 dark:bg-green-950", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-green-800 dark:text-green-200", children: [
            "Successfully created ",
            validTasks.length,
            " task(s)!"
          ] })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: isUploading,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSubmit,
            disabled: isUploading || !parsedData || validTasks.length === 0 || hasErrors,
            children: [
              isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              isUploading ? "Creating..." : `Create ${validTasks.length} Task(s)`
            ]
          }
        )
      ] })
    ] })
  ] });
}
function TaskFormDialog({
  open,
  onOpenChange,
  task
}) {
  const isEdit = !!task;
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const [clientName, setClientName] = reactExports.useState("");
  const [taskCategory, setTaskCategory] = reactExports.useState("");
  const [subCategory, setSubCategory] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [comment, setComment] = reactExports.useState("");
  const [assignedName, setAssignedName] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [assignmentDate, setAssignmentDate] = reactExports.useState("");
  const [completionDate, setCompletionDate] = reactExports.useState("");
  const [bill, setBill] = reactExports.useState("");
  const [advanceReceived, setAdvanceReceived] = reactExports.useState("");
  const [outstandingAmount, setOutstandingAmount] = reactExports.useState("");
  const [paymentStatus, setPaymentStatus] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [clientOpen, setClientOpen] = reactExports.useState(false);
  const [categoryOpen, setCategoryOpen] = reactExports.useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = reactExports.useState(false);
  const [statusOpen, setStatusOpen] = reactExports.useState(false);
  const [assigneeOpen, setAssigneeOpen] = reactExports.useState(false);
  const { data: clients = [] } = useClients();
  const { data: assignees = [] } = useAssignees();
  const { data: taskTypes = [] } = useTaskTypes();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const isPending = isCreating || isUpdating;
  const dialogOpen = open !== void 0 ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;
  const clientNames = reactExports.useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.name))).sort();
  }, [clients]);
  const categories = reactExports.useMemo(() => {
    return taskTypes.map((tt) => tt.name).sort();
  }, [taskTypes]);
  const subCategories = reactExports.useMemo(() => {
    if (!taskCategory) return [];
    const selectedTaskType = taskTypes.find((tt) => tt.name === taskCategory);
    return (selectedTaskType == null ? void 0 : selectedTaskType.subtypes) || [];
  }, [taskCategory, taskTypes]);
  const assigneeNames = reactExports.useMemo(() => {
    return Array.from(new Set(assignees.map((a) => a.name))).sort();
  }, [assignees]);
  reactExports.useEffect(() => {
    if (task) {
      setClientName(task.clientName);
      setTaskCategory(task.taskCategory);
      setSubCategory(task.subCategory);
      setStatus(task.status || "");
      setComment(task.comment || "");
      setAssignedName(task.assignedName || "");
      setDueDate(
        task.dueDate ? new Date(Number(task.dueDate) / 1e6).toISOString().split("T")[0] : ""
      );
      setAssignmentDate(
        task.assignmentDate ? new Date(Number(task.assignmentDate) / 1e6).toISOString().split("T")[0] : ""
      );
      setCompletionDate(
        task.completionDate ? new Date(Number(task.completionDate) / 1e6).toISOString().split("T")[0] : ""
      );
      setBill(
        task.bill !== void 0 && task.bill !== null ? String(task.bill) : ""
      );
      setAdvanceReceived(
        task.advanceReceived !== void 0 && task.advanceReceived !== null ? String(task.advanceReceived) : ""
      );
      setOutstandingAmount(
        task.outstandingAmount !== void 0 && task.outstandingAmount !== null ? String(task.outstandingAmount) : ""
      );
      setPaymentStatus(task.paymentStatus || "");
    } else {
      resetForm();
    }
  }, [task, dialogOpen]);
  const resetForm = () => {
    setClientName("");
    setTaskCategory("");
    setSubCategory("");
    setStatus("");
    setComment("");
    setAssignedName("");
    setDueDate("");
    setAssignmentDate("");
    setCompletionDate("");
    setBill("");
    setAdvanceReceived("");
    setOutstandingAmount("");
    setPaymentStatus("");
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};
    if (!clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }
    if (!taskCategory.trim()) {
      newErrors.taskCategory = "Task Category is required";
    }
    if (!subCategory.trim()) {
      newErrors.subCategory = "Sub Category is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const dueDateNs = dueDate ? BigInt(new Date(dueDate).getTime()) * BigInt(1e6) : null;
    const assignmentDateNs = assignmentDate ? BigInt(new Date(assignmentDate).getTime()) * BigInt(1e6) : null;
    const completionDateNs = completionDate ? BigInt(new Date(completionDate).getTime()) * BigInt(1e6) : null;
    const billNum = bill ? Number.parseFloat(bill) : null;
    const advanceNum = advanceReceived ? Number.parseFloat(advanceReceived) : null;
    const outstandingNum = outstandingAmount ? Number.parseFloat(outstandingAmount) : null;
    if (isEdit && task) {
      updateTask(
        {
          taskId: task.id,
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim(),
          status: status.trim() || null,
          comment: comment.trim() || null,
          assignedName: assignedName.trim() || null,
          dueDate: dueDateNs,
          assignmentDate: assignmentDateNs,
          completionDate: completionDateNs,
          bill: billNum,
          advanceReceived: advanceNum,
          outstandingAmount: outstandingNum,
          paymentStatus: paymentStatus.trim() || null
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          }
        }
      );
    } else {
      createTask(
        {
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim()
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          }
        }
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: dialogOpen,
      onOpenChange: (open2) => !isPending && setDialogOpen(open2),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[600px] max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isEdit ? "Edit Task" : "Add New Task" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isEdit ? "Update task information" : "Enter task details to get started" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "clientName", children: [
              "Client Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: clientOpen, onOpenChange: setClientOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": clientOpen,
                  className: "w-full justify-between",
                  disabled: isPending,
                  children: [
                    clientName || "Select client...",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-full p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search client..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No client found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: clientNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: name,
                      onSelect: (currentValue) => {
                        setClientName(
                          currentValue === clientName ? "" : currentValue
                        );
                        setClientOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              clientName === name ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        name
                      ]
                    },
                    name
                  )) })
                ] })
              ] }) })
            ] }),
            errors.clientName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.clientName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "taskCategory", children: [
              "Task Category ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: categoryOpen, onOpenChange: setCategoryOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": categoryOpen,
                  className: "w-full justify-between",
                  disabled: isPending,
                  children: [
                    taskCategory || "Select category...",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-full p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search category..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No category found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: cat,
                      onSelect: (currentValue) => {
                        setTaskCategory(
                          currentValue === taskCategory ? "" : currentValue
                        );
                        setSubCategory("");
                        setCategoryOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              taskCategory === cat ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        cat
                      ]
                    },
                    cat
                  )) })
                ] })
              ] }) })
            ] }),
            errors.taskCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.taskCategory })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "subCategory", children: [
              "Sub Category ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: subCategoryOpen, onOpenChange: setSubCategoryOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": subCategoryOpen,
                  className: "w-full justify-between",
                  disabled: isPending || !taskCategory,
                  children: [
                    subCategory || "Select sub category...",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-full p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search sub category..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { className: "max-h-[300px] overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No sub category found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: subCategories.map((subCat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: subCat,
                      onSelect: (currentValue) => {
                        setSubCategory(
                          currentValue === subCategory ? "" : currentValue
                        );
                        setSubCategoryOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              subCategory === subCat ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        subCat
                      ]
                    },
                    subCat
                  )) })
                ] })
              ] }) })
            ] }),
            errors.subCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.subCategory })
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: statusOpen, onOpenChange: setStatusOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": statusOpen,
                  className: "w-full justify-between",
                  disabled: isPending,
                  children: [
                    status || "Select status...",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-full p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search status..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No status found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: ALLOWED_TASK_STATUSES.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: stat,
                      onSelect: (currentValue) => {
                        setStatus(
                          currentValue === status ? "" : currentValue
                        );
                        setStatusOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              status === stat ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        stat
                      ]
                    },
                    stat
                  )) })
                ] })
              ] }) })
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "assignedName", children: "Assigned Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: assigneeOpen, onOpenChange: setAssigneeOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": assigneeOpen,
                  className: "w-full justify-between",
                  disabled: isPending,
                  children: [
                    assignedName || "Select assignee...",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-full p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search assignee..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { className: "max-h-[300px] overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No assignee found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: assigneeNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: name,
                      onSelect: (currentValue) => {
                        setAssignedName(
                          currentValue === assignedName ? "" : currentValue
                        );
                        setAssigneeOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              assignedName === name ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        name
                      ]
                    },
                    name
                  )) })
                ] })
              ] }) })
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "comment", children: "Comment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "comment",
                value: comment,
                onChange: (e) => setComment(e.target.value),
                placeholder: "Add any notes or comments...",
                disabled: isPending,
                rows: 3
              }
            )
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "dueDate",
                  type: "date",
                  value: dueDate,
                  onChange: (e) => setDueDate(e.target.value),
                  disabled: isPending
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "assignmentDate", children: "Assignment Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "assignmentDate",
                  type: "date",
                  value: assignmentDate,
                  onChange: (e) => setAssignmentDate(e.target.value),
                  disabled: isPending
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "completionDate", children: "Completion Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "completionDate",
                  type: "date",
                  value: completionDate,
                  onChange: (e) => setCompletionDate(e.target.value),
                  disabled: isPending
                }
              )
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bill", children: "Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "bill",
                  type: "number",
                  step: "0.01",
                  value: bill,
                  onChange: (e) => setBill(e.target.value),
                  placeholder: "0.00",
                  disabled: isPending
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "advanceReceived", children: "Advance Received" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "advanceReceived",
                  type: "number",
                  step: "0.01",
                  value: advanceReceived,
                  onChange: (e) => setAdvanceReceived(e.target.value),
                  placeholder: "0.00",
                  disabled: isPending
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "outstandingAmount", children: "Outstanding Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "outstandingAmount",
                  type: "number",
                  step: "0.01",
                  value: outstandingAmount,
                  onChange: (e) => setOutstandingAmount(e.target.value),
                  placeholder: "0.00",
                  disabled: isPending
                }
              )
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paymentStatus", children: "Payment Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "paymentStatus",
                value: paymentStatus,
                onChange: (e) => setPaymentStatus(e.target.value),
                placeholder: "e.g., Paid, Pending, Partial",
                disabled: isPending
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setDialogOpen(false),
              disabled: isPending,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, children: [
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            isPending ? "Saving..." : isEdit ? "Update" : "Create"
          ] })
        ] })
      ] }) })
    }
  );
}
function TaskListSkeleton({
  rows = 15,
  showCheckbox = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      showCheckbox && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Client Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sub-Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Assigned To" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Due Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Assignment Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Completion Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Bill" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Advance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Outstanding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Payment Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Comment" }),
      showCheckbox && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: Array.from({ length: rows }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows have no stable id
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        showCheckbox && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 bg-muted rounded animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-32 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-24 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-28 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 bg-muted rounded w-20 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-28 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-24 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-24 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-24 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-20 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-20 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-20 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-24 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-40 animate-pulse" }) }),
        showCheckbox && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 bg-muted rounded animate-pulse" }) })
      ] }, index)
    )) })
  ] }) });
}
const STATUS_NONE_SENTINEL = "__none__";
function TaskQuickStatus({ task }) {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const handleStatusChange = (newStatus) => {
    const statusValue = newStatus === STATUS_NONE_SENTINEL ? null : newStatus;
    updateTask({
      taskId: task.id,
      clientName: task.clientName,
      taskCategory: task.taskCategory,
      subCategory: task.subCategory,
      status: statusValue,
      comment: task.comment || null,
      assignedName: task.assignedName || null,
      dueDate: task.dueDate || null,
      assignmentDate: task.assignmentDate || null,
      completionDate: task.completionDate || null,
      bill: task.bill || null,
      advanceReceived: task.advanceReceived || null,
      outstandingAmount: task.outstandingAmount || null,
      paymentStatus: task.paymentStatus || null
    });
  };
  const currentStatus = coerceStatusForSelect(
    task.status,
    STATUS_NONE_SENTINEL
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Select,
    {
      value: currentStatus,
      onValueChange: handleStatusChange,
      disabled: isPending,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: STATUS_NONE_SENTINEL, children: "— None —" }),
          ALLOWED_TASK_STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: status, children: getStatusDisplayLabel(status) }, status))
        ] })
      ]
    }
  );
}
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
const FILTER_ALL_SENTINEL = "all";
function PaymentStatusBadge({ status }) {
  if (!status) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
  const normalized = status.trim().toLowerCase();
  if (normalized === "paid") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium", children: "Paid" });
  }
  if (normalized === "partial paid") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium", children: "Partial Paid" });
  }
  if (normalized === "advance received") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium", children: "Advance Received" });
  }
  if (normalized === "payment pending") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-medium", children: "Payment Pending" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-medium", children: status });
}
function TasksPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();
  const searchParams = useSearch({ strict: false });
  const urlClientName = searchParams.clientName;
  const urlTaskCategory = searchParams.taskCategory;
  const urlSubCategory = searchParams.subCategory;
  const urlStatus = searchParams.status;
  const urlAssignedName = searchParams.assignedName;
  const tasksQuery = useTasksWithCaptain();
  reactExports.useEffect(() => {
    var _a;
    console.log("[TasksPage] Component mounted", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      isAuthenticated,
      query: {
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        isError: tasksQuery.isError,
        error: tasksQuery.error,
        dataLength: (_a = tasksQuery.data) == null ? void 0 : _a.length
      }
    });
  }, []);
  reactExports.useEffect(() => {
    var _a, _b;
    console.log("[TasksPage] Query state changed", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      isAuthenticated,
      query: {
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        isError: tasksQuery.isError,
        error: (_a = tasksQuery.error) == null ? void 0 : _a.message,
        dataLength: (_b = tasksQuery.data) == null ? void 0 : _b.length,
        status: tasksQuery.status,
        fetchStatus: tasksQuery.fetchStatus
      }
    });
  }, [
    isAuthenticated,
    tasksQuery.isLoading,
    tasksQuery.isFetching,
    tasksQuery.isError,
    tasksQuery.data
  ]);
  const tasksWithCaptain = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;
  const isFetching = tasksQuery.isFetching;
  const isError = tasksQuery.isError;
  const error = tasksQuery.error;
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterClientName, setFilterClientName] = reactExports.useState(
    urlClientName || FILTER_ALL_SENTINEL
  );
  const [filterTaskCategory, setFilterTaskCategory] = reactExports.useState(
    urlTaskCategory || FILTER_ALL_SENTINEL
  );
  const [filterSubCategory, setFilterSubCategory] = reactExports.useState(
    urlSubCategory || FILTER_ALL_SENTINEL
  );
  const [filterAssignedName, setFilterAssignedName] = reactExports.useState(
    urlAssignedName || FILTER_ALL_SENTINEL
  );
  const [filterStatus, setFilterStatus] = reactExports.useState(
    urlStatus || FILTER_ALL_SENTINEL
  );
  const [filterPaymentStatus, setFilterPaymentStatus] = reactExports.useState(FILTER_ALL_SENTINEL);
  const [filterAssignmentDateFrom, setFilterAssignmentDateFrom] = reactExports.useState("");
  const [filterAssignmentDateTo, setFilterAssignmentDateTo] = reactExports.useState("");
  const [selectedTaskIds, setSelectedTaskIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = reactExports.useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = reactExports.useState(false);
  const [editingTask, setEditingTask] = reactExports.useState(void 0);
  const [sortField, setSortField] = reactExports.useState("createdAt");
  const [sortDirection, setSortDirection] = reactExports.useState("desc");
  const [pageSize, setPageSize] = reactExports.useState(20);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const bulkDeleteMutation = useBulkDeleteTasks();
  reactExports.useEffect(() => {
    if (urlClientName) setFilterClientName(urlClientName);
    if (urlTaskCategory) setFilterTaskCategory(urlTaskCategory);
    if (urlSubCategory) setFilterSubCategory(urlSubCategory);
    if (urlStatus) setFilterStatus(urlStatus);
    if (urlAssignedName) setFilterAssignedName(urlAssignedName);
  }, [
    urlClientName,
    urlTaskCategory,
    urlSubCategory,
    urlStatus,
    urlAssignedName
  ]);
  const uniqueClientNames = reactExports.useMemo(() => {
    const names = new Set(tasksWithCaptain.map((t) => t.task.clientName));
    return Array.from(names).sort();
  }, [tasksWithCaptain]);
  const uniqueTaskCategories = reactExports.useMemo(() => {
    const categories = new Set(
      tasksWithCaptain.map((t) => t.task.taskCategory)
    );
    return Array.from(categories).sort();
  }, [tasksWithCaptain]);
  const uniqueSubCategories = reactExports.useMemo(() => {
    const subCategories = new Set(
      tasksWithCaptain.map((t) => t.task.subCategory)
    );
    return Array.from(subCategories).sort();
  }, [tasksWithCaptain]);
  const uniqueAssignedNames = reactExports.useMemo(() => {
    const names = new Set(
      tasksWithCaptain.map((t) => t.task.assignedName).filter((name) => !!name)
    );
    return Array.from(names).sort();
  }, [tasksWithCaptain]);
  const uniqueStatuses = reactExports.useMemo(() => {
    const statuses = new Set(
      tasksWithCaptain.map((t) => t.task.status).filter((status) => !!status)
    );
    return Array.from(statuses).sort();
  }, [tasksWithCaptain]);
  const filteredTasks = reactExports.useMemo(() => {
    let result = tasksWithCaptain;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) => {
          var _a;
          return t.task.clientName.toLowerCase().includes(query) || t.task.taskCategory.toLowerCase().includes(query) || t.task.subCategory.toLowerCase().includes(query) || ((_a = t.task.comment) == null ? void 0 : _a.toLowerCase().includes(query));
        }
      );
    }
    if (filterClientName && filterClientName !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.clientName === filterClientName);
    }
    if (filterTaskCategory && filterTaskCategory !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.taskCategory === filterTaskCategory);
    }
    if (filterSubCategory && filterSubCategory !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.subCategory === filterSubCategory);
    }
    if (filterAssignedName && filterAssignedName !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.assignedName === filterAssignedName);
    }
    if (filterStatus && filterStatus !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.status === filterStatus);
    }
    if (filterPaymentStatus && filterPaymentStatus !== FILTER_ALL_SENTINEL) {
      result = result.filter(
        (t) => t.task.paymentStatus === filterPaymentStatus
      );
    }
    if (filterAssignmentDateFrom) {
      const fromDate = new Date(filterAssignmentDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((t) => {
        if (!t.task.assignmentDate) return false;
        const taskDate = new Date(Number(t.task.assignmentDate) / 1e6);
        return taskDate >= fromDate;
      });
    }
    if (filterAssignmentDateTo) {
      const toDate = new Date(filterAssignmentDateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => {
        if (!t.task.assignmentDate) return false;
        const taskDate = new Date(Number(t.task.assignmentDate) / 1e6);
        return taskDate <= toDate;
      });
    }
    const tasks = result.map((t) => t.task);
    const sortedTasks = sortTasks(tasks, sortField, sortDirection);
    return sortedTasks.map((task) => {
      const original = tasksWithCaptain.find((t) => t.task.id === task.id);
      return original || { task, captainName: void 0 };
    });
  }, [
    tasksWithCaptain,
    searchQuery,
    filterClientName,
    filterTaskCategory,
    filterSubCategory,
    filterAssignedName,
    filterStatus,
    filterPaymentStatus,
    filterAssignmentDateFrom,
    filterAssignmentDateTo,
    sortField,
    sortDirection
  ]);
  const pagination = usePaginatedTasks(filteredTasks, pageSize);
  reactExports.useEffect(() => {
    pagination.resetPage();
  }, [
    searchQuery,
    filterClientName,
    filterTaskCategory,
    filterSubCategory,
    filterAssignedName,
    filterStatus,
    filterPaymentStatus,
    filterAssignmentDateFrom,
    filterAssignmentDateTo
  ]);
  const selectedTasks = reactExports.useMemo(() => {
    return tasksWithCaptain.filter((twc) => selectedTaskIds.has(twc.task.id)).map((twc) => twc.task);
  }, [tasksWithCaptain, selectedTaskIds]);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTaskIds(new Set(pagination.tasks.map((t) => t.task.id)));
    } else {
      setSelectedTaskIds(/* @__PURE__ */ new Set());
    }
  };
  const handleSelectTask = (taskId, checked) => {
    const newSelected = new Set(selectedTaskIds);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTaskIds(newSelected);
  };
  const handleBulkDelete = async () => {
    if (selectedTaskIds.size === 0) return;
    if (!confirm(`Delete ${selectedTaskIds.size} task(s)?`)) return;
    await bulkDeleteMutation.mutateAsync(Array.from(selectedTaskIds));
    setSelectedTaskIds(/* @__PURE__ */ new Set());
  };
  const handleExport = async () => {
    try {
      await exportTasksToExcel(filteredTasks);
      ue.success("Tasks exported successfully");
    } catch (_error) {
      ue.error("Failed to export tasks");
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["tasksWithCaptain"] });
      ue.success("Tasks refreshed successfully");
    } catch (_error) {
      ue.error("Failed to refresh tasks");
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const allSelected = pagination.tasks.length > 0 && selectedTaskIds.size === pagination.tasks.length;
  selectedTaskIds.size > 0 && selectedTaskIds.size < pagination.tasks.length;
  if (isError) {
    console.error("[TasksPage] Error loading tasks:", error);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Tasks" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-semibold mb-2", children: "Error loading tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: error instanceof Error ? error.message : "An unknown error occurred" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => window.location.reload(), children: "Reload Page" })
      ] }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Tasks" }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsCreateDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Task"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Search & Filter" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search tasks...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-10"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterClientName,
              onValueChange: setFilterClientName,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Client Name" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Clients" }),
                  uniqueClientNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: name, children: name }, name))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterTaskCategory,
              onValueChange: setFilterTaskCategory,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Task Category" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Categories" }),
                  uniqueTaskCategories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: category,
                      children: category
                    },
                    category
                  ))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterSubCategory,
              onValueChange: setFilterSubCategory,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sub Category" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[300px] overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Sub-Categories" }),
                  uniqueSubCategories.map((subCategory) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: subCategory,
                      children: subCategory
                    },
                    subCategory
                  ))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterAssignedName,
              onValueChange: setFilterAssignedName,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Assigned Name" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[300px] overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Assignees" }),
                  uniqueAssignedNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: name, children: name }, name))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Statuses" }),
              uniqueStatuses.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: status, children: status }, status))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterPaymentStatus,
              onValueChange: setFilterPaymentStatus,
              "data-ocid": "tasks.payment_status.select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Payment Status" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FILTER_ALL_SENTINEL, children: "All Payment Statuses" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Payment Pending", children: "Payment Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Advance Received", children: "Advance Received" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Partial Paid", children: "Partial Paid" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", children: "Paid" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Assignment Date:" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: filterAssignmentDateFrom,
                  onChange: (e) => setFilterAssignmentDateFrom(e.target.value),
                  className: "w-40 text-sm",
                  "data-ocid": "tasks.assignment_date_from.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: filterAssignmentDateTo,
                  onChange: (e) => setFilterAssignmentDateTo(e.target.value),
                  className: "w-40 text-sm",
                  "data-ocid": "tasks.assignment_date_to.input"
                }
              )
            ] }),
            (filterAssignmentDateFrom || filterAssignmentDateTo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => {
                  setFilterAssignmentDateFrom("");
                  setFilterAssignmentDateTo("");
                },
                className: "text-muted-foreground hover:text-foreground text-xs h-8 px-2",
                "data-ocid": "tasks.clear_date_filter.button",
                children: "Clear dates"
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    isAuthenticated && selectedTaskIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        selectedTaskIds.size,
        " task(s) selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setIsUploadDialogOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
              "Bulk Upload"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setIsBulkEditDialogOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2" }),
              "Bulk Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: handleBulkDelete,
            disabled: bulkDeleteMutation.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              "Delete Selected"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
            "Task List (",
            pagination.totalCount,
            ")"
          ] }),
          pagination.totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            pagination.startIndex,
            "-",
            pagination.endIndex,
            " of",
            " ",
            pagination.totalCount,
            " tasks"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleRefresh,
              disabled: isRefreshing || isFetching,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `h-4 w-4 mr-2 ${isRefreshing || isFetching ? "animate-spin" : ""}`
                  }
                ),
                "Refresh"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleExport, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Export to Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TaskListSkeleton, { rows: 15, showCheckbox: isAuthenticated }) : filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: searchQuery || filterClientName !== FILTER_ALL_SENTINEL || filterTaskCategory !== FILTER_ALL_SENTINEL || filterSubCategory !== FILTER_ALL_SENTINEL || filterAssignedName !== FILTER_ALL_SENTINEL || filterStatus !== FILTER_ALL_SENTINEL || filterPaymentStatus !== FILTER_ALL_SENTINEL || filterAssignmentDateFrom || filterAssignmentDateTo ? "No tasks found matching your filters." : "No tasks yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: allSelected,
                onCheckedChange: handleSelectAll,
                "aria-label": "Select all"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("clientName"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Client Name",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("taskCategory"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Category",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("subCategory"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Sub Category",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Comment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("assignedName"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Assigned To",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("dueDate"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Due Date",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("assignmentDate"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Assignment Date",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("completionDate"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Completion Date",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("bill"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Bill",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("advanceReceived"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Advance",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "cursor-pointer",
                onClick: () => handleSort("outstandingAmount"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  "Outstanding",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Payment Status" }),
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: pagination.tasks.map((twc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: selectedTaskIds.has(twc.task.id),
                onCheckedChange: (checked) => handleSelectTask(
                  twc.task.id,
                  checked
                ),
                "aria-label": `Select task ${twc.task.id}`
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: twc.task.clientName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: twc.task.taskCategory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: twc.task.subCategory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(TaskQuickStatus, { task: twc.task }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: twc.task.status || "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(InlineCommentEditor, { task: twc.task }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm truncate block", children: twc.task.comment || "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatAssigneeName(
              twc.task.assignedName,
              twc.captainName
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(twc.task.dueDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(twc.task.assignmentDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(twc.task.completionDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: twc.task.bill !== null && twc.task.bill !== void 0 ? `₹${twc.task.bill.toLocaleString()}` : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: twc.task.advanceReceived !== null && twc.task.advanceReceived !== void 0 ? `₹${twc.task.advanceReceived.toLocaleString()}` : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: twc.task.outstandingAmount !== null && twc.task.outstandingAmount !== void 0 ? `₹${twc.task.outstandingAmount.toLocaleString()}` : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: twc.task.paymentStatus }) }),
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setEditingTask(twc.task),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" })
              }
            ) })
          ] }, twc.task.id.toString())) })
        ] }) }),
        pagination.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Rows per page:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: pageSize.toString(),
                onValueChange: (value) => setPageSize(Number(value)),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", children: "20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", children: "50" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", children: "100" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: pagination.previousPage,
                disabled: !pagination.hasPreviousPage,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
                  "Previous"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "Page ",
              pagination.currentPage,
              " of ",
              pagination.totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: pagination.nextPage,
                disabled: !pagination.hasNextPage,
                children: [
                  "Next",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskFormDialog,
        {
          open: isCreateDialogOpen || !!editingTask,
          onOpenChange: (open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingTask(void 0);
            }
          },
          task: editingTask
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskBulkUploadDialog,
        {
          open: isUploadDialogOpen,
          onOpenChange: setIsUploadDialogOpen
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskBulkEditDialog,
        {
          open: isBulkEditDialogOpen,
          onOpenChange: (open) => {
            setIsBulkEditDialogOpen(open);
            if (!open) {
              setSelectedTaskIds(/* @__PURE__ */ new Set());
            }
          },
          selectedTasks
        }
      )
    ] })
  ] });
}
export {
  TasksPage as default
};
