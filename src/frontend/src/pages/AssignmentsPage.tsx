import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ClipboardList,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTasksWithCaptain } from "../hooks/tasks";
import { formatAssigneeName, formatTaskDate } from "../utils/taskDisplay";
import { type SortDirection, sortTasks } from "../utils/taskSort";

type SortOrder = "desc" | "asc";

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-muted-foreground text-sm">—</span>;
  const s = status.toLowerCase();
  if (s === "completed" || s === "complete")
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium">
        Completed
      </Badge>
    );
  if (s === "in progress")
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium">
        In Progress
      </Badge>
    );
  if (s === "pending")
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium">
        Pending
      </Badge>
    );
  if (s === "on hold")
    return (
      <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium">
        On Hold
      </Badge>
    );
  return (
    <Badge variant="outline" className="font-medium">
      {status}
    </Badge>
  );
}

function PaymentBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-muted-foreground text-sm">—</span>;
  const n = status.trim().toLowerCase();
  if (n === "paid")
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium">
        Paid
      </Badge>
    );
  if (n === "partial paid")
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium">
        Partial Paid
      </Badge>
    );
  if (n === "advance received")
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium">
        Advance Received
      </Badge>
    );
  if (n === "payment pending")
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-medium">
        Payment Pending
      </Badge>
    );
  return (
    <Badge variant="outline" className="font-medium">
      {status}
    </Badge>
  );
}

function AssignmentsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
        <div key={i} className="flex gap-4 py-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function AssignmentsPage() {
  const tasksQuery = useTasksWithCaptain();
  const allTasks = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const sortDirection: SortDirection = sortOrder;

  const assignedTasks = useMemo(() => {
    // Only tasks that have an assignmentDate
    let result = allTasks.filter(
      (twc) =>
        twc.task.assignmentDate != null &&
        twc.task.assignmentDate !== BigInt(0),
    );

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (twc) =>
          twc.task.clientName.toLowerCase().includes(q) ||
          (twc.task.assignedName ?? "").toLowerCase().includes(q) ||
          twc.task.taskCategory.toLowerCase().includes(q) ||
          twc.task.subCategory.toLowerCase().includes(q),
      );
    }

    // Sort by assignmentDate
    const sorted = sortTasks(
      result.map((twc) => twc.task),
      "assignmentDate",
      sortDirection,
    );

    const taskMap = new Map(allTasks.map((twc) => [twc.task.id, twc]));
    return sorted.map(
      (task) => taskMap.get(task.id) ?? { task, captainName: undefined },
    );
  }, [allTasks, sortDirection, searchQuery]);

  const totalCount = assignedTasks.length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              Assignments
            </h1>
            <p className="text-sm text-muted-foreground">
              All tasks with an assigned date
            </p>
          </div>
        </div>

        {/* Sort Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Sort by date:
          </span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              data-ocid="assignments.sort_newest.button"
              onClick={() => setSortOrder("desc")}
              className={[
                "rounded-none h-8 px-3 gap-1.5 text-xs font-medium border-r border-border transition-all",
                sortOrder === "desc"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              ].join(" ")}
            >
              <ArrowDown className="h-3 w-3" />
              Newest First
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="assignments.sort_oldest.button"
              onClick={() => setSortOrder("asc")}
              className={[
                "rounded-none h-8 px-3 gap-1.5 text-xs font-medium transition-all",
                sortOrder === "asc"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              ].join(" ")}
            >
              <ArrowUp className="h-3 w-3" />
              Oldest First
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stat Banner ─────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <CalendarDays className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground">
            <span className="text-primary font-bold font-display text-base">
              {totalCount}
            </span>{" "}
            {totalCount === 1 ? "assignment" : "assignments"}
            {searchQuery.trim()
              ? " matching your search"
              : " with a recorded assignment date"}
          </span>
        </div>
      )}

      {/* ── Search ──────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Search Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by client, assignee, category or sub-category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-ocid="assignments.search.input"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Table ───────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3 border-b border-border bg-muted/30 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">
              Assignment List
            </CardTitle>
            {!isLoading && (
              <span className="text-xs text-muted-foreground font-medium">
                {totalCount} {totalCount === 1 ? "record" : "records"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <AssignmentsSkeleton />
            </div>
          ) : assignedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <CalendarDays className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {searchQuery.trim()
                  ? "No assignments match your search"
                  : "No assignments yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery.trim()
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Tasks will appear here once they have an assignment date recorded."}
              </p>
              {searchQuery.trim() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                  data-ocid="assignments.clear_search.button"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead
                      className="font-semibold text-foreground cursor-pointer select-none whitespace-nowrap"
                      onClick={() =>
                        setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                      }
                    >
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        Assignment Date
                        {sortOrder === "desc" ? (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Client
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Sub Category
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Assignee
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Payment Status
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Bill
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedTasks.map((twc) => (
                    <TableRow
                      key={twc.task.id.toString()}
                      className="cursor-default hover:bg-muted/30 transition-colors"
                      data-ocid="assignments.row"
                    >
                      <TableCell className="font-medium text-primary whitespace-nowrap">
                        {formatTaskDate(twc.task.assignmentDate)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {twc.task.clientName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {twc.task.taskCategory}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {twc.task.subCategory}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatAssigneeName(
                          twc.task.assignedName,
                          twc.captainName,
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={twc.task.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={twc.task.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {twc.task.bill != null
                          ? `₹${twc.task.bill.toLocaleString("en-IN")}`
                          : "—"}
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
