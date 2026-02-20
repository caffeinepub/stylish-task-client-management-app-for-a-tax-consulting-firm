import React, { useState, useMemo } from 'react';
import { useAssignees, useBulkDeleteAssignees } from '../hooks/assignees';
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
import AssigneeFormDialog from '../components/assignees/AssigneeFormDialog';
import AssigneeBulkUploadDialog from '../components/assignees/AssigneeBulkUploadDialog';
import { Search, Plus, Upload, Trash2, Download } from 'lucide-react';
import type { Assignee, AssigneeId } from '../backend';
import { exportAssigneesToExcel } from '../utils/assigneeExcel';
import { toast } from 'sonner';

export default function AssigneesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: assignees = [], isLoading } = useAssignees();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<Set<AssigneeId>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState<Assignee | undefined>(undefined);

  const bulkDeleteMutation = useBulkDeleteAssignees();

  const filteredAssignees = useMemo(() => {
    if (!searchQuery.trim()) return assignees;

    const query = searchQuery.toLowerCase();
    return assignees.filter(
      (assignee) =>
        assignee.name.toLowerCase().includes(query) ||
        assignee.captain?.toLowerCase().includes(query)
    );
  }, [assignees, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssignees(new Set(filteredAssignees.map((a) => a.id)));
    } else {
      setSelectedAssignees(new Set());
    }
  };

  const handleSelectAssignee = (assigneeId: AssigneeId, checked: boolean) => {
    const newSelected = new Set(selectedAssignees);
    if (checked) {
      newSelected.add(assigneeId);
    } else {
      newSelected.delete(assigneeId);
    }
    setSelectedAssignees(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedAssignees.size === 0) return;
    if (!confirm(`Delete ${selectedAssignees.size} assignee(s)?`)) return;

    await bulkDeleteMutation.mutateAsync(Array.from(selectedAssignees));
    setSelectedAssignees(new Set());
  };

  const handleExport = async () => {
    try {
      await exportAssigneesToExcel(filteredAssignees);
      toast.success('Assignees exported successfully');
    } catch (error) {
      toast.error('Failed to export assignees');
    }
  };

  const allSelected = filteredAssignees.length > 0 && selectedAssignees.size === filteredAssignees.length;
  const someSelected = selectedAssignees.size > 0 && selectedAssignees.size < filteredAssignees.length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignees</h1>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Assignee
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
                placeholder="Search by team name or captain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isAuthenticated && selectedAssignees.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedAssignees.size} assignee(s) selected
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
          <CardTitle>Assignee List ({filteredAssignees.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading assignees...</div>
          ) : filteredAssignees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No assignees found matching your search.' : 'No assignees yet.'}
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
                    <TableHead>Team Name</TableHead>
                    <TableHead>Captain</TableHead>
                    {isAuthenticated && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignees.map((assignee) => (
                    <TableRow key={assignee.id.toString()}>
                      {isAuthenticated && (
                        <TableCell>
                          <Checkbox
                            checked={selectedAssignees.has(assignee.id)}
                            onCheckedChange={(checked) =>
                              handleSelectAssignee(assignee.id, checked as boolean)
                            }
                            aria-label={`Select ${assignee.name}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{assignee.name}</TableCell>
                      <TableCell>{assignee.captain || '-'}</TableCell>
                      {isAuthenticated && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAssignee(assignee)}
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
          <AssigneeFormDialog
            open={isCreateDialogOpen || !!editingAssignee}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                setEditingAssignee(undefined);
              }
            }}
            assignee={editingAssignee}
          />

          <AssigneeBulkUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          />
        </>
      )}
    </div>
  );
}
