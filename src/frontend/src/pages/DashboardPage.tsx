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
  FileText,
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

// Status columns to show in the Tasks by Assignee table
const ASSIGNEE_STATUS_COLUMNS = [
  "Pending",
  "In Progress",
  "Completed",
  "Hold",
  "Docs Pending",
  "Checking",
  "Payment Pending",
] as const;

/** Returns Tailwind classes for a given status badge */
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: tasksWithCaptain = [], isLoading: tasksLoading } =
    useGetAllTasks();
  const { data: clients = [], isLoading: clientsLoading } = useGetAllClients();

  const tasks = tasksWithCaptain.map((twc) => twc.task);
  const isLoading = tasksLoading || clientsLoading;

  // Aggregate data
  const categoryAggregates = aggregateByCategory(tasks);
  const subCategoryAggregates = aggregateBySubCategory(tasks);
  const statusAggregates = aggregateByStatus(tasks);
  const combinedAggregates = aggregateByCategoryAndSubCategory(tasks);
  const assigneeAggregates = aggregateTasksByAssignee(tasksWithCaptain);

  // Summary metrics
  const totalTasks = tasks.length;
  const totalClients = clients.length;
  const totalRevenue = tasks.reduce((sum, task) => sum + (task.bill || 0), 0);
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-ocid="dashboard.loading_state"
      >
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8" data-ocid="dashboard.page">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time insights into business performance
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 text-xs font-medium border-border text-muted-foreground mt-1"
        >
          {totalTasks} tasks total
        </Badge>
      </div>

      {/* ── Summary Cards ─────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <Card className="border border-border shadow-card rounded-xl border-l-4 border-l-primary hover:shadow-elevated transition-shadow duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Tasks
            </CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="font-display text-3xl font-bold text-foreground mb-1.5">
              {totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks} pending review
            </p>
          </CardContent>
        </Card>

        {/* Total Clients */}
        <Card className="border border-border shadow-card rounded-xl border-l-4 border-l-accent hover:shadow-elevated transition-shadow duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Clients
            </CardTitle>
            <div className="p-2.5 rounded-lg bg-accent/10 group-hover:bg-accent/15 transition-colors">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="font-display text-3xl font-bold text-foreground mb-1.5">
              {totalClients}
            </div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border border-border shadow-card rounded-xl border-l-4 border-l-highlight hover:shadow-elevated transition-shadow duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </CardTitle>
            <div className="p-2.5 rounded-lg bg-highlight/10 group-hover:bg-highlight/15 transition-colors">
              <TrendingUp className="h-4 w-4 text-highlight" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="font-display text-3xl font-bold text-foreground mb-1.5">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">Across all tasks</p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="border border-border shadow-card rounded-xl border-l-4 border-l-destructive hover:shadow-elevated transition-shadow duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Tasks
            </CardTitle>
            <div className="p-2.5 rounded-lg bg-destructive/8 group-hover:bg-destructive/12 transition-colors">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="font-display text-3xl font-bold text-foreground mb-1.5">
              {pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Tasks by Assignee ─────────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-xl overflow-hidden"
        data-ocid="dashboard.assignee.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-0.5 h-6 rounded-full bg-accent inline-block" />
              <UserCheck className="h-5 w-5 text-accent shrink-0" />
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
              className="py-12 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.assignee.empty_state"
            >
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
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide min-w-[120px]">
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
                      className="cursor-pointer hover:bg-muted/40 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent"
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
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {agg.assigneeName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {agg.captainName || (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                      {ASSIGNEE_STATUS_COLUMNS.map((status) => {
                        const count = agg.statusCounts[status] || 0;
                        return (
                          <TableCell key={status} className="text-center px-3">
                            {count > 0 ? (
                              <button
                                type="button"
                                className={`inline-flex items-center justify-center min-w-[26px] px-2 py-0.5 rounded text-xs font-mono font-semibold border transition-opacity hover:opacity-75 ${statusBadgeClass(status)}`}
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
                              <span className="text-muted-foreground/40 text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded border border-border font-mono text-xs font-bold text-foreground">
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

      {/* ── Tasks by Category ────────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-xl overflow-hidden"
        data-ocid="dashboard.category.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-0.5 h-6 rounded-full bg-primary inline-block" />
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
              className="py-12 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.category.empty_state"
            >
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
                      className="cursor-pointer hover:bg-muted/40 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-primary"
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
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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

      {/* ── Tasks by Sub Category ─────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-xl overflow-hidden"
        data-ocid="dashboard.subcategory.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-0.5 h-6 rounded-full bg-accent inline-block" />
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
              className="py-12 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.subcategory.empty_state"
            >
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
                      className="cursor-pointer hover:bg-muted/40 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-accent"
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
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
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

      {/* ── Tasks by Status ───────────────────────────────── */}
      <Card
        className="border border-border shadow-card rounded-xl overflow-hidden"
        data-ocid="dashboard.status.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-0.5 h-6 rounded-full bg-highlight inline-block" />
              Tasks by Status
            </CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {statusAggregates.length} statuses
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {statusAggregates.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.status.empty_state"
            >
              No status data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide pl-6">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wide pr-6">
                      Count
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusAggregates.map((agg, idx) => (
                    <TableRow
                      key={agg.status}
                      data-ocid={`dashboard.status.row.${idx + 1}`}
                      className="cursor-pointer hover:bg-muted/40 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-highlight"
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
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeClass(agg.status)}`}
                          >
                            {agg.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {agg.count}
                        </span>
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

      {/* ── Category + Sub Category Combined ─────────────── */}
      <Card
        className="border border-border shadow-card rounded-xl overflow-hidden"
        data-ocid="dashboard.combined.table"
      >
        <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-0.5 h-6 rounded-full bg-primary inline-block" />
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
              className="py-12 text-center text-muted-foreground text-sm"
              data-ocid="dashboard.combined.empty_state"
            >
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
                      className="cursor-pointer hover:bg-muted/40 transition-colors duration-150 group border-l-4 border-l-transparent hover:border-l-primary"
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
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {agg.taskCategory}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
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
    </div>
  );
}
