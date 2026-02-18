import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit2 } from 'lucide-react';
import { useUpdateTaskComment } from '../../hooks/tasks';
import type { Task } from '../../backend';

interface InlineCommentEditorProps {
  task: Task;
}

export default function InlineCommentEditor({ task }: InlineCommentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(task.comment || '');
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateComment, isPending } = useUpdateTaskComment();

  const handleStartEdit = () => {
    setEditedComment(task.comment || '');
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedComment(task.comment || '');
    setError(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setError(null);
    updateComment(
      { taskId: task.id, comment: editedComment },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to update comment');
        },
      }
    );
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <span className="text-sm flex-1 truncate">
          {task.comment || '—'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleStartEdit}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Input
          value={editedComment}
          onChange={(e) => setEditedComment(e.target.value)}
          placeholder="Enter comment..."
          className="h-8 text-sm"
          disabled={isPending}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
          onClick={handleSave}
          disabled={isPending}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
