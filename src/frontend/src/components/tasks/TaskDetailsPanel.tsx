import { Badge } from '@/components/ui/badge';
import { formatTaskDate, formatCurrency, formatOptionalText } from '@/utils/taskDisplay';
import { getStatusDisplayLabel } from '@/constants/taskStatus';
import type { Task } from '@/backend';

interface TaskDetailsPanelProps {
  task: Task;
  showClientName?: boolean;
}

/**
 * Reusable read-only Task details presentation component
 * Displays all task fields in a mobile-friendly stacked layout
 */
export default function TaskDetailsPanel({ task, showClientName = false }: TaskDetailsPanelProps) {
  const statusLabel = getStatusDisplayLabel(task.status);

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {showClientName && (
          <div>
            <span className="text-muted-foreground font-medium">Client:</span>
            <span className="ml-2">{task.clientName}</span>
          </div>
        )}
        <div>
          <span className="text-muted-foreground font-medium">Category:</span>
          <Badge variant="outline" className="ml-2">
            {task.taskCategory}
          </Badge>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Sub Category:</span>
          <Badge variant="secondary" className="ml-2">
            {task.subCategory}
          </Badge>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Status:</span>
          <span className="ml-2">{statusLabel}</span>
        </div>
      </div>

      {task.comment && (
        <div>
          <span className="text-muted-foreground font-medium">Comment:</span>
          <p className="mt-1 text-foreground" title={task.comment}>
            {task.comment}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-muted-foreground font-medium">Assigned To:</span>
          <span className="ml-2">{formatOptionalText(task.assignedName)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Due Date:</span>
          <span className="ml-2">{formatTaskDate(task.dueDate)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Assignment Date:</span>
          <span className="ml-2">{formatTaskDate(task.assignmentDate)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Completion Date:</span>
          <span className="ml-2">{formatTaskDate(task.completionDate)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-muted-foreground font-medium">Bill:</span>
          <span className="ml-2">{formatCurrency(task.bill)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Advance Received:</span>
          <span className="ml-2">{formatCurrency(task.advanceReceived)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Outstanding Amount:</span>
          <span className="ml-2">{formatCurrency(task.outstandingAmount)}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">Payment Status:</span>
          <span className="ml-2">{formatOptionalText(task.paymentStatus)}</span>
        </div>
      </div>
    </div>
  );
}
