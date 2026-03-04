import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  TaskType,
  TaskTypeId,
  TaskTypeInput,
  TaskTypeUpdate,
} from "../backend";
import { useActor } from "./useActor";

export function useTaskTypes() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskType[]>({
    queryKey: ["taskTypes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTaskTypes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTaskType(taskTypeId: TaskTypeId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TaskType | null>({
    queryKey: ["taskType", taskTypeId?.toString()],
    queryFn: async () => {
      if (!actor || taskTypeId === null) return null;
      return actor.getTaskType(taskTypeId);
    },
    enabled: !!actor && !isFetching && taskTypeId !== null,
  });
}

export function useCreateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TaskTypeInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTaskType(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      toast.success("Task type created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task type: ${error.message}`);
    },
  });
}

export function useUpdateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: TaskTypeUpdate) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTaskType(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      toast.success("Task type updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task type: ${error.message}`);
    },
  });
}

export function useDeleteTaskTypes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskTypeIds: TaskTypeId[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTaskTypes(taskTypeIds);
    },
    onSuccess: (_data, taskTypeIds) => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      toast.success(`${taskTypeIds.length} task type(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task types: ${error.message}`);
    },
  });
}
