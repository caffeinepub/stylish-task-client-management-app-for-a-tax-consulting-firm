import { r as reactExports, j as jsxRuntimeExports, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogDescription, k as Label, B as Button, I as Input, C as CircleAlert, l as DialogFooter, L as LoaderCircle, m as DialogTrigger, n as useInternetIdentity, a as Card, b as CardHeader, d as CardTitle, e as CardContent, S as Search, o as ue } from "./index-E4Ulozb7.js";
import { D as Download, C as Checkbox } from "./checkbox-b_9v3WG-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DNUvlZTW.js";
import { A as Alert, a as AlertDescription } from "./alert-CZvl4qhn.js";
import { u as useBulkCreateAssignees, a as useCreateAssignee, b as useUpdateAssignee, c as useDeleteAssignee, d as useAssignees, e as useBulkDeleteAssignees } from "./assignees-CKUTaRF1.js";
import { C as CircleCheck, U as Upload } from "./upload-jd71oeFi.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BmyNEFDO.js";
import { P as Plus, T as Trash2 } from "./trash-2-D1i4ua7n.js";
import "./check-B-qnttsP.js";
const CSV_HEADERS = ["Team Name", "Captain"];
function generateCsvTemplate() {
  return `${CSV_HEADERS.join(",")}
`;
}
function downloadCsvTemplate() {
  const csv = generateCsvTemplate();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "assignee_upload_template.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const errors = [];
  const rows = [];
  if (lines.length === 0) {
    errors.push({ row: 0, column: "File", message: "CSV file is empty" });
    return { rows, errors };
  }
  const dataLines = lines.slice(1);
  dataLines.forEach((line, index) => {
    const rowNumber = index + 2;
    const values = parseCsvLine(line);
    if (values.length === 0 || values.every((v) => !v)) {
      return;
    }
    const name = values[0] || "";
    const captain = values[1] || "";
    if (!name.trim()) {
      errors.push({
        row: rowNumber,
        column: "Team Name",
        message: "Team Name is required"
      });
    }
    if (!captain.trim()) {
      errors.push({
        row: rowNumber,
        column: "Captain",
        message: "Captain is required"
      });
    }
    rows.push({
      name: name.trim(),
      captain: captain.trim() || void 0
    });
  });
  return { rows, errors };
}
function convertRowsToBackendFormat(rows) {
  return rows.map((row) => ({
    name: row.name,
    captain: row.captain
  }));
}
function AssigneeBulkUploadDialog({
  open,
  onOpenChange
}) {
  const [_file, setFile] = reactExports.useState(null);
  const [parsedRows, setParsedRows] = reactExports.useState([]);
  const [validationErrors, setValidationErrors] = reactExports.useState(
    []
  );
  const [uploadError, setUploadError] = reactExports.useState(null);
  const { mutate: bulkCreateAssignees, isPending } = useBulkCreateAssignees();
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      var _a2;
      const csvContent = (_a2 = event.target) == null ? void 0 : _a2.result;
      const { rows, errors } = parseCsvFile(csvContent);
      setParsedRows(rows);
      setValidationErrors(errors);
    };
    reader.readAsText(selectedFile);
  };
  const handleSubmit = () => {
    if (validationErrors.length > 0) {
      setUploadError("Please fix validation errors before uploading");
      return;
    }
    if (parsedRows.length === 0) {
      setUploadError("No valid rows to upload");
      return;
    }
    const assigneeInputs = convertRowsToBackendFormat(parsedRows);
    bulkCreateAssignees(assigneeInputs, {
      onSuccess: () => {
        onOpenChange(false);
        resetState();
      },
      onError: (error) => {
        setUploadError(error.message || "Failed to upload assignees");
      }
    });
  };
  const resetState = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadError(null);
  };
  const handleClose = () => {
    if (!isPending) {
      onOpenChange(false);
      resetState();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[700px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk Upload Assignees" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload multiple assignees at once using a CSV file" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Step 1: Download Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: downloadCsvTemplate,
            className: "w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Download CSV Template"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Download the template, fill in your assignee data (Team Name and Captain), and upload it below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "csv-file", children: "Step 2: Upload Filled CSV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "csv-file",
            type: "file",
            accept: ".csv",
            onChange: handleFileChange,
            disabled: isPending
          }
        )
      ] }),
      validationErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-2", children: "Validation Errors:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1", children: validationErrors.map((error, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: validation error list has no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm", children: [
              "Row ",
              error.row,
              ", ",
              error.column,
              ": ",
              error.message
            ] }, index)
          )) })
        ] })
      ] }),
      uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
      ] }),
      parsedRows.length > 0 && validationErrors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
          "Ready to upload ",
          parsedRows.length,
          " assignee",
          parsedRows.length !== 1 ? "s" : ""
        ] })
      ] }),
      parsedRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Preview (",
          parsedRows.length,
          " rows)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border max-h-[300px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Team Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Captain" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: parsedRows.map((row, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: preview rows have no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: row.captain || "-" })
            ] }, index)
          )) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleClose,
          disabled: isPending,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: handleSubmit,
          disabled: isPending || parsedRows.length === 0 || validationErrors.length > 0,
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Uploading..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
            "Upload ",
            parsedRows.length,
            " Assignee",
            parsedRows.length !== 1 ? "s" : ""
          ] })
        }
      )
    ] })
  ] }) });
}
function AssigneeFormDialog({
  open,
  onOpenChange,
  assignee,
  trigger
}) {
  const isEdit = !!assignee;
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [captain, setCaptain] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const { mutate: createAssignee, isPending: isCreating } = useCreateAssignee();
  const { mutate: updateAssignee, isPending: isUpdating } = useUpdateAssignee();
  const { mutate: deleteAssignee, isPending: isDeleting } = useDeleteAssignee();
  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== void 0 ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;
  reactExports.useEffect(() => {
    if (assignee) {
      setName(assignee.name);
      setCaptain(assignee.captain || "");
    } else {
      resetForm();
    }
  }, [assignee, dialogOpen]);
  const resetForm = () => {
    setName("");
    setCaptain("");
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Team Name is required";
    }
    if (!captain.trim()) {
      newErrors.captain = "Captain is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const assigneeData = {
      name: name.trim(),
      captain: captain.trim() || void 0
    };
    if (isEdit && assignee) {
      updateAssignee(
        {
          assigneeId: assignee.id,
          assignee: assigneeData
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          }
        }
      );
    } else {
      createAssignee(assigneeData, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        }
      });
    }
  };
  const handleDelete = () => {
    if (assignee) {
      deleteAssignee(assignee.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDialogOpen(false);
          resetForm();
        }
      });
    }
  };
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isEdit ? "Edit Assignee" : "Add New Assignee" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isEdit ? "Update assignee information" : "Enter assignee details to get started" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Team Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Team name",
              disabled: isPending
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "captain", children: "Captain *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "captain",
              value: captain,
              onChange: (e) => setCaptain(e.target.value),
              placeholder: "Captain name",
              disabled: isPending
            }
          ),
          errors.captain && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.captain })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        isEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "destructive",
            onClick: () => setDeleteDialogOpen(true),
            disabled: isPending,
            children: "Delete"
          }
        ),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Saving..."
        ] }) : isEdit ? "Update" : "Create" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Assignee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this assignee? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: isDeleting,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Deleting..."
            ] }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
  if (trigger) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dialog,
      {
        open: dialogOpen,
        onOpenChange: (newOpen) => !isPending && setDialogOpen(newOpen),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogContent,
            {
              onEscapeKeyDown: (e) => isPending && e.preventDefault(),
              onPointerDownOutside: (e) => isPending && e.preventDefault(),
              children: content
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: dialogOpen,
      onOpenChange: (newOpen) => !isPending && setDialogOpen(newOpen),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogContent,
        {
          onEscapeKeyDown: (e) => isPending && e.preventDefault(),
          onPointerDownOutside: (e) => isPending && e.preventDefault(),
          children: content
        }
      )
    }
  );
}
async function loadSheetJS() {
  if (window.XLSX) {
    return window.XLSX;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js";
    script.onload = () => {
      if (window.XLSX) {
        resolve(window.XLSX);
      } else {
        reject(new Error("Failed to load SheetJS library"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load SheetJS library"));
    document.head.appendChild(script);
  });
}
async function exportAssigneesToExcel(assignees) {
  try {
    const XLSX = await loadSheetJS();
    const excelData = assignees.map((assignee) => ({
      "Team Name": assignee.name,
      Captain: assignee.captain || ""
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignees");
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const filename = `assignees_export_${date}.xlsx`;
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Failed to export assignees to Excel:", error);
    throw new Error("Failed to export assignees to Excel");
  }
}
function AssigneesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: assignees = [], isLoading } = useAssignees();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedAssignees, setSelectedAssignees] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = reactExports.useState(false);
  const [editingAssignee, setEditingAssignee] = reactExports.useState(
    void 0
  );
  const bulkDeleteMutation = useBulkDeleteAssignees();
  const filteredAssignees = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return assignees;
    const query = searchQuery.toLowerCase();
    return assignees.filter(
      (assignee) => {
        var _a;
        return assignee.name.toLowerCase().includes(query) || ((_a = assignee.captain) == null ? void 0 : _a.toLowerCase().includes(query));
      }
    );
  }, [assignees, searchQuery]);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAssignees(new Set(filteredAssignees.map((a) => a.id)));
    } else {
      setSelectedAssignees(/* @__PURE__ */ new Set());
    }
  };
  const handleSelectAssignee = (assigneeId, checked) => {
    const newSelected = new Set(selectedAssignees);
    if (checked) {
      newSelected.add(assigneeId);
    } else {
      newSelected.delete(assigneeId);
    }
    setSelectedAssignees(newSelected);
  };
  const handleBulkDelete = async () => {
    if (selectedAssignees.size === 0) return;
    if (!confirm(`Delete ${selectedAssignees.size} assignee(s)?`)) return;
    await bulkDeleteMutation.mutateAsync(Array.from(selectedAssignees));
    setSelectedAssignees(/* @__PURE__ */ new Set());
  };
  const handleExport = async () => {
    try {
      await exportAssigneesToExcel(filteredAssignees);
      ue.success("Assignees exported successfully");
    } catch (_error) {
      ue.error("Failed to export assignees");
    }
  };
  const allSelected = filteredAssignees.length > 0 && selectedAssignees.size === filteredAssignees.length;
  const someSelected = selectedAssignees.size > 0 && selectedAssignees.size < filteredAssignees.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Assignees" }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsCreateDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Assignee"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Search & Filter" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by team name or captain...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10"
          }
        )
      ] }) }) })
    ] }),
    isAuthenticated && selectedAssignees.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        selectedAssignees.size,
        " assignee(s) selected"
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
          "Assignee List (",
          filteredAssignees.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleExport, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
          "Export to Excel"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading assignees..." }) : filteredAssignees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: searchQuery ? "No assignees found matching your search." : "No assignees yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: allSelected,
              onCheckedChange: handleSelectAll,
              "aria-label": "Select all",
              className: someSelected ? "data-[state=checked]:bg-primary/50" : ""
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Team Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Captain" }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredAssignees.map((assignee) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: selectedAssignees.has(assignee.id),
              onCheckedChange: (checked) => handleSelectAssignee(
                assignee.id,
                checked
              ),
              "aria-label": `Select ${assignee.name}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: assignee.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: assignee.captain || "-" }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setEditingAssignee(assignee),
              children: "Edit"
            }
          ) })
        ] }, assignee.id.toString())) })
      ] }) }) })
    ] }),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AssigneeFormDialog,
        {
          open: isCreateDialogOpen || !!editingAssignee,
          onOpenChange: (open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingAssignee(void 0);
            }
          },
          assignee: editingAssignee
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AssigneeBulkUploadDialog,
        {
          open: isUploadDialogOpen,
          onOpenChange: setIsUploadDialogOpen
        }
      )
    ] })
  ] });
}
export {
  AssigneesPage as default
};
