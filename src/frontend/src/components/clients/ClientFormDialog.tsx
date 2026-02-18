import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/clients';
import { Loader2 } from 'lucide-react';
import type { Client } from '../../backend';

interface ClientFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  client?: Client;
  trigger?: React.ReactNode;
}

export default function ClientFormDialog({ open, onOpenChange, client, trigger }: ClientFormDialogProps) {
  const isEdit = !!client;

  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (client) {
      setName(client.name);
      setGstin(client.gstin || '');
      setPan(client.pan || '');
      setNotes(client.notes || '');
    } else {
      resetForm();
    }
  }, [client, dialogOpen]);

  const resetForm = () => {
    setName('');
    setGstin('');
    setPan('');
    setNotes('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const clientData = {
      name: name.trim(),
      gstin: gstin.trim() || undefined,
      pan: pan.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (isEdit && client) {
      updateClient(
        {
          clientId: client.id,
          ...clientData,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createClient(
        clientData,
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
    if (client) {
      deleteClient(client.id, {
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
        <DialogTitle>{isEdit ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Update client information' : 'Enter client details to get started'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              disabled={isPending}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN (Optional)</Label>
            <Input
              id="gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="GSTIN number"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan">PAN (Optional)</Label>
            <Input
              id="pan"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              placeholder="PAN number"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
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
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
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
