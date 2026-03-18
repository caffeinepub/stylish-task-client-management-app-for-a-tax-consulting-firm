import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, L as LoaderCircle, U as Users, T as TrendingUp, C as CircleAlert, a as Card, b as CardHeader, d as CardTitle, e as CardContent } from "./index-CIYCVZFK.js";
import { B as Badge } from "./badge-nn_00--e.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BQeX1_Qr.js";
import { u as useGetAllClients } from "./clients-I2sGyIgN.js";
import { u as useGetAllTasks } from "./tasks-g8CyW862.js";
import { g as getStatusDisplayLabel } from "./taskStatus-AmY6QXne.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function aggregateByCategory(tasks) {
  const categoryMap = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const revenue = task.bill || 0;
    const current = categoryMap.get(task.taskCategory) || {
      revenue: 0,
      count: 0
    };
    categoryMap.set(task.taskCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1
    });
  }
  const result = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    revenue: data.revenue,
    count: data.count
  })).sort((a, b) => b.revenue - a.revenue);
  return result;
}
function aggregateBySubCategory(tasks) {
  const subCategoryMap = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const revenue = task.bill || 0;
    const current = subCategoryMap.get(task.subCategory) || {
      revenue: 0,
      count: 0
    };
    subCategoryMap.set(task.subCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1
    });
  }
  const result = Array.from(subCategoryMap.entries()).map(([subCategory, data]) => ({
    subCategory,
    revenue: data.revenue,
    count: data.count
  })).sort((a, b) => b.revenue - a.revenue);
  return result;
}
function aggregateByCategoryAndSubCategory(tasks) {
  const combinedMap = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const key = `${task.taskCategory}|||${task.subCategory}`;
    const current = combinedMap.get(key) || { count: 0, revenue: 0 };
    combinedMap.set(key, {
      count: current.count + 1,
      revenue: current.revenue + (task.bill || 0)
    });
  }
  const result = Array.from(combinedMap.entries()).map(([key, data]) => {
    const [taskCategory, subCategory] = key.split("|||");
    return {
      taskCategory,
      subCategory,
      count: data.count,
      revenue: data.revenue
    };
  }).sort((a, b) => b.revenue - a.revenue);
  return result;
}
function aggregateByStatus(tasks) {
  const statusMap = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const displayStatus = getStatusDisplayLabel(task.status);
    const current = statusMap.get(displayStatus) || 0;
    statusMap.set(displayStatus, current + 1);
  }
  const result = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count);
  return result;
}
function aggregateTasksByAssignee(tasksWithCaptain) {
  var _a;
  const assigneeMap = /* @__PURE__ */ new Map();
  for (const { task, captainName } of tasksWithCaptain) {
    const assigneeName = ((_a = task.assignedName) == null ? void 0 : _a.trim()) || "Unassigned";
    const displayStatus = getStatusDisplayLabel(task.status);
    const existing = assigneeMap.get(assigneeName) || {
      captainName: captainName || void 0,
      statusCounts: {},
      total: 0
    };
    if (!existing.captainName && captainName) {
      existing.captainName = captainName;
    }
    existing.statusCounts[displayStatus] = (existing.statusCounts[displayStatus] || 0) + 1;
    existing.total += 1;
    assigneeMap.set(assigneeName, existing);
  }
  const result = Array.from(assigneeMap.entries()).map(([assigneeName, data]) => ({
    assigneeName,
    captainName: data.captainName,
    statusCounts: data.statusCounts,
    total: data.total
  })).sort((a, b) => b.total - a.total);
  return result;
}
const ASSIGNEE_STATUS_COLUMNS = [
  "Pending",
  "In Progress",
  "Completed",
  "Hold",
  "Docs Pending",
  "Checking",
  "Payment Pending"
];
const PAYMENT_STATUSES = [
  "Payment Pending",
  "Advance Received",
  "Partial Paid",
  "Paid",
  "Not Set"
];
function paymentStatusStyle(ps) {
  switch (ps) {
    case "Paid":
      return {
        badge: "bg-success/15 text-success border-success/30",
        bar: "oklch(0.56 0.17 150)",
        dot: "bg-success",
        accent: "border-t-success"
      };
    case "Partial Paid":
      return {
        badge: "bg-primary/10 text-primary border-primary/20",
        bar: "oklch(0.5 0.14 255)",
        dot: "bg-primary",
        accent: "border-t-primary"
      };
    case "Advance Received":
      return {
        badge: "bg-warning/15 text-warning-foreground border-warning/30",
        bar: "oklch(0.72 0.14 75)",
        dot: "bg-warning",
        accent: "border-t-warning"
      };
    case "Payment Pending":
      return {
        badge: "bg-destructive/10 text-destructive border-destructive/20",
        bar: "oklch(0.55 0.22 25)",
        dot: "bg-destructive",
        accent: "border-t-destructive"
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground border-border",
        bar: "oklch(0.7 0.02 255)",
        dot: "bg-muted-foreground",
        accent: "border-t-muted-foreground"
      };
  }
}
function statusBadgeClass(status) {
  switch (status) {
    case "Completed":
      return "bg-success/15 text-success border-success/30";
    case "Hold":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "In Progress":
      return "bg-primary/10 text-primary border-primary/20";
    case "Pending":
      return "bg-accent/10 text-accent border-accent/20";
    case "Docs Pending":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Checking":
      return "bg-highlight/10 text-highlight border-highlight/20";
    case "Payment Pending":
      return "bg-destructive/8 text-destructive border-destructive/15";
    default:
      return "bg-muted text-muted-foreground";
  }
}
function statusBarColor(status) {
  switch (status) {
    case "Completed":
      return "oklch(0.56 0.17 150)";
    case "Hold":
      return "oklch(0.55 0.22 25)";
    case "In Progress":
      return "oklch(0.5 0.14 255)";
    case "Pending":
      return "oklch(0.72 0.14 75)";
    case "Docs Pending":
      return "oklch(0.68 0.16 50)";
    case "Checking":
      return "oklch(0.6 0.12 195)";
    case "Payment Pending":
      return "oklch(0.6 0.2 10)";
    default:
      return "oklch(0.7 0.02 255)";
  }
}
function statusDotClass(status) {
  switch (status) {
    case "Completed":
      return "bg-success";
    case "Hold":
      return "bg-destructive";
    case "In Progress":
      return "bg-primary";
    case "Pending":
      return "bg-accent";
    case "Docs Pending":
      return "bg-warning";
    case "Checking":
      return "bg-highlight";
    case "Payment Pending":
      return "bg-destructive/70";
    default:
      return "bg-muted-foreground";
  }
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function DashboardPage() {
  const navigate = useNavigate();
  const { data: tasksWithCaptain = [], isLoading: tasksLoading } = useGetAllTasks();
  const { data: clients = [], isLoading: clientsLoading } = useGetAllClients();
  const tasks = tasksWithCaptain.map((twc) => twc.task);
  const isLoading = tasksLoading || clientsLoading;
  const categoryAggregates = aggregateByCategory(tasks);
  const subCategoryAggregates = aggregateBySubCategory(tasks);
  const statusAggregates = aggregateByStatus(tasks);
  const combinedAggregates = aggregateByCategoryAndSubCategory(tasks);
  const assigneeAggregates = aggregateTasksByAssignee(tasksWithCaptain);
  const totalTasks = tasks.length;
  const totalClients = clients.length;
  const totalRevenue = tasks.reduce((sum, task) => sum + (task.bill || 0), 0);
  const totalAdvanceReceived = tasks.reduce(
    (sum, t) => sum + (t.advanceReceived || 0),
    0
  );
  const totalOutstanding = tasks.reduce(
    (sum, t) => sum + (t.outstandingAmount || 0),
    0
  );
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
  const pendingRate = totalTasks > 0 ? pendingTasks / totalTasks * 100 : 0;
  const paymentStatusCounts = tasks.reduce(
    (acc, t) => {
      const ps = t.paymentStatus || "Not Set";
      acc[ps] = (acc[ps] || 0) + 1;
      return acc;
    },
    {}
  );
  const paymentStatusBreakdown = PAYMENT_STATUSES.map((ps) => ({
    label: ps,
    count: paymentStatusCounts[ps] || 0
  })).filter((ps) => ps.count > 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[400px]",
        "data-ocid": "dashboard.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading dashboard…" })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-10", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Real-time insights into your business performance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "shrink-0 text-xs font-medium border-border text-muted-foreground mt-1 px-3 py-1",
          children: [
            totalTasks,
            " tasks total"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default\n            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5", children: "Total Tasks" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl font-bold text-foreground mb-1", children: totalTasks }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                pendingTasks,
                " pending review"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Completion" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    Math.round(completionRate),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-primary transition-all duration-500",
                    style: { width: `${completionRate}%` }
                  }
                ) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default\n            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Clients" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-accent" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl font-bold text-foreground mb-1", children: totalClients }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Active accounts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Coverage" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-full bg-accent" }) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default\n            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-highlight/60 via-highlight to-highlight/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Bill" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center shrink-0 group-hover:bg-highlight/15 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-highlight" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-3xl font-bold text-foreground mb-2 leading-tight", children: [
                "₹",
                totalRevenue.toLocaleString("en-IN")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-warning shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "₹",
                    totalAdvanceReceived.toLocaleString("en-IN"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-warning-foreground font-medium", children: "advance received" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-destructive shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "₹",
                    totalOutstanding.toLocaleString("en-IN"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-medium", children: "outstanding" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Billed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    completedTasks,
                    " tasks"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-highlight transition-all duration-500",
                    style: { width: `${completionRate}%` }
                  }
                ) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default\n            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-destructive/60 via-destructive to-destructive/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pending Tasks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-destructive/8 flex items-center justify-center shrink-0 group-hover:bg-destructive/12 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-destructive" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl font-bold text-foreground mb-1", children: pendingTasks }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Require attention" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pending ratio" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    Math.round(pendingRate),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-destructive transition-all duration-500",
                    style: { width: `${pendingRate}%` }
                  }
                ) })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-highlight",
        "data-ocid": "dashboard.payment.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-4 bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-5 w-5 text-highlight" }),
              "Payment Status Breakdown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              totalTasks,
              " total tasks"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 py-5", children: paymentStatusBreakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-8 text-center text-muted-foreground text-sm",
              "data-ocid": "dashboard.payment.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                "No payment status data yet."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 mb-5", children: PAYMENT_STATUSES.map((ps) => {
              const count = paymentStatusCounts[ps] || 0;
              if (count === 0) return null;
              const style = paymentStatusStyle(ps);
              const pct = totalTasks > 0 ? Math.round(count / totalTasks * 100) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${style.badge}`,
                  "data-ocid": "dashboard.payment.card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `w-2 h-2 rounded-full shrink-0 ${style.dot}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ps }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-base ml-1", children: count }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal opacity-70 text-xs", children: [
                      "(",
                      pct,
                      "%)"
                    ] })
                  ]
                },
                ps
              );
            }) }),
            totalTasks > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-3 rounded-full overflow-hidden gap-px", children: PAYMENT_STATUSES.map((ps) => {
                const count = paymentStatusCounts[ps] || 0;
                if (count === 0) return null;
                const style = paymentStatusStyle(ps);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    title: `${ps}: ${count}`,
                    style: {
                      width: `${count / totalTasks * 100}%`,
                      backgroundColor: style.bar,
                      minWidth: count > 0 ? "4px" : "0"
                    }
                  },
                  ps
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-1", children: PAYMENT_STATUSES.map((ps) => {
                const count = paymentStatusCounts[ps] || 0;
                if (count === 0) return null;
                const style = paymentStatusStyle(ps);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2.5 h-2.5 rounded-sm shrink-0",
                      style: { backgroundColor: style.bar }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    ps,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                      Math.round(count / totalTasks * 100),
                      "%"
                    ] })
                  ] })
                ] }, ps);
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-3 gap-4 pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Total Bill" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-foreground", children: [
                  "₹",
                  totalRevenue.toLocaleString("en-IN")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Advance Received" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-warning-foreground", children: [
                  "₹",
                  totalAdvanceReceived.toLocaleString("en-IN")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Outstanding" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-destructive", children: [
                  "₹",
                  totalOutstanding.toLocaleString("en-IN")
                ] })
              ] })
            ] })
          ] }) })
        ]
      }
    ),
    statusAggregates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-4 bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg font-bold text-foreground flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5 text-primary" }),
          "Status Overview"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          totalTasks,
          " total tasks"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-6 py-5 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: statusAggregates.map((agg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({
              to: "/tasks",
              search: {
                clientName: void 0,
                taskCategory: void 0,
                subCategory: void 0,
                assignedName: void 0,
                status: agg.status
              }
            }),
            className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 hover:shadow-soft cursor-pointer ${statusBadgeClass(agg.status)}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `w-1.5 h-1.5 rounded-full ${statusDotClass(agg.status)}`
                }
              ),
              agg.status,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold ml-0.5", children: agg.count })
            ]
          },
          agg.status
        )) }),
        totalTasks > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-3 rounded-full overflow-hidden gap-px", children: statusAggregates.map((agg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              title: `${agg.status}: ${agg.count}`,
              style: {
                width: `${agg.count / totalTasks * 100}%`,
                backgroundColor: statusBarColor(agg.status),
                minWidth: agg.count > 0 ? "4px" : "0"
              }
            },
            agg.status
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-1", children: statusAggregates.map((agg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-2.5 h-2.5 rounded-sm shrink-0",
                style: { backgroundColor: statusBarColor(agg.status) }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              agg.status,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                Math.round(agg.count / totalTasks * 100),
                "%"
              ] })
            ] })
          ] }, agg.status)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.status.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-highlight" }) }),
          "Tasks by Status"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          statusAggregates.length,
          " statuses"
        ] })
      ] }),
      statusAggregates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "py-16 text-center text-muted-foreground text-sm rounded-2xl border border-dashed border-border",
          "data-ocid": "dashboard.status.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
            "No status data available."
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: statusAggregates.map((agg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `dashboard.status.row.${idx + 1}`,
          onClick: () => navigate({
            to: "/tasks",
            search: {
              clientName: void 0,
              taskCategory: void 0,
              subCategory: void 0,
              assignedName: void 0,
              status: agg.status
            }
          }),
          className: "group relative rounded-2xl border border-border bg-card shadow-card p-5 text-left\n                  hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200 overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-x-0 top-0 h-0.5",
                style: { backgroundColor: statusBarColor(agg.status) }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeClass(agg.status)}`,
                  children: agg.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl font-bold text-foreground mb-1", children: agg.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: totalTasks > 0 ? `${Math.round(agg.count / totalTasks * 100)}% of total` : "tasks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: totalTasks > 0 ? `${agg.count / totalTasks * 100}%` : "0%",
                  backgroundColor: statusBarColor(agg.status)
                }
              }
            ) })
          ]
        },
        agg.status
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-accent",
        "data-ocid": "dashboard.assignee.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-5 border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4 text-accent" }) }),
              "Tasks by Assignee"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs shrink-0", children: [
              assigneeAggregates.filter(
                (a) => a.assigneeName !== "Unassigned"
              ).length,
              " ",
              "assignees"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: assigneeAggregates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-16 text-center text-muted-foreground text-sm",
              "data-ocid": "dashboard.assignee.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                "No tasks assigned yet."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide min-w-[160px] pl-6", children: "Assignee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide min-w-[100px]", children: "Captain" }),
              ASSIGNEE_STATUS_COLUMNS.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableHead,
                {
                  className: "text-center font-semibold text-foreground text-xs uppercase tracking-wide whitespace-nowrap px-3",
                  children: status
                },
                status
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center font-semibold text-foreground text-xs uppercase tracking-wide", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10 pr-4" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: assigneeAggregates.map((agg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                "data-ocid": `dashboard.assignee.row.${idx + 1}`,
                className: `cursor-pointer hover:bg-accent/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent ${idx % 2 === 0 ? "" : "bg-muted/20"}`,
                onClick: () => {
                  if (agg.assigneeName !== "Unassigned") {
                    navigate({
                      to: "/tasks",
                      search: {
                        clientName: void 0,
                        taskCategory: void 0,
                        subCategory: void 0,
                        assignedName: agg.assigneeName,
                        status: void 0
                      }
                    });
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-accent", children: getInitials(agg.assigneeName) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[130px]", children: agg.assigneeName })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: agg.captainName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold text-muted-foreground", children: getInitials(agg.captainName) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate max-w-[80px]", children: agg.captainName })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }),
                  ASSIGNEE_STATUS_COLUMNS.map((status) => {
                    const count = agg.statusCounts[status] || 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center px-3", children: count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: `inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md text-xs font-mono font-bold border transition-all hover:scale-105 hover:shadow-soft ${statusBadgeClass(status)}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          if (agg.assigneeName !== "Unassigned") {
                            navigate({
                              to: "/tasks",
                              search: {
                                clientName: void 0,
                                taskCategory: void 0,
                                subCategory: void 0,
                                assignedName: agg.assigneeName,
                                status
                              }
                            });
                          }
                        },
                        children: count
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-xs", children: "—" }) }, status);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-md bg-muted border border-border font-mono text-xs font-bold text-foreground", children: agg.total }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-4", children: agg.assigneeName !== "Unassigned" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" }) })
                ]
              },
              agg.assigneeName
            )) })
          ] }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-primary",
        "data-ocid": "dashboard.category.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-5 border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }) }),
              "Tasks by Category"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs shrink-0", children: [
              categoryAggregates.length,
              " categories"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: categoryAggregates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-16 text-center text-muted-foreground text-sm",
              "data-ocid": "dashboard.category.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                "No tasks available."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide pl-6", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide", children: "Tasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6", children: "Revenue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: categoryAggregates.map((agg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                "data-ocid": `dashboard.category.row.${idx + 1}`,
                className: `cursor-pointer hover:bg-primary/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-primary ${idx % 2 === 0 ? "" : "bg-muted/20"}`,
                onClick: () => navigate({
                  to: "/tasks",
                  search: {
                    clientName: void 0,
                    taskCategory: agg.category,
                    subCategory: void 0,
                    assignedName: void 0,
                    status: void 0
                  }
                }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary shrink-0" }),
                    agg.category
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "font-mono text-xs",
                      children: agg.count
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-semibold pr-6", children: [
                    "₹",
                    agg.revenue.toLocaleString("en-IN")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" }) })
                ]
              },
              agg.category
            )) })
          ] }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-accent",
        "data-ocid": "dashboard.subcategory.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-5 border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-accent" }) }),
              "Tasks by Sub Category"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs shrink-0", children: [
              subCategoryAggregates.length,
              " sub-categories"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: subCategoryAggregates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-16 text-center text-muted-foreground text-sm",
              "data-ocid": "dashboard.subcategory.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                "No sub-category data available."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide pl-6", children: "Sub Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide", children: "Tasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6", children: "Revenue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: subCategoryAggregates.map((agg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                "data-ocid": `dashboard.subcategory.row.${idx + 1}`,
                className: `cursor-pointer hover:bg-accent/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent ${idx % 2 === 0 ? "" : "bg-muted/20"}`,
                onClick: () => navigate({
                  to: "/tasks",
                  search: {
                    clientName: void 0,
                    taskCategory: void 0,
                    subCategory: agg.subCategory,
                    assignedName: void 0,
                    status: void 0
                  }
                }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-accent shrink-0" }),
                    agg.subCategory
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "font-mono text-xs",
                      children: agg.count
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-semibold pr-6", children: [
                    "₹",
                    agg.revenue.toLocaleString("en-IN")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" }) })
                ]
              },
              agg.subCategory
            )) })
          ] }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-highlight",
        "data-ocid": "dashboard.combined.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-5 border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-highlight" }) }),
              "Tasks by Category & Sub Category"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs shrink-0", children: [
              combinedAggregates.length,
              " combinations"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: combinedAggregates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-16 text-center text-muted-foreground text-sm",
              "data-ocid": "dashboard.combined.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                "No data available."
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide pl-6", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-foreground text-xs uppercase tracking-wide", children: "Sub Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide", children: "Tasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6", children: "Revenue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: combinedAggregates.map((agg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                "data-ocid": `dashboard.combined.row.${idx + 1}`,
                className: `cursor-pointer hover:bg-highlight/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-highlight ${idx % 2 === 0 ? "" : "bg-muted/20"}`,
                onClick: () => navigate({
                  to: "/tasks",
                  search: {
                    clientName: void 0,
                    taskCategory: agg.taskCategory,
                    subCategory: agg.subCategory,
                    assignedName: void 0,
                    status: void 0
                  }
                }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary shrink-0" }),
                    agg.taskCategory
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-accent shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: agg.subCategory })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "font-mono text-xs",
                      children: agg.count
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-semibold pr-6", children: [
                    "₹",
                    agg.revenue.toLocaleString("en-IN")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-highlight transition-colors" }) })
                ]
              },
              `${agg.taskCategory}-${agg.subCategory}`
            )) })
          ] }) }) })
        ]
      }
    )
  ] });
}
export {
  DashboardPage as default
};
