import { r as reactExports, j as jsxRuntimeExports, P as Primitive, p as cn, a as Card, b as CardHeader, d as CardTitle, e as CardContent, q as useParams, u as useNavigate, C as CircleAlert, B as Button, s as CardDescription } from "./index-CIYCVZFK.js";
import { A as Alert, a as AlertDescription } from "./alert-BJ4vRlvq.js";
import { P as Popover, a as PopoverTrigger, C as ChevronsUpDown, b as PopoverContent, c as Command, d as CommandInput, e as CommandList, f as CommandEmpty, g as CommandGroup, h as CommandItem } from "./popover-hLl8jF9_.js";
import { S as Skeleton } from "./skeleton-D-SLxFNU.js";
import { C as ClientFormDialog } from "./ClientFormDialog-DLUCXjuR.js";
import { B as Badge } from "./badge-nn_00--e.js";
import { g as getStatusDisplayLabel } from "./taskStatus-AmY6QXne.js";
import { f as formatAssigneeWithCaptain, a as formatTaskDate, b as formatCurrency } from "./taskDisplay-Dg2klV0Y.js";
import { u as useGetAllClients } from "./clients-I2sGyIgN.js";
import { u as useGetAllTasks } from "./tasks-g8CyW862.js";
import { A as ArrowLeft } from "./arrow-left-Df1l6wmN.js";
import { C as Check } from "./check-Bm3Y5r9f.js";
import { S as SquarePen } from "./square-pen-BAsT1jt-.js";
import "./alert-dialog-rZWgvcWb.js";
import "./textarea-Ba5fU_GZ.js";
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function PaymentStatusBadge({ status }) {
  if (!status) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "—" });
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
function TaskDetailsPanel({
  task,
  captainName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl", children: task.clientName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          task.taskCategory,
          " • ",
          task.subCategory
        ] })
      ] }),
      task.status && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: getStatusDisplayLabel(task.status) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Assigned Team" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: formatAssigneeWithCaptain(task.assignedName, captainName) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Due Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: formatTaskDate(task.dueDate) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Assignment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: formatTaskDate(task.assignmentDate) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Completion Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: formatTaskDate(task.completionDate) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Bill Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mt-1", children: formatCurrency(task.bill) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Advance Received" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mt-1", children: formatCurrency(task.advanceReceived) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Outstanding" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mt-1", children: formatCurrency(task.outstandingAmount) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Payment Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: task.paymentStatus })
      ] }),
      task.comment && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Comment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 whitespace-pre-wrap", children: task.comment })
        ] })
      ] })
    ] })
  ] });
}
function ClientDetailPage() {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const navigate = useNavigate();
  const {
    data: clients,
    isLoading: clientsLoading,
    error: clientsError
  } = useGetAllClients();
  const { data: tasksWithCaptain, isLoading: tasksLoading } = useGetAllTasks();
  const [editDialogOpen, setEditDialogOpen] = reactExports.useState(false);
  const [clientSelectorOpen, setClientSelectorOpen] = reactExports.useState(false);
  const client = reactExports.useMemo(() => {
    if (!clients) return null;
    return clients.find((c) => c.id.toString() === clientId) || null;
  }, [clients, clientId]);
  const clientTasks = reactExports.useMemo(() => {
    if (!tasksWithCaptain || !client) return [];
    return tasksWithCaptain.filter(
      (twc) => twc.task.clientName === client.name
    );
  }, [tasksWithCaptain, client]);
  const sortedClients = reactExports.useMemo(() => {
    if (!clients) return [];
    return [...clients].sort((a, b) => a.name.localeCompare(b.name));
  }, [clients]);
  const handleClientSelect = (selectedClientId) => {
    setClientSelectorOpen(false);
    navigate({
      to: "/clients/$clientId",
      params: { clientId: selectedClientId }
    });
  };
  if (clientsError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: clientsError instanceof Error ? clientsError.message : "Failed to load client" })
    ] }) });
  }
  if (clientsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] });
  }
  if (!client) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Client not found" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({ to: "/clients" }), className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to Clients"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => navigate({ to: "/clients" }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Popover,
          {
            open: clientSelectorOpen,
            onOpenChange: setClientSelectorOpen,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  role: "combobox",
                  "aria-expanded": clientSelectorOpen,
                  className: "justify-between min-w-[300px]",
                  children: [
                    client.name,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-[300px] p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search client..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No client found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: sortedClients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: c.name,
                      onSelect: () => handleClientSelect(c.id.toString()),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Check,
                          {
                            className: cn(
                              "mr-2 h-4 w-4",
                              client.id === c.id ? "opacity-100" : "opacity-0"
                            )
                          }
                        ),
                        c.name
                      ]
                    },
                    c.id.toString()
                  )) })
                ] })
              ] }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEditDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "mr-2 h-4 w-4" }),
        "Edit Client"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: client.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Client Information" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        client.gstin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground mb-1", children: "GSTIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base", children: client.gstin })
        ] }),
        client.pan && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground mb-1", children: "PAN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base", children: client.pan })
        ] }),
        client.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base whitespace-pre-wrap", children: client.notes })
        ] }),
        !client.gstin && !client.pan && !client.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No additional information available" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          clientTasks.length,
          " task",
          clientTasks.length !== 1 ? "s" : "",
          " for this client"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: tasksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items have no stable id
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }, i)
      )) }) : clientTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No tasks found for this client" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: clientTasks.map((taskWithCaptain) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TaskDetailsPanel,
          {
            task: taskWithCaptain.task,
            captainName: taskWithCaptain.captainName
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mt-4" })
      ] }, taskWithCaptain.task.id.toString())) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClientFormDialog,
      {
        open: editDialogOpen,
        onOpenChange: setEditDialogOpen,
        client
      }
    )
  ] });
}
export {
  ClientDetailPage as default
};
