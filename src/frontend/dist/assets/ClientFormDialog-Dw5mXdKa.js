import { r as reactExports, j as jsxRuntimeExports, g as DialogHeader, h as DialogTitle, i as DialogDescription, k as Label, I as Input, l as DialogFooter, B as Button, L as LoaderCircle, D as Dialog, m as DialogTrigger, f as DialogContent } from "./index-CH800m5e.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D8GhQSBl.js";
import { T as Textarea } from "./textarea-D6zL6SzG.js";
import { d as useCreateClient, e as useUpdateClient, f as useDeleteClient } from "./clients-BspNZs9g.js";
function ClientFormDialog({
  open,
  onOpenChange,
  client,
  trigger
}) {
  const isEdit = !!client;
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [gstin, setGstin] = reactExports.useState("");
  const [pan, setPan] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();
  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== void 0 ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;
  reactExports.useEffect(() => {
    if (client) {
      setName(client.name);
      setGstin(client.gstin || "");
      setPan(client.pan || "");
      setNotes(client.notes || "");
    } else {
      resetForm();
    }
  }, [client, dialogOpen]);
  const resetForm = () => {
    setName("");
    setGstin("");
    setPan("");
    setNotes("");
    setErrors({});
  };
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const clientData = {
      name: name.trim(),
      gstin: gstin.trim() || void 0,
      pan: pan.trim() || void 0,
      notes: notes.trim() || void 0
    };
    if (isEdit && client) {
      updateClient(
        {
          clientId: client.id,
          client: clientData
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          }
        }
      );
    } else {
      createClient(clientData, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        }
      });
    }
  };
  const handleDelete = () => {
    if (client) {
      deleteClient(client.id, {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isEdit ? "Edit Client" : "Add New Client" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isEdit ? "Update client information" : "Enter client details to get started" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Client Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Client name",
              disabled: isPending
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gstin", children: "GSTIN (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "gstin",
              value: gstin,
              onChange: (e) => setGstin(e.target.value),
              placeholder: "GSTIN number",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pan", children: "PAN (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "pan",
              value: pan,
              onChange: (e) => setPan(e.target.value),
              placeholder: "PAN number",
              disabled: isPending
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Notes (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Additional notes...",
              rows: 3,
              disabled: isPending
            }
          )
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this client? This action cannot be undone." })
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
export {
  ClientFormDialog as C
};
