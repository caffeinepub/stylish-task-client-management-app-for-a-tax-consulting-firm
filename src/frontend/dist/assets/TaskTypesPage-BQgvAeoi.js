import { r as reactExports, j as jsxRuntimeExports, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogDescription, k as Label, I as Input, B as Button, X, l as DialogFooter, L as LoaderCircle, n as useInternetIdentity, a as Card, b as CardHeader, d as CardTitle, e as CardContent, S as Search } from "./index-CwPN-Z9U.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DLcDKmk8.js";
import { B as Badge } from "./badge-DgL4lT8Y.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-0Q2ishyL.js";
import { u as useCreateTaskType, a as useUpdateTaskType, b as useTaskTypes, c as useDeleteTaskTypes } from "./taskTypes-D85FqCOi.js";
import { P as Plus, T as Trash2 } from "./trash-2-nTP7VOfC.js";
import { S as SquarePen } from "./square-pen-Ds8MWI9B.js";
function TaskTypeFormDialog({
  open,
  onOpenChange,
  taskType
}) {
  const isEdit = !!taskType;
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [subtypes, setSubtypes] = reactExports.useState([""]);
  const [errors, setErrors] = reactExports.useState({});
  const { mutate: createTaskType, isPending: isCreating } = useCreateTaskType();
  const { mutate: updateTaskType, isPending: isUpdating } = useUpdateTaskType();
  const isPending = isCreating || isUpdating;
  const dialogOpen = open !== void 0 ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;
  reactExports.useEffect(() => {
    if (taskType) {
      setName(taskType.name);
      setSubtypes(taskType.subtypes.length > 0 ? taskType.subtypes : [""]);
    } else {
      resetForm();
    }
  }, [taskType, dialogOpen]);
  const resetForm = () => {
    setName("");
    setSubtypes([""]);
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Type name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddSubtype = () => {
    setSubtypes([...subtypes, ""]);
  };
  const handleRemoveSubtype = (index) => {
    if (subtypes.length > 1) {
      setSubtypes(subtypes.filter((_, i) => i !== index));
    }
  };
  const handleSubtypeChange = (index, value) => {
    const newSubtypes = [...subtypes];
    newSubtypes[index] = value;
    setSubtypes(newSubtypes);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const filteredSubtypes = subtypes.filter((s) => s.trim() !== "");
    if (isEdit && taskType) {
      updateTaskType(
        {
          id: taskType.id,
          name: name.trim(),
          subtypes: filteredSubtypes
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          }
        }
      );
    } else {
      createTaskType(
        {
          name: name.trim(),
          subtypes: filteredSubtypes
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
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[500px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isEdit ? "Edit Task Type" : "Create Task Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isEdit ? "Update task type information" : "Enter task type details to get started" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "name", children: [
              "Type Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g., Tax Filing, Audit, Compliance",
                disabled: isPending
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subtypes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subtypes.map((subtype, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: subtypes list has no stable id
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: subtype,
                    onChange: (e) => handleSubtypeChange(index, e.target.value),
                    placeholder: `Subtype ${index + 1}`,
                    disabled: isPending
                  }
                ),
                subtypes.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleRemoveSubtype(index),
                    disabled: isPending,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }, index)
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: handleAddSubtype,
                disabled: isPending,
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                  "Add Subtype"
                ]
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
function TaskTypesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: taskTypes = [], isLoading } = useTaskTypes();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [editingTaskType, setEditingTaskType] = reactExports.useState(
    void 0
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [taskTypeToDelete, setTaskTypeToDelete] = reactExports.useState(
    null
  );
  const deleteTaskTypesMutation = useDeleteTaskTypes();
  const filteredTaskTypes = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return taskTypes;
    const query = searchQuery.toLowerCase();
    return taskTypes.filter(
      (taskType) => taskType.name.toLowerCase().includes(query) || taskType.subtypes.some(
        (subtype) => subtype.toLowerCase().includes(query)
      )
    );
  }, [taskTypes, searchQuery]);
  const handleDeleteClick = (taskTypeId) => {
    setTaskTypeToDelete(taskTypeId);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (taskTypeToDelete !== null) {
      await deleteTaskTypesMutation.mutateAsync([taskTypeToDelete]);
      setDeleteDialogOpen(false);
      setTaskTypeToDelete(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Task Types" }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsCreateDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Create Task Type"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Search & Filter" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by type name or subtypes...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
        "Task Type List (",
        filteredTaskTypes.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading task types..." }) : filteredTaskTypes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: searchQuery ? "No task types found matching your search." : "No task types yet. Create one to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subtypes" }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredTaskTypes.map((taskType) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: taskType.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: taskType.subtypes.length > 0 ? taskType.subtypes.map((subtype, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: subtype list has no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: subtype }, index)
          )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "No subtypes" }) }) }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setEditingTaskType(taskType),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-1" }),
                  "Edit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => handleDeleteClick(taskType.id),
                className: "text-destructive hover:text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
                  "Delete"
                ]
              }
            )
          ] }) })
        ] }, taskType.id.toString())) })
      ] }) }) })
    ] }),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskTypeFormDialog,
        {
          open: isCreateDialogOpen || !!editingTaskType,
          onOpenChange: (open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingTaskType(void 0);
            }
          },
          taskType: editingTaskType
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialog,
        {
          open: deleteDialogOpen,
          onOpenChange: setDeleteDialogOpen,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Task Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this task type? This action cannot be undone." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  onClick: handleDeleteConfirm,
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  children: "Delete"
                }
              )
            ] })
          ] })
        }
      )
    ] })
  ] });
}
export {
  TaskTypesPage as default
};
