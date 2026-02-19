import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useCreateAssignee, useUpdateAssignee, useDeleteAssignee } from '../../hooks/assignees';
import { Loader2 } from 'lucide-react';
import type { Assignee } from '../../backend';

interface AssigneeFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  assignee?: Assignee;
  trigger?: React.ReactNode;
}

export default function AssigneeFormDialog({ open, onOpenChange, assignee, trigger }: AssigneeFormDialogProps) {
  const isEdit = !!assignee;

  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createAssignee, isPending: isCreating } = useCreateAssignee();
  const { mutate: updateAssignee, isPending: isUpdating } = useUpdateAssignee();
  const { mutate: deleteAssignee, isPending: isDeleting } = useDeleteAssignee();

  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (assignee) {
      setName(assignee.name);
      setCaptain(assignee.captain || '');
    } else {
      resetForm();
    }
  }, [assignee, dialogOpen]);

  const resetForm = () => {
    setName('');
    setCaptain('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Team Name is required';
    }
    if (!captain.trim()) {
      newErrors.captain = 'Captain is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const assigneeData = {
      name: name.trim(),
      captain: captain.trim() || undefined,
    };

    if (isEdit && assignee) {
      updateAssignee(
        {
          assigneeId: assignee.id,
          assignee: assigneeData,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createAssignee(
        assigneeData,
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
    if (assignee) {
      deleteAssignee(assignee.id, {
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
        <DialogTitle>{isEdit ? 'Edit Assignee' : 'Add New Assignee'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Update assignee information' : 'Enter assignee details to get started'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team name"
              disabled={isPending}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="captain">Captain *</Label>
            <Input
              id="captain"
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
              placeholder="Captain name"
              disabled={isPending}
            />
            {errors.captain && <p className="text-sm text-destructive">{errors.captain}</p>}
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
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? 'Update' : 'Create'
            )}
          </Button>
        </DialogFooter>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assignee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (trigger) {
    return (
      <Dialog open={dialogOpen} onOpenChange={(newOpen) => !isPending && setDialogOpen(newOpen)}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent onEscapeKeyDown={(e) => isPending && e.preventDefault()} onPointerDownOutside={(e) => isPending && e.preventDefault()}>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(newOpen) => !isPending && setDialogOpen(newOpen)}>
      <DialogContent onEscapeKeyDown={(e) => isPending && e.preventDefault()} onPointerDownOutside={(e) => isPending && e.preventDefault()}>
        {content}
      </DialogContent>
    </Dialog>
  );
}
