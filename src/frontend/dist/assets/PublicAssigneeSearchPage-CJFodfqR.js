import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, X, k as Label, I as Input, o as ue, t as useActor, v as useQuery, a as Card, b as CardHeader, d as CardTitle, S as Search, s as CardDescription, e as CardContent, U as Users, w as SquareCheckBig } from "./index-CIYCVZFK.js";
import { B as Badge } from "./badge-nn_00--e.js";
import { D as Download, C as Checkbox } from "./checkbox-CY8LbhKR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0qB5Vxp.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BQeX1_Qr.js";
import { g as getStatusDisplayLabel, A as ALLOWED_TASK_STATUSES } from "./taskStatus-AmY6QXne.js";
import { c as formatOptionalText, a as formatTaskDate } from "./taskDisplay-Dg2klV0Y.js";
import { e as exportTasksToExcel } from "./taskExcel-B3RMApwU.js";
import { A as ArrowLeft } from "./arrow-left-Df1l6wmN.js";
import "./check-Bm3Y5r9f.js";
import "./index-IXOTxK3N.js";
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
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode);
function toStartOfDayMs(isoDate) {
  const d = new Date(isoDate);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function toEndOfDayMs(isoDate) {
  const d = new Date(isoDate);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
function PublicTasksTable({ tasks }) {
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [exporting, setExporting] = reactExports.useState(false);
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterAssignedFrom, setFilterAssignedFrom] = reactExports.useState("");
  const [filterAssignedTo, setFilterAssignedTo] = reactExports.useState("");
  const [filterSearch, setFilterSearch] = reactExports.useState("");
  const filteredTasks = reactExports.useMemo(() => {
    let result = [...tasks];
    if (filterSearch.trim()) {
      const q = filterSearch.trim().toLowerCase();
      result = result.filter(
        (t) => (t.clientName || "").toLowerCase().includes(q) || (t.taskCategory || "").toLowerCase().includes(q) || (t.subCategory || "").toLowerCase().includes(q) || (t.assignedName || "").toLowerCase().includes(q) || (t.comment || "").toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") {
      result = result.filter(
        (t) => getStatusDisplayLabel(t.status) === filterStatus
      );
    }
    if (filterAssignedFrom) {
      const fromMs = toStartOfDayMs(filterAssignedFrom);
      result = result.filter((t) => {
        if (!t.assignmentDate) return false;
        const tsMs = Number(t.assignmentDate) / 1e6;
        return tsMs >= fromMs;
      });
    }
    if (filterAssignedTo) {
      const toMs = toEndOfDayMs(filterAssignedTo);
      result = result.filter((t) => {
        if (!t.assignmentDate) return false;
        const tsMs = Number(t.assignmentDate) / 1e6;
        return tsMs <= toMs;
      });
    }
    result.sort((a, b) => {
      const statusA = a.status || "Pending";
      const statusB = b.status || "Pending";
      if (statusA === "Pending" && statusB !== "Pending") return -1;
      if (statusA !== "Pending" && statusB === "Pending") return 1;
      const dueDateA = a.dueDate ? Number(a.dueDate) : Number.MAX_SAFE_INTEGER;
      const dueDateB = b.dueDate ? Number(b.dueDate) : Number.MAX_SAFE_INTEGER;
      return dueDateA - dueDateB;
    });
    return result;
  }, [tasks, filterStatus, filterAssignedFrom, filterAssignedTo, filterSearch]);
  const hasActiveFilters = filterStatus !== "all" || filterAssignedFrom !== "" || filterAssignedTo !== "" || filterSearch !== "";
  const clearFilters = () => {
    setFilterStatus("all");
    setFilterAssignedFrom("");
    setFilterAssignedTo("");
    setFilterSearch("");
    setSelectedIds(/* @__PURE__ */ new Set());
  };
  const allSelected = filteredTasks.length > 0 && selectedIds.size === filteredTasks.length;
  const someSelected = selectedIds.size > 0 && !allSelected;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(/* @__PURE__ */ new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t.id.toString())));
    }
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const handleExport = async () => {
    const toExport = selectedIds.size > 0 ? filteredTasks.filter((t) => selectedIds.has(t.id.toString())) : filteredTasks;
    if (toExport.length === 0) {
      ue.error("No tasks to export");
      return;
    }
    setExporting(true);
    try {
      await exportTasksToExcel(toExport);
      ue.success(
        `Exported ${toExport.length} task${toExport.length !== 1 ? "s" : ""} to Excel`
      );
    } catch {
      ue.error("Failed to export tasks");
    } finally {
      setExporting(false);
    }
  };
  const getStatusVariant = (status) => {
    const normalized = getStatusDisplayLabel(status);
    switch (normalized) {
      case "Completed":
        return "default";
      case "In Progress":
      case "Checking":
        return "secondary";
      case "Pending":
      case "Docs Pending":
      case "Payment Pending":
        return "outline";
      case "Hold":
        return "destructive";
      default:
        return "outline";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border bg-muted/30 p-4 space-y-3",
        "data-ocid": "public_tasks.filter.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }),
            "Filters",
            hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: clearFilters,
                className: "ml-auto h-7 gap-1 text-xs",
                "data-ocid": "public_tasks.filter.clear_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                  "Clear all"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Search" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Client, assignee, comment...",
                  value: filterSearch,
                  onChange: (e) => {
                    setFilterSearch(e.target.value);
                    setSelectedIds(/* @__PURE__ */ new Set());
                  },
                  className: "h-9 text-sm",
                  "data-ocid": "public_tasks.filter.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: filterStatus,
                  onValueChange: (v) => {
                    setFilterStatus(v);
                    setSelectedIds(/* @__PURE__ */ new Set());
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-9 text-sm",
                        "data-ocid": "public_tasks.filter.status_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
                      ALLOWED_TASK_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Assigned From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: filterAssignedFrom,
                  onChange: (e) => {
                    setFilterAssignedFrom(e.target.value);
                    setSelectedIds(/* @__PURE__ */ new Set());
                  },
                  className: "h-9 text-sm",
                  "data-ocid": "public_tasks.filter.assigned_from_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Assigned To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: filterAssignedTo,
                  onChange: (e) => {
                    setFilterAssignedTo(e.target.value);
                    setSelectedIds(/* @__PURE__ */ new Set());
                  },
                  className: "h-9 text-sm",
                  "data-ocid": "public_tasks.filter.assigned_to_input"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: selectedIds.size > 0 ? `${selectedIds.size} of ${filteredTasks.length} selected` : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}${hasActiveFilters ? ` (filtered from ${tasks.length})` : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleExport,
          disabled: exporting,
          "data-ocid": "public_tasks.export_button",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            exporting ? "Exporting..." : selectedIds.size > 0 ? `Export ${selectedIds.size} Selected` : "Export All"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "public_tasks.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: allSelected ? true : someSelected ? "indeterminate" : false,
            onCheckedChange: toggleSelectAll,
            "data-ocid": "public_tasks.checkbox.select_all",
            "aria-label": "Select all tasks"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Client Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Subcategory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Assignee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Assigned Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Completed Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Comment" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 10,
          className: "text-center text-muted-foreground py-8",
          "data-ocid": "public_tasks.empty_state",
          children: hasActiveFilters ? "No tasks match the current filters" : "No tasks found"
        }
      ) }) : filteredTasks.map((task, idx) => {
        const id = task.id.toString();
        const isSelected = selectedIds.has(id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `public_tasks.row.${idx + 1}`,
            className: isSelected ? "bg-primary/5" : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: isSelected,
                  onCheckedChange: () => toggleSelect(id),
                  "data-ocid": `public_tasks.checkbox.${idx + 1}`,
                  "aria-label": `Select task ${task.clientName}`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: task.clientName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatOptionalText(task.taskCategory) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatOptionalText(task.subCategory) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatOptionalText(task.assignedName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusVariant(task.status), children: getStatusDisplayLabel(task.status) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(task.assignmentDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(task.dueDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatTaskDate(task.completionDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground line-clamp-2", children: formatOptionalText(task.comment) }) })
            ]
          },
          id
        );
      }) })
    ] }) })
  ] });
}
function usePublicAggregatedAssignees(searchString) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["publicAggregatedAssignees", searchString],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not available");
      }
      return actor.getAggregatedAssignees(searchString);
    },
    enabled: !!actor && !actorFetching && searchString.trim().length > 0,
    staleTime: 3e4
  });
}
function usePublicAssigneeTasks(assigneeName) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["publicAssigneeTasks", assigneeName],
    queryFn: async () => {
      if (!actor || !assigneeName) {
        return [];
      }
      return actor.getTasksByAssignee(assigneeName);
    },
    enabled: !!actor && !actorFetching && !!assigneeName,
    staleTime: 3e4
  });
}
function PublicAssigneeSearchPage() {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedAssignee, setSelectedAssignee] = reactExports.useState(null);
  const { data: assignees, isLoading: assigneesLoading } = usePublicAggregatedAssignees(searchTerm);
  const { data: tasks, isLoading: tasksLoading } = usePublicAssigneeTasks(selectedAssignee);
  const handleSearch = (value) => {
    setSearchTerm(value);
    setSelectedAssignee(null);
  };
  const handleSelectAssignee = (assigneeName) => {
    setSelectedAssignee(assigneeName);
  };
  const handleBack = () => {
    setSelectedAssignee(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/20 rounded-2xl blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/generated/cswa-logo-new.dim_800x200.png",
            alt: "CSWA Group of Companies",
            className: "h-20 mx-auto relative"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent mb-2", children: "Assignee Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Search for assignees and view their tasks" })
    ] }),
    !selectedAssignee && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-8 border-2 border-primary/20 shadow-glow-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-primary" }),
          "Search Assignees"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Enter an assignee name to search for their tasks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "assignee-search",
              className: "text-base font-medium",
              children: "Assignee Name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "assignee-search",
              type: "text",
              placeholder: "Type assignee name...",
              value: searchTerm,
              onChange: (e) => handleSearch(e.target.value),
              className: "h-12 text-base",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start typing to see matching assignees" })
        ] }),
        assigneesLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Searching..." })
        ] }),
        !assigneesLoading && searchTerm && assignees && assignees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            'No assignees found matching "',
            searchTerm,
            '"'
          ] })
        ] }),
        !assigneesLoading && assignees && assignees.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-muted-foreground", children: [
            "Found ",
            assignees.length,
            " assignee",
            assignees.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: assignees.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "cursor-pointer hover:border-primary/40 transition-all hover:shadow-glow-primary",
              onClick: () => handleSelectAssignee(item.assignee.name),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: item.assignee.name }),
                  item.assignee.captain && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "Captain: ",
                    item.assignee.captain
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-base px-3 py-1",
                    children: [
                      item.taskCount.toString(),
                      " ",
                      item.taskCount === 1n ? "task" : "tasks"
                    ]
                  }
                )
              ] }) })
            },
            item.assignee.id
          )) })
        ] })
      ] }) })
    ] }),
    selectedAssignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleBack,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Back to Search"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold", children: [
            "Tasks for ",
            selectedAssignee
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Viewing all tasks assigned to this team member" })
        ] })
      ] }),
      tasksLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Loading tasks..." })
      ] }) }) }),
      !tasksLoading && tasks && tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-12 w-12 text-muted-foreground mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No tasks found for this assignee" })
      ] }) }) }),
      !tasksLoading && tasks && tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
            "Tasks (",
            tasks.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "All tasks assigned to ",
            selectedAssignee
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PublicTasksTable, { tasks }) })
      ] })
    ] })
  ] }) });
}
export {
  PublicAssigneeSearchPage as default
};
