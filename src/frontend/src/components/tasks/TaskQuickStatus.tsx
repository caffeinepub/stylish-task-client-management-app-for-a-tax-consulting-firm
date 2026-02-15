import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTask } from '../../hooks/tasks';
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

  return (
    <Select value={task.status || 'To Do'} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[140px] h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Blocked">Blocked</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
}
