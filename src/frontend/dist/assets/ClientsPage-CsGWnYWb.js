import { r as reactExports, j as jsxRuntimeExports, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogDescription, k as Label, B as Button, I as Input, C as CircleAlert, l as DialogFooter, n as useInternetIdentity, a as Card, b as CardHeader, d as CardTitle, e as CardContent, S as Search, o as ue } from "./index-E4Ulozb7.js";
import { D as Download, C as Checkbox } from "./checkbox-b_9v3WG-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DNUvlZTW.js";
import { A as Alert, a as AlertDescription } from "./alert-CZvl4qhn.js";
import { S as ScrollArea } from "./scroll-area-DF_6Rw0B.js";
import { a as useBulkCreateClients, b as useClients, c as useBulkDeleteClients } from "./clients-rcA9Qhaf.js";
import { C as CircleCheck, U as Upload } from "./upload-jd71oeFi.js";
import { C as ClientFormDialog } from "./ClientFormDialog--6KbNGV_.js";
import { P as Plus, T as Trash2 } from "./trash-2-D1i4ua7n.js";
import "./check-B-qnttsP.js";
import "./index-IXOTxK3N.js";
import "./alert-dialog-BmyNEFDO.js";
import "./textarea-C06pLURf.js";
const CSV_HEADERS = ["Client Name", "GSTIN", "PAN", "Notes"];
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
  link.setAttribute("download", "client_upload_template.csv");
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
    const gstin = values[1] || "";
    const pan = values[2] || "";
    const notes = values[3] || "";
    if (!name.trim()) {
      errors.push({
        row: rowNumber,
        column: "Client Name",
        message: "Client Name is required"
      });
    }
    rows.push({
      name: name.trim(),
      gstin: gstin.trim() || void 0,
      pan: pan.trim() || void 0,
      notes: notes.trim() || void 0
    });
  });
  return { rows, errors };
}
function convertRowsToBackendFormat(rows) {
  return rows.map((row) => ({
    name: row.name,
    gstin: row.gstin,
    pan: row.pan,
    notes: row.notes
  }));
}
function ClientBulkUploadDialog({
  open,
  onOpenChange
}) {
  const [_file, setFile] = reactExports.useState(null);
  const [parsedRows, setParsedRows] = reactExports.useState([]);
  const [validationErrors, setValidationErrors] = reactExports.useState(
    []
  );
  const [uploadSuccess, setUploadSuccess] = reactExports.useState(false);
  const { mutate: bulkCreateClients, isPending } = useBulkCreateClients();
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadSuccess(false);
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
    if (validationErrors.length > 0) return;
    if (parsedRows.length === 0) return;
    const backendFormat = convertRowsToBackendFormat(parsedRows);
    bulkCreateClients(backendFormat, {
      onSuccess: () => {
        setUploadSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
        }, 1500);
      }
    });
  };
  const resetForm = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadSuccess(false);
  };
  const handleClose = (open2) => {
    if (!open2) {
      resetForm();
    }
    onOpenChange(open2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk Upload Clients" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload a CSV file to create multiple clients at once" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 flex-1 overflow-hidden flex flex-col", children: [
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
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "csv-file", children: "Step 2: Upload Completed CSV" }),
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
      uploadSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600 dark:text-green-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-green-800 dark:text-green-200", children: [
          "Successfully uploaded ",
          parsedRows.length,
          " clients!"
        ] })
      ] }),
      validationErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mb-2", children: [
            "Found ",
            validationErrors.length,
            " validation error",
            validationErrors.length !== 1 ? "s" : "",
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 text-sm", children: validationErrors.map((error, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: validation error list has no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Row ",
              error.row,
              ", ",
              error.column,
              ": ",
              error.message
            ] }, idx)
          )) }) })
        ] })
      ] }),
      parsedRows.length > 0 && validationErrors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1 overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Preview (",
          parsedRows.length,
          " clients)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 border rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Client Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "GSTIN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "PAN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Notes" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: parsedRows.map((row, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: preview rows have no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: row.gstin || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: row.pan || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs truncate", children: row.notes || "-" })
            ] }, idx)
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
          onClick: () => handleClose(false),
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
          className: "bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]",
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Uploading..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
            "Upload ",
            parsedRows.length,
            " Clients"
          ] })
        }
      )
    ] })
  ] }) });
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
async function exportClientsToExcel(clients) {
  try {
    const XLSX = await loadSheetJS();
    const excelData = clients.map((client) => ({
      "Client Name": client.name,
      GSTIN: client.gstin || "",
      PAN: client.pan || "",
      Notes: client.notes || ""
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const filename = `clients_export_${date}.xlsx`;
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Failed to export clients to Excel:", error);
    throw new Error("Failed to export clients to Excel");
  }
}
function ClientsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: clients = [], isLoading } = useClients();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedClients, setSelectedClients] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = reactExports.useState(false);
  const [editingClient, setEditingClient] = reactExports.useState(
    void 0
  );
  const bulkDeleteMutation = useBulkDeleteClients();
  const filteredClients = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) => {
        var _a, _b;
        return client.name.toLowerCase().includes(query) || ((_a = client.gstin) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = client.pan) == null ? void 0 : _b.toLowerCase().includes(query));
      }
    );
  }, [clients, searchQuery]);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(new Set(filteredClients.map((c) => c.id)));
    } else {
      setSelectedClients(/* @__PURE__ */ new Set());
    }
  };
  const handleSelectClient = (clientId, checked) => {
    const newSelected = new Set(selectedClients);
    if (checked) {
      newSelected.add(clientId);
    } else {
      newSelected.delete(clientId);
    }
    setSelectedClients(newSelected);
  };
  const handleBulkDelete = async () => {
    if (selectedClients.size === 0) return;
    if (!confirm(`Delete ${selectedClients.size} client(s)?`)) return;
    await bulkDeleteMutation.mutateAsync(Array.from(selectedClients));
    setSelectedClients(/* @__PURE__ */ new Set());
  };
  const handleExport = async () => {
    try {
      await exportClientsToExcel(filteredClients);
      ue.success("Clients exported successfully");
    } catch (_error) {
      ue.error("Failed to export clients");
    }
  };
  const allSelected = filteredClients.length > 0 && selectedClients.size === filteredClients.length;
  const someSelected = selectedClients.size > 0 && selectedClients.size < filteredClients.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Clients" }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsCreateDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Client"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Search & Filter" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name, GSTIN, or PAN...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10"
          }
        )
      ] }) }) })
    ] }),
    isAuthenticated && selectedClients.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        selectedClients.size,
        " client(s) selected"
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
          "Client List (",
          filteredClients.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleExport, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
          "Export to Excel"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading clients..." }) : filteredClients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: searchQuery ? "No clients found matching your search." : "No clients yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Client Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "GSTIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "PAN" }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredClients.map((client) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: selectedClients.has(client.id),
              onCheckedChange: (checked) => handleSelectClient(client.id, checked),
              "aria-label": `Select ${client.name}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: client.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: client.gstin || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: client.pan || "-" }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setEditingClient(client),
              children: "Edit"
            }
          ) })
        ] }, client.id.toString())) })
      ] }) }) })
    ] }),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ClientFormDialog,
        {
          open: isCreateDialogOpen || !!editingClient,
          onOpenChange: (open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingClient(void 0);
            }
          },
          client: editingClient
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ClientBulkUploadDialog,
        {
          open: isUploadDialogOpen,
          onOpenChange: setIsUploadDialogOpen
        }
      )
    ] })
  ] });
}
export {
  ClientsPage as default
};
