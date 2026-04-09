import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, an as ClipboardList, B as Button, a as Card, b as CardHeader, d as CardTitle, S as Search, e as CardContent, I as Input } from "./index-CQMB1_7H.js";
import { B as Badge } from "./badge-BG5MdMX4.js";
import { S as Skeleton } from "./skeleton-NL4prR1K.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BxP0xQL9.js";
import { e as useTasksWithCaptain } from "./tasks-UQ1ssiIZ.js";
import { a as formatTaskDate, d as formatAssigneeName } from "./taskDisplay-Dg2klV0Y.js";
import { s as sortTasks } from "./taskSort-D9GcldsN.js";
import "./taskStatus-AmY6QXne.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode);
function StatusBadge({ status }) {
  if (!status) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" });
  const s = status.toLowerCase();
  if (s === "completed" || s === "complete")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium", children: "Completed" });
  if (s === "in progress")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium", children: "In Progress" });
  if (s === "pending")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium", children: "Pending" });
  if (s === "on hold")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium", children: "On Hold" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-medium", children: status });
}
function PaymentBadge({ status }) {
  if (!status) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" });
  const n = status.trim().toLowerCase();
  if (n === "paid")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium", children: "Paid" });
  if (n === "partial paid")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium", children: "Partial Paid" });
  if (n === "advance received")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium", children: "Advance Received" });
  if (n === "payment pending")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-medium", children: "Payment Pending" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-medium", children: status });
}
function AssignmentsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({ length: 10 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-36" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" })
    ] }, i)
  )) });
}
function AssignmentsPage() {
  const tasksQuery = useTasksWithCaptain();
  const allTasks = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const sortDirection = sortOrder;
  const assignedTasks = reactExports.useMemo(() => {
    let result = allTasks.filter(
      (twc) => twc.task.assignmentDate != null && twc.task.assignmentDate !== BigInt(0)
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (twc) => twc.task.clientName.toLowerCase().includes(q) || (twc.task.assignedName ?? "").toLowerCase().includes(q) || twc.task.taskCategory.toLowerCase().includes(q) || twc.task.subCategory.toLowerCase().includes(q)
      );
    }
    const sorted = sortTasks(
      result.map((twc) => twc.task),
      "assignmentDate",
      sortDirection
    );
    const taskMap = new Map(allTasks.map((twc) => [twc.task.id, twc]));
    return sorted.map(
      (task) => taskMap.get(task.id) ?? { task, captainName: void 0 }
    );
  }, [allTasks, sortDirection, searchQuery]);
  const totalCount = assignedTasks.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: "Assignments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All tasks with an assigned date" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium hidden sm:inline", children: "Sort by date:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-lg border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              "data-ocid": "assignments.sort_newest.button",
              onClick: () => setSortOrder("desc"),
              className: [
                "rounded-none h-8 px-3 gap-1.5 text-xs font-medium border-r border-border transition-all",
                sortOrder === "desc" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3" }),
                "Newest First"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              "data-ocid": "assignments.sort_oldest.button",
              onClick: () => setSortOrder("asc"),
              className: [
                "rounded-none h-8 px-3 gap-1.5 text-xs font-medium transition-all",
                sortOrder === "asc" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3" }),
                "Oldest First"
              ]
            }
          )
        ] })
      ] })
    ] }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold font-display text-base", children: totalCount }),
        " ",
        totalCount === 1 ? "assignment" : "assignments",
        searchQuery.trim() ? " matching your search" : " with a recorded assignment date"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        "Search Assignments"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by client, assignee, category or sub-category…",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10",
            "data-ocid": "assignments.search.input"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border bg-muted/30 rounded-t-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Assignment List" }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium", children: [
          totalCount,
          " ",
          totalCount === 1 ? "record" : "records"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssignmentsSkeleton, {}) }) : assignedTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: searchQuery.trim() ? "No assignments match your search" : "No assignments yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: searchQuery.trim() ? "Try adjusting your search terms to find what you're looking for." : "Tasks will appear here once they have an assignment date recorded." }),
        searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "mt-4",
            onClick: () => setSearchQuery(""),
            "data-ocid": "assignments.clear_search.button",
            children: "Clear search"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: "font-semibold text-foreground cursor-pointer select-none whitespace-nowrap",
              onClick: () => setSortOrder(sortOrder === "desc" ? "asc" : "desc"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5 text-primary" }),
                "Assignment Date",
                sortOrder === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3 text-primary" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Sub Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Assignee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground", children: "Payment Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-right", children: "Bill" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: assignedTasks.map((twc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "cursor-default hover:bg-muted/30 transition-colors",
            "data-ocid": "assignments.row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-primary whitespace-nowrap", children: formatTaskDate(twc.task.assignmentDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground", children: twc.task.clientName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: twc.task.taskCategory }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: twc.task.subCategory }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "whitespace-nowrap", children: formatAssigneeName(
                twc.task.assignedName,
                twc.captainName
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: twc.task.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentBadge, { status: twc.task.paymentStatus }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-medium tabular-nums", children: twc.task.bill != null ? `₹${twc.task.bill.toLocaleString("en-IN")}` : "—" })
            ]
          },
          twc.task.id.toString()
        )) })
      ] }) }) })
    ] })
  ] });
}
export {
  AssignmentsPage as default
};
