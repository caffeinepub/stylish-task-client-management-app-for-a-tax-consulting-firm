import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatTaskDate, formatCurrency, formatOptionalText, formatAssigneeWithCaptain } from '../../utils/taskDisplay';
import { getStatusDisplayLabel } from '../../constants/taskStatus';
import type { Task } from '../../backend';

interface TaskDetailsPanelProps {
  task: Task;
  captainName?: string;
}

export default function TaskDetailsPanel({ task, captainName }: TaskDetailsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{task.clientName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {task.taskCategory} • {task.subCategory}
            </p>
          </div>
          {task.status && (
            <Badge variant="outline">{getStatusDisplayLabel(task.status)}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Assigned Team</p>
            <p className="text-sm mt-1">
              {formatAssigneeWithCaptain(task.assignedName, captainName)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
            <p className="text-sm mt-1">{formatTaskDate(task.dueDate)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Assignment Date</p>
            <p className="text-sm mt-1">{formatTaskDate(task.assignmentDate)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Completion Date</p>
            <p className="text-sm mt-1">{formatTaskDate(task.completionDate)}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bill Amount</p>
            <p className="text-sm font-semibold mt-1">{formatCurrency(task.bill)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Advance Received</p>
            <p className="text-sm font-semibold mt-1">{formatCurrency(task.advanceReceived)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
            <p className="text-sm font-semibold mt-1">{formatCurrency(task.outstandingAmount)}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
          <p className="text-sm mt-1">{formatOptionalText(task.paymentStatus)}</p>
        </div>

        {task.comment && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comment</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{task.comment}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
