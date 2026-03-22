import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, MessageSquarePlus, X } from "lucide-react";
import { useState } from "react";
import type { Task } from "../../backend";
import { useUpdateTaskComment } from "../../hooks/tasks";

interface InlineCommentEditorProps {
  task: Task;
}

export default function InlineCommentEditor({
  task,
}: InlineCommentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(task.comment || "");
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateComment, isPending } = useUpdateTaskComment();

  const hasComment = !!task.comment?.trim();

  const handleStartEdit = () => {
    setEditedComment(task.comment || "");
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedComment(task.comment || "");
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
          setError(
            err instanceof Error ? err.message : "Failed to update comment",
          );
        },
      },
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-1 min-w-[180px]">
        <Textarea
          value={editedComment}
          onChange={(e) => setEditedComment(e.target.value)}
          placeholder="Enter comment..."
          className="text-sm resize-none min-h-[60px]"
          disabled={isPending}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              handleSave();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }}
        />
        <div className="flex items-center gap-1">
          <Button
            variant="default"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleSave}
            disabled={isPending}
          >
            <Check className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (!hasComment) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
        onClick={handleStartEdit}
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Add comment
      </Button>
    );
  }

  return (
    <div className="flex items-start gap-2 group max-w-xs">
      <span className="text-sm flex-1 line-clamp-2 leading-snug">
        {task.comment}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
        onClick={handleStartEdit}
        title="Edit comment"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
