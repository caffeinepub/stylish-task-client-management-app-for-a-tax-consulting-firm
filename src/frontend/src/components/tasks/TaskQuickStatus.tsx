import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTask } from '../../hooks/tasks';
import { encodeTaskData } from '../../lib/dataParser';
import type { ParsedTask } from '../../lib/dataParser';

interface TaskQuickStatusProps {
  task: ParsedTask;
}

export default function TaskQuickStatus({ task }: TaskQuickStatusProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleStatusChange = (newStatus: string) => {
    const { description: encodedDescription, status: encodedStatus } = encodeTaskData({
      description: task.description,
      priority: task.priority,
      status: newStatus,
    });

    updateTask({
      taskId: task.id,
      title: task.title,
      description: encodedDescription,
      status: encodedStatus,
      deadline: task.deadline,
    });
  };

  return (
    <Select value={task.status} onValueChange={handleStatusChange} disabled={isPending}>
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
