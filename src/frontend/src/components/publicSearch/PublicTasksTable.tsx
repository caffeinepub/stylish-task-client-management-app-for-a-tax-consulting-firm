import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ALLOWED_TASK_STATUSES,
  getStatusDisplayLabel,
} from "@/constants/taskStatus";
import { formatOptionalText, formatTaskDate } from "@/utils/taskDisplay";
import { exportTasksToExcel } from "@/utils/taskExcel";
import { Download, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Task } from "../../backend";

function toStartOfDayMs(isoDate: string): number {
  const d = new Date(isoDate);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function toEndOfDayMs(isoDate: string): number {
  const d = new Date(isoDate);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

interface PublicTasksTableProps {
  tasks: Task[];
}

export function PublicTasksTable({ tasks }: PublicTasksTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignedFrom, setFilterAssignedFrom] = useState<string>("");
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");

  // Filter + sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Text search (client name, category, assignee, comment)
    if (filterSearch.trim()) {
      const q = filterSearch.trim().toLowerCase();
      result = result.filter(
        (t) =>
          (t.clientName || "").toLowerCase().includes(q) ||
          (t.taskCategory || "").toLowerCase().includes(q) ||
          (t.subCategory || "").toLowerCase().includes(q) ||
          (t.assignedName || "").toLowerCase().includes(q) ||
          (t.comment || "").toLowerCase().includes(q),
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter(
        (t) => getStatusDisplayLabel(t.status) === filterStatus,
      );
    }

    // Assignment date range filter
    if (filterAssignedFrom) {
      const fromMs = toStartOfDayMs(filterAssignedFrom);
      result = result.filter((t) => {
        if (!t.assignmentDate) return false;
        const tsMs = Number(t.assignmentDate) / 1_000_000;
        return tsMs >= fromMs;
      });
    }
    if (filterAssignedTo) {
      const toMs = toEndOfDayMs(filterAssignedTo);
      result = result.filter((t) => {
        if (!t.assignmentDate) return false;
        const tsMs = Number(t.assignmentDate) / 1_000_000;
        return tsMs <= toMs;
      });
    }

    // Sort: Pending first, then by due date ascending
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

  const hasActiveFilters =
    filterStatus !== "all" ||
    filterAssignedFrom !== "" ||
    filterAssignedTo !== "" ||
    filterSearch !== "";

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterAssignedFrom("");
    setFilterAssignedTo("");
    setFilterSearch("");
    setSelectedIds(new Set());
  };

  const allSelected =
    filteredTasks.length > 0 && selectedIds.size === filteredTasks.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t.id.toString())));
    }
  };

  const toggleSelect = (id: string) => {
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
    const toExport =
      selectedIds.size > 0
        ? filteredTasks.filter((t) => selectedIds.has(t.id.toString()))
        : filteredTasks;

    if (toExport.length === 0) {
      toast.error("No tasks to export");
      return;
    }

    setExporting(true);
    try {
      await exportTasksToExcel(toExport);
      toast.success(
        `Exported ${toExport.length} task${toExport.length !== 1 ? "s" : ""} to Excel`,
      );
    } catch {
      toast.error("Failed to export tasks");
    } finally {
      setExporting(false);
    }
  };

  const getStatusVariant = (
    status: string | undefined,
  ): "default" | "secondary" | "outline" | "destructive" => {
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

  return (
    <div className="space-y-4">
      {/* Filter Panel */}
      <div
        className="rounded-lg border bg-muted/30 p-4 space-y-3"
        data-ocid="public_tasks.filter.panel"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto h-7 gap-1 text-xs"
              data-ocid="public_tasks.filter.clear_button"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Text search */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Search</Label>
            <Input
              placeholder="Client, assignee, comment..."
              value={filterSearch}
              onChange={(e) => {
                setFilterSearch(e.target.value);
                setSelectedIds(new Set());
              }}
              className="h-9 text-sm"
              data-ocid="public_tasks.filter.search_input"
            />
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select
              value={filterStatus}
              onValueChange={(v) => {
                setFilterStatus(v);
                setSelectedIds(new Set());
              }}
            >
              <SelectTrigger
                className="h-9 text-sm"
                data-ocid="public_tasks.filter.status_select"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ALLOWED_TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment date from */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Assigned From
            </Label>
            <Input
              type="date"
              value={filterAssignedFrom}
              onChange={(e) => {
                setFilterAssignedFrom(e.target.value);
                setSelectedIds(new Set());
              }}
              className="h-9 text-sm"
              data-ocid="public_tasks.filter.assigned_from_input"
            />
          </div>

          {/* Assignment date to */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Assigned To</Label>
            <Input
              type="date"
              value={filterAssignedTo}
              onChange={(e) => {
                setFilterAssignedTo(e.target.value);
                setSelectedIds(new Set());
              }}
              className="h-9 text-sm"
              data-ocid="public_tasks.filter.assigned_to_input"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${filteredTasks.length} selected`
            : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}${hasActiveFilters ? ` (filtered from ${tasks.length})` : ""}`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
          data-ocid="public_tasks.export_button"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting
            ? "Exporting..."
            : selectedIds.size > 0
              ? `Export ${selectedIds.size} Selected`
              : "Export All"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table data-ocid="public_tasks.table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={toggleSelectAll}
                  data-ocid="public_tasks.checkbox.select_all"
                  aria-label="Select all tasks"
                />
              </TableHead>
              <TableHead className="font-semibold">Client Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Subcategory</TableHead>
              <TableHead className="font-semibold">Assignee</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Assigned Date</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Completed Date</TableHead>
              <TableHead className="font-semibold">Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground py-8"
                  data-ocid="public_tasks.empty_state"
                >
                  {hasActiveFilters
                    ? "No tasks match the current filters"
                    : "No tasks found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task, idx) => {
                const id = task.id.toString();
                const isSelected = selectedIds.has(id);
                return (
                  <TableRow
                    key={id}
                    data-ocid={`public_tasks.row.${idx + 1}`}
                    className={isSelected ? "bg-primary/5" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(id)}
                        data-ocid={`public_tasks.checkbox.${idx + 1}`}
                        aria-label={`Select task ${task.clientName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {task.clientName}
                    </TableCell>
                    <TableCell>
                      {formatOptionalText(task.taskCategory)}
                    </TableCell>
                    <TableCell>
                      {formatOptionalText(task.subCategory)}
                    </TableCell>
                    <TableCell>
                      {formatOptionalText(task.assignedName)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(task.status)}>
                        {getStatusDisplayLabel(task.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTaskDate(task.assignmentDate)}</TableCell>
                    <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                    <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {formatOptionalText(task.comment)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
