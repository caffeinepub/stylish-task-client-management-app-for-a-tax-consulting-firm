import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/tasks';
import { useGetAllClients } from '../../hooks/clients';
import { parseTaskData, encodeTaskData, parseClientData } from '../../lib/dataParser';
import type { ParsedTask } from '../../lib/dataParser';

interface TaskFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: ParsedTask;
  trigger?: React.ReactNode;
  preselectedClientId?: bigint;
}

export default function TaskFormDialog({ open, onOpenChange, task, trigger, preselectedClientId }: TaskFormDialogProps) {
  const isEdit = !!task;

  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState<string>('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: clients } = useGetAllClients();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  const parsedClients = clients?.map(parseClientData) || [];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setClientId(task.clientId.toString());
      setStatus(task.status);
      setPriority(task.priority);
      setDeadline(task.deadline ? new Date(Number(task.deadline)) : undefined);
    } else {
      resetForm();
      if (preselectedClientId) {
        setClientId(preselectedClientId.toString());
      }
    }
  }, [task, dialogOpen, preselectedClientId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClientId('');
    setStatus('To Do');
    setPriority('Medium');
    setDeadline(undefined);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!clientId) {
      newErrors.clientId = 'Client is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const { description: encodedDescription, status: encodedStatus } = encodeTaskData({
      description,
      priority,
      status,
    });

    const deadlineMs = deadline ? BigInt(deadline.getTime()) : null;

    if (isEdit && task) {
      updateTask(
        {
          taskId: task.id,
          title: title.trim(),
          description: encodedDescription,
          status: encodedStatus,
          deadline: deadlineMs,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createTask(
        {
          title: title.trim(),
          description: encodedDescription,
          clientId: BigInt(clientId),
          deadline: deadlineMs,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Update task details' : 'Create a new task for a client'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              disabled={isPending}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select value={clientId} onValueChange={setClientId} disabled={isPending || isEdit}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {parsedClients.map((client) => (
                  <SelectItem key={client.id.toString()} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-destructive">{errors.clientId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isPending}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isPending}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={4}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isPending}
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (trigger) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {content}
      </DialogContent>
    </Dialog>
  );
}
