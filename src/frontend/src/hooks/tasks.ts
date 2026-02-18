import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, TaskInput, PartialTaskUpdate } from '../backend';

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
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', newTask.taskId.toString()] });

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task | null>(['task', newTask.taskId.toString()]);

      // Optimistically update tasks list
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], (old) =>
          old?.map((task) =>
            task.id === newTask.taskId
              ? {
                  ...task,
                  clientName: newTask.clientName,
                  taskCategory: newTask.taskCategory,
                  subCategory: newTask.subCategory,
                  status: newTask.status ?? undefined,
                  comment: newTask.comment ?? undefined,
                  assignedName: newTask.assignedName ?? undefined,
                  dueDate: newTask.dueDate ?? undefined,
                  assignmentDate: newTask.assignmentDate ?? undefined,
                  completionDate: newTask.completionDate ?? undefined,
                  bill: newTask.bill ?? undefined,
                  advanceReceived: newTask.advanceReceived ?? undefined,
                  outstandingAmount: newTask.outstandingAmount ?? undefined,
                  paymentStatus: newTask.paymentStatus ?? undefined,
                }
              : task
          ) || []
        );
      }

      // Optimistically update single task
      if (previousTask) {
        queryClient.setQueryData<Task | null>(['task', newTask.taskId.toString()], {
          ...previousTask,
          clientName: newTask.clientName,
          taskCategory: newTask.taskCategory,
          subCategory: newTask.subCategory,
          status: newTask.status ?? undefined,
          comment: newTask.comment ?? undefined,
          assignedName: newTask.assignedName ?? undefined,
          dueDate: newTask.dueDate ?? undefined,
          assignmentDate: newTask.assignmentDate ?? undefined,
          completionDate: newTask.completionDate ?? undefined,
          bill: newTask.bill ?? undefined,
          advanceReceived: newTask.advanceReceived ?? undefined,
          outstandingAmount: newTask.outstandingAmount ?? undefined,
          paymentStatus: newTask.paymentStatus ?? undefined,
        });
      }

      return { previousTasks, previousTask };
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', newTask.taskId.toString()], context.previousTask);
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure consistency
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
    mutationFn: async (taskInputs: TaskInput[]) => {
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

export function useUpdateTaskComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: TaskId; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      const update: PartialTaskUpdate = { comment: data.comment };
      return actor.bulkUpdateTasks([[data.taskId, update]]);
    },
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], (old) =>
          old?.map((task) =>
            task.id === data.taskId ? { ...task, comment: data.comment } : task
          ) || []
        );
      }

      return { previousTasks };
    },
    onError: (err, data, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
