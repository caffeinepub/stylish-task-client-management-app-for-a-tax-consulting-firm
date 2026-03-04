import { Badge } from "@/components/ui/badge";
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
import { useMemo } from "react";
import type { Task } from "../../backend";

interface PublicTasksTableProps {
  tasks: Task[];
}

export function PublicTasksTable({ tasks }: PublicTasksTableProps) {
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
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
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
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            sortedTasks.map((task) => (
              <TableRow key={task.id.toString()}>
                <TableCell className="font-medium">{task.clientName}</TableCell>
                <TableCell>{formatOptionalText(task.taskCategory)}</TableCell>
                <TableCell>{formatOptionalText(task.subCategory)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(task.status)}>
                    {getStatusDisplayLabel(task.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
