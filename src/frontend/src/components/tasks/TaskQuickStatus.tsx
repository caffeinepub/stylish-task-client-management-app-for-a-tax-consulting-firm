import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTask } from '../../hooks/tasks';
import { ALLOWED_TASK_STATUSES, getStatusDisplayLabel } from '../../constants/taskStatus';
import type { Task } from '../../backend';

interface TaskQuickStatusProps {
  task: Task;
}

export default function TaskQuickStatus({ task }: TaskQuickStatusProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleStatusChange = (newStatus: string) => {
    updateTask({
      taskId: task.id,
      clientName: task.clientName,
      taskCategory: task.taskCategory,
      subCategory: task.subCategory,
      status: newStatus,
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

  const displayValue = getStatusDisplayLabel(task.status);

  return (
    <Select value={displayValue} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[160px] h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALLOWED_TASK_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
