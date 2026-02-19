import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTask } from '../../hooks/tasks';
import { ALLOWED_TASK_STATUSES, coerceStatusForSelect, getStatusDisplayLabel } from '../../constants/taskStatus';
import type { Task } from '../../backend';

interface TaskQuickStatusProps {
  task: Task;
}

const STATUS_NONE_SENTINEL = '__none__';

export default function TaskQuickStatus({ task }: TaskQuickStatusProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleStatusChange = (newStatus: string) => {
    // Convert sentinel back to null for backend
    const statusValue = newStatus === STATUS_NONE_SENTINEL ? null : newStatus;

    updateTask({
      taskId: task.id,
      clientName: task.clientName,
      taskCategory: task.taskCategory,
      subCategory: task.subCategory,
      status: statusValue,
      comment: task.comment || null,
      assignedName: task.assignedName || null,
      dueDate: task.dueDate || null,
      assignmentDate: task.assignmentDate || null,
      completionDate: task.completionDate || null,
      bill: task.bill || null,
      advanceReceived: task.advanceReceived || null,
      outstandingAmount: task.outstandingAmount || null,
      paymentStatus: task.paymentStatus || null,
    });
  };

  // Use coerceStatusForSelect to safely handle null/empty/invalid status values
  const currentStatus = coerceStatusForSelect(task.status, STATUS_NONE_SENTINEL);

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={STATUS_NONE_SENTINEL}>— None —</SelectItem>
        {ALLOWED_TASK_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {getStatusDisplayLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
