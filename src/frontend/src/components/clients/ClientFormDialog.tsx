import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/clients';
import { parseClientData, encodeClientData } from '../../lib/dataParser';
import type { Client } from '../../backend';

interface ClientFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  client?: Client;
  trigger?: React.ReactNode;
}

export default function ClientFormDialog({ open, onOpenChange, client, trigger }: ClientFormDialogProps) {
  const isEdit = !!client;
  const parsedClient = client ? parseClientData(client) : null;

  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxYears, setTaxYears] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (parsedClient) {
      setName(parsedClient.name);
      setEmail(parsedClient.email);
      setPhone(parsedClient.phone);
      setTaxYears(parsedClient.taxYears.join(', '));
      setStatus(parsedClient.status);
      setNotes(parsedClient.notes);
    } else {
      resetForm();
    }
  }, [parsedClient, dialogOpen]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setTaxYears('');
    setStatus('Active');
    setNotes('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const taxYearsArray = taxYears
      .split(',')
      .map((y) => y.trim())
      .filter((y) => y.length > 0);

    const { contactInfo, projects } = encodeClientData({
      email,
      phone,
      notes,
      status,
      taxYears: taxYearsArray,
    });

    if (isEdit && client) {
      updateClient(
        {
          clientId: client.id,
          name: name.trim(),
          contactInfo,
          projects,
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
        {
          name: name.trim(),
          contactInfo,
          projects,
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
            <Label htmlFor="name">Name *</Label>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              disabled={isPending}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxYears">Tax Years</Label>
            <Input
              id="taxYears"
              value={taxYears}
              onChange={(e) => setTaxYears(e.target.value)}
              placeholder="2024, 2023, 2022"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">Separate multiple years with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'Active' | 'Inactive')} disabled={isPending}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
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
            {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
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
