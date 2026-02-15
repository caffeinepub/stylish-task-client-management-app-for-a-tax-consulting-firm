import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, PartialTaskUpdate } from '../backend';

export function useGetAllTasks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTask(taskId: TaskId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['task', taskId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTask(taskId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      clientName: string; 
      taskCategory: string; 
      subCategory: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(data.clientName, data.taskCategory, data.subCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      taskId: TaskId; 
      clientName: string;
      taskCategory: string;
      subCategory: string;
      status: string | null;
      comment: string | null;
      assignedName: string | null;
      dueDate: bigint | null;
      assignmentDate: bigint | null;
      completionDate: bigint | null;
      bill: number | null;
      advanceReceived: number | null;
      outstandingAmount: number | null;
      paymentStatus: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(
        data.taskId,
        data.clientName,
        data.taskCategory,
        data.subCategory,
        data.status,
        data.comment,
        data.assignedName,
        data.dueDate,
        data.assignmentDate,
        data.completionDate,
        data.bill,
        data.advanceReceived,
        data.outstandingAmount,
        data.paymentStatus
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: TaskId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useBulkCreateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskInputs: Array<[string, string, string]>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkCreateTasks(taskInputs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useBulkDeleteTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: TaskId[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkDeleteTasks(taskIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useBulkUpdateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskUpdates: Array<[TaskId, PartialTaskUpdate]>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUpdateTasks(taskUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
