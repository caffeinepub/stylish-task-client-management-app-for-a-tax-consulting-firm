import React, { useState, useMemo } from 'react';
import { useClients, useBulkDeleteClients } from '../hooks/clients';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import ClientBulkUploadDialog from '../components/clients/ClientBulkUploadDialog';
import { Search, Plus, Upload, Trash2, Download } from 'lucide-react';
import type { Client, ClientId } from '../backend';
import { exportClientsToExcel } from '../utils/clientExcel';
import { toast } from 'sonner';

export default function ClientsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: clients = [], isLoading } = useClients();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState<Set<ClientId>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  const bulkDeleteMutation = useBulkDeleteClients();

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.gstin?.toLowerCase().includes(query) ||
        client.pan?.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(new Set(filteredClients.map((c) => c.id)));
    } else {
      setSelectedClients(new Set());
    }
  };

  const handleSelectClient = (clientId: ClientId, checked: boolean) => {
    const newSelected = new Set(selectedClients);
    if (checked) {
      newSelected.add(clientId);
    } else {
      newSelected.delete(clientId);
    }
    setSelectedClients(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedClients.size === 0) return;
    if (!confirm(`Delete ${selectedClients.size} client(s)?`)) return;

    await bulkDeleteMutation.mutateAsync(Array.from(selectedClients));
    setSelectedClients(new Set());
  };

  const handleExport = async () => {
    try {
      await exportClientsToExcel(filteredClients);
      toast.success('Clients exported successfully');
    } catch (error) {
      toast.error('Failed to export clients');
    }
  };

  const allSelected = filteredClients.length > 0 && selectedClients.size === filteredClients.length;
  const someSelected = selectedClients.size > 0 && selectedClients.size < filteredClients.length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, GSTIN, or PAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isAuthenticated && selectedClients.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedClients.size} client(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Client List ({filteredClients.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No clients found matching your search.' : 'No clients yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAuthenticated && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                        />
                      </TableHead>
                    )}
                    <TableHead>Client Name</TableHead>
                    <TableHead className="hidden md:table-cell">GSTIN</TableHead>
                    <TableHead className="hidden lg:table-cell">PAN</TableHead>
                    {isAuthenticated && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id.toString()}>
                      {isAuthenticated && (
                        <TableCell>
                          <Checkbox
                            checked={selectedClients.has(client.id)}
                            onCheckedChange={(checked) =>
                              handleSelectClient(client.id, checked as boolean)
                            }
                            aria-label={`Select ${client.name}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.gstin || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{client.pan || '-'}</TableCell>
                      {isAuthenticated && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && (
        <>
          <ClientFormDialog
            open={isCreateDialogOpen || !!editingClient}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                setEditingClient(undefined);
              }
            }}
            client={editingClient}
          />

          <ClientBulkUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          />
        </>
      )}
    </div>
  );
}
