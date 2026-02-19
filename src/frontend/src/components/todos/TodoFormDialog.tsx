import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { useCreateTodo, useUpdateTodo, useDeleteTodo } from '../../hooks/todos';
import type { Todo, PartialTodoInput } from '../../backend';

interface TodoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: Todo;
}

export default function TodoFormDialog({ open, onOpenChange, todo }: TodoFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: createTodo, isPending: isCreating } = useCreateTodo();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  const isPending = isCreating || isUpdating || isDeleting;

  useEffect(() => {
    if (open) {
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setCompleted(todo.completed);
        setPriority(todo.priority ? todo.priority.toString() : '');
        setDueDate(todo.dueDate ? new Date(Number(todo.dueDate)).toISOString().split('T')[0] : '');
      } else {
        setTitle('');
        setDescription('');
        setCompleted(false);
        setPriority('');
        setDueDate('');
      }
    }
  }, [open, todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const todoInput: PartialTodoInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed,
      priority: priority ? BigInt(parseInt(priority, 10)) : undefined,
      dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) : undefined,
    };

    if (todo) {
      updateTodo(
        { todoId: todo.id, todo: todoInput },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createTodo(todoInput, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!todo) return;
    
    deleteTodo(todo.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{todo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
            <DialogDescription>
              {todo ? 'Update the todo details below.' : 'Fill in the details to create a new todo.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter todo title"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  disabled={isPending}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={completed}
                  onCheckedChange={(checked) => setCompleted(checked === true)}
                  disabled={isPending}
                />
                <Label htmlFor="completed" className="cursor-pointer">
                  Mark as completed
                </Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="Optional priority (0-10)"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              {todo && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !title.trim()}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Saving...' : todo ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{todo?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
