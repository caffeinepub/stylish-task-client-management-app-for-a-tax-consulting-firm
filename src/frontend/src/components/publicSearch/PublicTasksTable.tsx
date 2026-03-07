import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusDisplayLabel } from "@/constants/taskStatus";
import { formatOptionalText, formatTaskDate } from "@/utils/taskDisplay";
import { exportTasksToExcel } from "@/utils/taskExcel";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Task } from "../../backend";

interface PublicTasksTableProps {
  tasks: Task[];
}

export function PublicTasksTable({ tasks }: PublicTasksTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  // Sort tasks: Pending first, then by due date ascending
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const statusA = a.status || "Pending";
      const statusB = b.status || "Pending";

      // Pending tasks first
      if (statusA === "Pending" && statusB !== "Pending") return -1;
      if (statusA !== "Pending" && statusB === "Pending") return 1;

      // Then sort by due date
      const dueDateA = a.dueDate ? Number(a.dueDate) : Number.MAX_SAFE_INTEGER;
      const dueDateB = b.dueDate ? Number(b.dueDate) : Number.MAX_SAFE_INTEGER;
      return dueDateA - dueDateB;
    });
  }, [tasks]);

  const allSelected =
    sortedTasks.length > 0 && selectedIds.size === sortedTasks.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedTasks.map((t) => t.id.toString())));
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
        ? sortedTasks.filter((t) => selectedIds.has(t.id.toString()))
        : sortedTasks;

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
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${sortedTasks.length} selected`
            : `${sortedTasks.length} task${sortedTasks.length !== 1 ? "s" : ""}`}
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
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Completed Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                  data-ocid="public_tasks.empty_state"
                >
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task, idx) => {
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
                      <Badge variant={getStatusVariant(task.status)}>
                        {getStatusDisplayLabel(task.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                    <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
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
