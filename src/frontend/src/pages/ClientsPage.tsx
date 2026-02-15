import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertCircle, Users, Upload, Trash2 } from 'lucide-react';
import { useGetAllClients, useBulkDeleteClients } from '../hooks/clients';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import ClientBulkUploadDialog from '../components/clients/ClientBulkUploadDialog';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading, error, refetch } = useGetAllClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: bulkDeleteClients, isPending: isDeleting } = useBulkDeleteClients();

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter((client) => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.gstin && client.gstin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.pan && client.pan.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [clients, searchQuery]);

  const selectedClients = useMemo(() => {
    return filteredClients.filter(client => selectedClientIds.has(client.id.toString()));
  }, [filteredClients, selectedClientIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredClients.map(client => client.id.toString()));
      setSelectedClientIds(allIds);
    } else {
      setSelectedClientIds(new Set());
    }
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    const newSelection = new Set(selectedClientIds);
    if (checked) {
      newSelection.add(clientId);
    } else {
      newSelection.delete(clientId);
    }
    setSelectedClientIds(newSelection);
  };

  const handleBulkDelete = () => {
    const clientIds = Array.from(selectedClientIds).map(id => BigInt(id));
    bulkDeleteClients(clientIds, {
      onSuccess: () => {
        setSelectedClientIds(new Set());
        setDeleteDialogOpen(false);
      },
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load clients. {error.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {selectedClientIds.size > 0 && (
        <Card className="border-[oklch(0.50_0.08_130)] bg-[oklch(0.50_0.08_130)]/5 dark:bg-[oklch(0.65_0.08_130)]/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedClientIds.size === filteredClients.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="font-medium">
                  {selectedClientIds.size} client{selectedClientIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, GSTIN, or PAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {clients?.length === 0 ? 'No clients yet' : 'No clients found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {clients?.length === 0
                  ? 'Get started by adding your first client'
                  : 'Try adjusting your search'}
              </p>
              {clients?.length === 0 && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedClientIds.size === filteredClients.length && filteredClients.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id.toString()}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate({ to: `/clients/${client.id.toString()}` })}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedClientIds.has(client.id.toString())}
                          onCheckedChange={(checked) => handleSelectClient(client.id.toString(), checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.gstin || '-'}</TableCell>
                      <TableCell>{client.pan || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: `/clients/${client.id.toString()}` });
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ClientBulkUploadDialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Clients</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedClientIds.size} client{selectedClientIds.size !== 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
