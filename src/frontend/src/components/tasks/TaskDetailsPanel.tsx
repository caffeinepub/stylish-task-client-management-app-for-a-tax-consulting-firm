import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Task } from "../../backend";
import { getStatusDisplayLabel } from "../../constants/taskStatus";
import {
  formatAssigneeWithCaptain,
  formatCurrency,
  formatTaskDate,
} from "../../utils/taskDisplay";

interface TaskDetailsPanelProps {
  task: Task;
  captainName?: string;
}

function PaymentStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-sm text-muted-foreground">—</span>;

  const normalized = status.trim().toLowerCase();

  if (normalized === "paid") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium">
        Paid
      </Badge>
    );
  }
  if (normalized === "partial paid") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium">
        Partial Paid
      </Badge>
    );
  }
  if (normalized === "advance received") {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium">
        Advance Received
      </Badge>
    );
  }
  if (normalized === "payment pending") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-medium">
        Payment Pending
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="font-medium">
      {status}
    </Badge>
  );
}

export default function TaskDetailsPanel({
  task,
  captainName,
}: TaskDetailsPanelProps) {
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
            <Badge variant="outline">
              {getStatusDisplayLabel(task.status)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Assigned Team
            </p>
            <p className="text-sm mt-1">
              {formatAssigneeWithCaptain(task.assignedName, captainName)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Due Date
            </p>
            <p className="text-sm mt-1">{formatTaskDate(task.dueDate)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Assignment Date
            </p>
            <p className="text-sm mt-1">
              {formatTaskDate(task.assignmentDate)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Completion Date
            </p>
            <p className="text-sm mt-1">
              {formatTaskDate(task.completionDate)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Bill Amount
            </p>
            <p className="text-sm font-semibold mt-1">
              {formatCurrency(task.bill)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Advance Received
            </p>
            <p className="text-sm font-semibold mt-1">
              {formatCurrency(task.advanceReceived)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Outstanding
            </p>
            <p className="text-sm font-semibold mt-1">
              {formatCurrency(task.outstandingAmount)}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Payment Status
          </p>
          <PaymentStatusBadge status={task.paymentStatus} />
        </div>

        {task.comment && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Comment
              </p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{task.comment}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
