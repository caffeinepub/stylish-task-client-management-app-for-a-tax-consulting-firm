import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertCircle, UserCheck, Upload, Trash2, Edit } from 'lucide-react';
import { useGetAllAssignees, useBulkDeleteAssignees } from '../hooks/assignees';
import AssigneeFormDialog from '../components/assignees/AssigneeFormDialog';
import AssigneeBulkUploadDialog from '../components/assignees/AssigneeBulkUploadDialog';
import type { Assignee } from '../backend';

export default function AssigneesPage() {
  const { data: assignees, isLoading, error, refetch } = useGetAllAssignees();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState<Assignee | undefined>(undefined);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutate: bulkDeleteAssignees, isPending: isDeleting } = useBulkDeleteAssignees();

  const filteredAssignees = useMemo(() => {
    if (!assignees) return [];
    
    return assignees.filter((assignee) => {
      const matchesSearch = 
        assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assignee.captain && assignee.captain.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [assignees, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredAssignees.map(assignee => assignee.id.toString()));
      setSelectedAssigneeIds(allIds);
    } else {
      setSelectedAssigneeIds(new Set());
    }
  };

  const handleSelectAssignee = (assigneeId: string, checked: boolean) => {
    const newSelection = new Set(selectedAssigneeIds);
    if (checked) {
      newSelection.add(assigneeId);
    } else {
      newSelection.delete(assigneeId);
    }
    setSelectedAssigneeIds(newSelection);
  };

  const handleBulkDelete = () => {
    const assigneeIds = Array.from(selectedAssigneeIds).map(id => BigInt(id));
    bulkDeleteAssignees(assigneeIds, {
      onSuccess: () => {
        setSelectedAssigneeIds(new Set());
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleEdit = (assignee: Assignee) => {
    setEditingAssignee(assignee);
    setEditDialogOpen(true);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignees</h1>
          <p className="text-muted-foreground">Manage your teams and captains</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load assignees. {error.message}
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
          <h1 className="text-3xl font-bold">Assignees</h1>
          <p className="text-muted-foreground">Manage your teams and captains</p>
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
            Add Assignee
          </Button>
        </div>
      </div>

      {selectedAssigneeIds.size > 0 && (
        <Card className="border-[oklch(0.50_0.08_130)] bg-[oklch(0.50_0.08_130)]/5 dark:bg-[oklch(0.65_0.08_130)]/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedAssigneeIds.size === filteredAssignees.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="font-medium">
                  {selectedAssigneeIds.size} assignee{selectedAssigneeIds.size !== 1 ? 's' : ''} selected
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
          <CardTitle>All Assignees</CardTitle>
          <CardDescription>
            {filteredAssignees.length} {filteredAssignees.length === 1 ? 'assignee' : 'assignees'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by team name or captain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredAssignees.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {assignees?.length === 0 ? 'No assignees yet' : 'No assignees found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {assignees?.length === 0
                  ? 'Get started by adding your first assignee'
                  : 'Try adjusting your search'}
              </p>
              {assignees?.length === 0 && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Assignee
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
                        checked={selectedAssigneeIds.size === filteredAssignees.length && filteredAssignees.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Captain</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignees.map((assignee) => (
                    <TableRow 
                      key={assignee.id.toString()}
                      className="hover:bg-muted/50"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedAssigneeIds.has(assignee.id.toString())}
                          onCheckedChange={(checked) => handleSelectAssignee(assignee.id.toString(), checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{assignee.name}</TableCell>
                      <TableCell>{assignee.captain || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(assignee)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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

      <AssigneeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <AssigneeFormDialog 
        open={editDialogOpen} 
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingAssignee(undefined);
        }} 
        assignee={editingAssignee}
      />
      <AssigneeBulkUploadDialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignees</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedAssigneeIds.size} assignee{selectedAssigneeIds.size !== 1 ? 's' : ''}? This action cannot be undone.
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
