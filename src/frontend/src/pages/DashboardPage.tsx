import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  FileText,
  Layers,
  Loader2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useGetAllClients } from "../hooks/clients";
import { useGetAllTasks } from "../hooks/tasks";
import {
  aggregateByCategory,
  aggregateByCategoryAndSubCategory,
  aggregateByStatus,
  aggregateBySubCategory,
  aggregateTasksByAssignee,
} from "../utils/taskAggregations";

const ASSIGNEE_STATUS_COLUMNS = [
  "Pending",
  "In Progress",
  "Completed",
  "Hold",
  "Docs Pending",
  "Checking",
  "Payment Pending",
] as const;

function statusBadgeClass(status: string): string {
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

/** Hex-like inline style colors for the status bar chart (uses CSS vars via inline style) */
function statusBarColor(status: string): string {
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

function statusDotClass(status: string): string {
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: tasksWithCaptain = [], isLoading: tasksLoading } =
    useGetAllTasks();
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
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pendingRate = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-ocid="dashboard.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10" data-ocid="dashboard.page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time insights into your business performance
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 text-xs font-medium border-border text-muted-foreground mt-1 px-3 py-1"
        >
          {totalTasks} tasks total
        </Badge>
      </div>

      {/* ── Summary Stat Cards ──────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div
          className="group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default
            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Total Tasks
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-foreground mb-1">
              {totalTasks}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {pendingTasks} pending review
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Completion</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div
          className="group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default
            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Clients
              </p>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-foreground mb-1">
              {totalClients}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Active accounts
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Coverage</span>
                <span>100%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div
          className="group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default
            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-highlight/60 via-highlight to-highlight/60" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Revenue
              </p>
              <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center shrink-0 group-hover:bg-highlight/15 transition-colors">
                <TrendingUp className="h-5 w-5 text-highlight" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-foreground mb-1 leading-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Across all tasks
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Billed</span>
                <span>{completedTasks} tasks</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-highlight transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          className="group relative rounded-2xl border border-border bg-card shadow-card overflow-hidden cursor-default
            hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-destructive/60 via-destructive to-destructive/60" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Tasks
              </p>
              <div className="w-10 h-10 rounded-xl bg-destructive/8 flex items-center justify-center shrink-0 group-hover:bg-destructive/12 transition-colors">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-foreground mb-1">
              {pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Require attention
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pending ratio</span>
                <span>{Math.round(pendingRate)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-destructive transition-all duration-500"
                  style={{ width: `${pendingRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Overview Band ────────────────────────────── */}
      {statusAggregates.length > 0 && (
        <Card className="border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-primary">
          <CardHeader className="px-6 py-4 bg-muted/40 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2.5">
                <BarChart3 className="h-5 w-5 text-primary" />
                Status Overview
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {totalTasks} total tasks
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-5 space-y-5">
            {/* Pills row */}
            <div className="flex flex-wrap gap-2">
              {statusAggregates.map((agg) => (
                <button
                  key={agg.status}
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/tasks",
                      search: {
                        clientName: undefined,
                        taskCategory: undefined,
                        subCategory: undefined,
                        assignedName: undefined,
                        status: agg.status,
                      },
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 hover:shadow-soft cursor-pointer ${statusBadgeClass(agg.status)}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusDotClass(agg.status)}`}
                  />
                  {agg.status}
                  <span className="font-mono font-bold ml-0.5">
                    {agg.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Stacked bar */}
            {totalTasks > 0 && (
              <div className="space-y-2">
                <div className="flex h-3 rounded-full overflow-hidden gap-px">
                  {statusAggregates.map((agg) => (
                    <div
                      key={agg.status}
                      title={`${agg.status}: ${agg.count}`}
                      style={{
                        width: `${(agg.count / totalTasks) * 100}%`,
                        backgroundColor: statusBarColor(agg.status),
                        minWidth: agg.count > 0 ? "4px" : "0",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {statusAggregates.map((agg) => (
                    <div key={agg.status} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: statusBarColor(agg.status) }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {agg.status}{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {Math.round((agg.count / totalTasks) * 100)}%
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Tasks by Status Grid ────────────────────────────── */}
      <div data-ocid="dashboard.status.table">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-highlight" />
            </div>
            Tasks by Status
          </h2>
          <Badge variant="outline" className="text-xs">
            {statusAggregates.length} statuses
          </Badge>
        </div>

        {statusAggregates.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground text-sm rounded-2xl border border-dashed border-border"
            data-ocid="dashboard.status.empty_state"
          >
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No status data available.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {statusAggregates.map((agg, idx) => (
              <button
                key={agg.status}
                type="button"
                data-ocid={`dashboard.status.row.${idx + 1}`}
                onClick={() =>
                  navigate({
                    to: "/tasks",
                    search: {
                      clientName: undefined,
                      taskCategory: undefined,
                      subCategory: undefined,
                      assignedName: undefined,
                      status: agg.status,
                    },
                  })
                }
                className="group relative rounded-2xl border border-border bg-card shadow-card p-5 text-left
                  hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200 overflow-hidden"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ backgroundColor: statusBarColor(agg.status) }}
                />
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeClass(agg.status)}`}
                  >
                    {agg.status}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-1">
                  {agg.count}
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalTasks > 0
                    ? `${Math.round((agg.count / totalTasks) * 100)}% of total`
                    : "tasks"}
                </div>
                <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        totalTasks > 0
                          ? `${(agg.count / totalTasks) * 100}%`
                          : "0%",
                      backgroundColor: statusBarColor(agg.status),
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Tasks by Assignee ───────────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-accent"
        data-ocid="dashboard.assignee.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <UserCheck className="h-4 w-4 text-accent" />
              </div>
              Tasks by Assignee
            </CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {
                assigneeAggregates.filter(
                  (a) => a.assigneeName !== "Unassigned",
                ).length
              }{" "}
              assignees
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {assigneeAggregates.length === 0 ? (
            <div
              className="py-16 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.assignee.empty_state"
            >
              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No tasks assigned yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide min-w-[160px] pl-6">
                      Assignee
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide min-w-[100px]">
                      Captain
                    </TableHead>
                    {ASSIGNEE_STATUS_COLUMNS.map((status) => (
                      <TableHead
                        key={status}
                        className="text-center font-semibold text-foreground text-xs uppercase tracking-wide whitespace-nowrap px-3"
                      >
                        {status}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-semibold text-foreground text-xs uppercase tracking-wide">
                      Total
                    </TableHead>
                    <TableHead className="w-10 pr-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assigneeAggregates.map((agg, idx) => (
                    <TableRow
                      key={agg.assigneeName}
                      data-ocid={`dashboard.assignee.row.${idx + 1}`}
                      className={`cursor-pointer hover:bg-accent/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent ${
                        idx % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                      onClick={() => {
                        if (agg.assigneeName !== "Unassigned") {
                          navigate({
                            to: "/tasks",
                            search: {
                              clientName: undefined,
                              taskCategory: undefined,
                              subCategory: undefined,
                              assignedName: agg.assigneeName,
                              status: undefined,
                            },
                          });
                        }
                      }}
                    >
                      <TableCell className="font-semibold pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-accent">
                              {getInitials(agg.assigneeName)}
                            </span>
                          </div>
                          <span className="truncate max-w-[130px]">
                            {agg.assigneeName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agg.captainName ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <span className="text-[8px] font-bold text-muted-foreground">
                                {getInitials(agg.captainName)}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                              {agg.captainName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">
                            —
                          </span>
                        )}
                      </TableCell>
                      {ASSIGNEE_STATUS_COLUMNS.map((status) => {
                        const count = agg.statusCounts[status] || 0;
                        return (
                          <TableCell key={status} className="text-center px-3">
                            {count > 0 ? (
                              <button
                                type="button"
                                className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md text-xs font-mono font-bold border transition-all hover:scale-105 hover:shadow-soft ${statusBadgeClass(status)}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (agg.assigneeName !== "Unassigned") {
                                    navigate({
                                      to: "/tasks",
                                      search: {
                                        clientName: undefined,
                                        taskCategory: undefined,
                                        subCategory: undefined,
                                        assignedName: agg.assigneeName,
                                        status: status,
                                      },
                                    });
                                  }
                                }}
                              >
                                {count}
                              </button>
                            ) : (
                              <span className="text-muted-foreground/30 text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-md bg-muted border border-border font-mono text-xs font-bold text-foreground">
                          {agg.total}
                        </span>
                      </TableCell>
                      <TableCell className="pr-4">
                        {agg.assigneeName !== "Unassigned" && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Tasks by Category ───────────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-primary"
        data-ocid="dashboard.category.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              Tasks by Category
            </CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {categoryAggregates.length} categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {categoryAggregates.length === 0 ? (
            <div
              className="py-16 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.category.empty_state"
            >
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No tasks available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide pl-6">
                      Category
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide">
                      Tasks
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6">
                      Revenue
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryAggregates.map((agg, idx) => (
                    <TableRow
                      key={agg.category}
                      data-ocid={`dashboard.category.row.${idx + 1}`}
                      className={`cursor-pointer hover:bg-primary/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-primary ${
                        idx % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                      onClick={() =>
                        navigate({
                          to: "/tasks",
                          search: {
                            clientName: undefined,
                            taskCategory: agg.category,
                            subCategory: undefined,
                            assignedName: undefined,
                            status: undefined,
                          },
                        })
                      }
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          {agg.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {agg.count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold pr-6">
                        ₹{agg.revenue.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Tasks by Sub Category ───────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-accent"
        data-ocid="dashboard.subcategory.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Layers className="h-4 w-4 text-accent" />
              </div>
              Tasks by Sub Category
            </CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {subCategoryAggregates.length} sub-categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {subCategoryAggregates.length === 0 ? (
            <div
              className="py-16 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.subcategory.empty_state"
            >
              <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No sub-category data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide pl-6">
                      Sub Category
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide">
                      Tasks
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6">
                      Revenue
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subCategoryAggregates.map((agg, idx) => (
                    <TableRow
                      key={agg.subCategory}
                      data-ocid={`dashboard.subcategory.row.${idx + 1}`}
                      className={`cursor-pointer hover:bg-accent/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent ${
                        idx % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                      onClick={() =>
                        navigate({
                          to: "/tasks",
                          search: {
                            clientName: undefined,
                            taskCategory: undefined,
                            subCategory: agg.subCategory,
                            assignedName: undefined,
                            status: undefined,
                          },
                        })
                      }
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                          {agg.subCategory}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {agg.count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold pr-6">
                        ₹{agg.revenue.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Category + Sub Category Combined ────────────────── */}
      <Card
        className="border border-border shadow-card rounded-2xl overflow-hidden border-t-2 border-t-highlight"
        data-ocid="dashboard.combined.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center shrink-0">
                <BarChart3 className="h-4 w-4 text-highlight" />
              </div>
              Tasks by Category &amp; Sub Category
            </CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {combinedAggregates.length} combinations
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {combinedAggregates.length === 0 ? (
            <div
              className="py-16 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.combined.empty_state"
            >
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide pl-6">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                      Sub Category
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide">
                      Tasks
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6">
                      Revenue
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedAggregates.map((agg, idx) => (
                    <TableRow
                      key={`${agg.taskCategory}-${agg.subCategory}`}
                      data-ocid={`dashboard.combined.row.${idx + 1}`}
                      className={`cursor-pointer hover:bg-highlight/5 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-highlight ${
                        idx % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                      onClick={() =>
                        navigate({
                          to: "/tasks",
                          search: {
                            clientName: undefined,
                            taskCategory: agg.taskCategory,
                            subCategory: agg.subCategory,
                            assignedName: undefined,
                            status: undefined,
                          },
                        })
                      }
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          {agg.taskCategory}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                          <span className="text-muted-foreground">
                            {agg.subCategory}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {agg.count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold pr-6">
                        ₹{agg.revenue.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-highlight transition-colors" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
