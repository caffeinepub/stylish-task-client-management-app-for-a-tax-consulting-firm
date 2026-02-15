import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertCircle, Users } from 'lucide-react';
import { useGetAllClients } from '../hooks/clients';
import { parseClientData } from '../lib/dataParser';
import ClientFormDialog from '../components/clients/ClientFormDialog';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading, error, refetch } = useGetAllClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Parse URL params for pre-filtering
  const urlParams = new URLSearchParams(window.location.search);
  const urlStatus = urlParams.get('status');
  
  // Apply URL filter on mount
  useMemo(() => {
    if (urlStatus && statusFilter === 'all') {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  const parsedClients = useMemo(() => {
    return clients?.map(parseClientData) || [];
  }, [clients]);

  const filteredClients = useMemo(() => {
    return parsedClients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [parsedClients, searchQuery, statusFilter]);

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
        <Button onClick={() => setDialogOpen(true)} className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {parsedClients.length === 0 ? 'No clients yet' : 'No clients found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {parsedClients.length === 0
                  ? 'Get started by adding your first client'
                  : 'Try adjusting your search or filters'}
              </p>
              {parsedClients.length === 0 && (
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
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tax Years</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.email && <div>{client.email}</div>}
                          {client.phone && <div className="text-muted-foreground">{client.phone}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.taxYears.slice(0, 2).map((year) => (
                            <Badge key={year} variant="secondary" className="text-xs">
                              {year}
                            </Badge>
                          ))}
                          {client.taxYears.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{client.taxYears.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={client.status === 'Active' ? 'default' : 'secondary'}
                          className={client.status === 'Active' ? 'bg-[oklch(0.50_0.08_130)] dark:bg-[oklch(0.65_0.08_130)]' : ''}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
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
    </div>
  );
}
