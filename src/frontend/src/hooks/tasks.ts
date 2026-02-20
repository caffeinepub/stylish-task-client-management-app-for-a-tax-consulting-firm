import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, TaskWithCaptain, PartialTaskUpdate, backendInterface } from '../backend';
import { toast } from 'sonner';
import { AnonymousIdentity } from '@dfinity/agent';
import { createActorWithConfig } from '../config';

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskWithCaptain[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('[useGetAllTasks] Query initiated', {
        timestamp: new Date().toISOString(),
        actorAvailable: !!actor,
        actorFetching: isFetching,
      });
      
      if (!actor) {
        console.warn('[useGetAllTasks] Actor not available, returning empty array');
        return [];
      }
      
      const startTime = performance.now();
      const result = await actor.getAllTasksWithCaptain();
      const endTime = performance.now();
      
      console.log('[useGetAllTasks] Query completed', {
        timestamp: new Date().toISOString(),
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        resultCount: result.length,
      });
      
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTasksWithCaptain() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskWithCaptain[]>({
    queryKey: ['tasksWithCaptain'],
    queryFn: async () => {
      console.log('[useTasksWithCaptain] Query initiated', {
        timestamp: new Date().toISOString(),
        actorAvailable: !!actor,
        actorFetching: isFetching,
      });
      
      if (!actor) {
        console.warn('[useTasksWithCaptain] Actor not available, returning empty array');
        return [];
      }
      
      const startTime = performance.now();
      try {
        const result = await actor.getAllTasksWithCaptain();
        const endTime = performance.now();
        
        console.log('[useTasksWithCaptain] Query completed successfully', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          resultCount: result.length,
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error('[useTasksWithCaptain] Query failed', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublicTasks() {
  return useQuery<Task[]>({
    queryKey: ['publicTasks'],
    queryFn: async () => {
      console.log('[usePublicTasks] Query initiated', {
        timestamp: new Date().toISOString(),
      });
      
      const startTime = performance.now();
      try {
        const anonymousActor = await createActorWithConfig({
          agentOptions: {
            identity: new AnonymousIdentity(),
          },
        }) as backendInterface;
        
        const result = await anonymousActor.getPublicAllTasks();
        const endTime = performance.now();
        
        console.log('[usePublicTasks] Query completed successfully', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          resultCount: result.length,
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error('[usePublicTasks] Query failed', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
  });
}

export function usePublicTasksWithCaptain() {
  return useQuery<TaskWithCaptain[]>({
    queryKey: ['publicTasksWithCaptain'],
    queryFn: async () => {
      console.log('[usePublicTasksWithCaptain] Query initiated', {
        timestamp: new Date().toISOString(),
      });
      
      const startTime = performance.now();
      try {
        const anonymousActor = await createActorWithConfig({
          agentOptions: {
            identity: new AnonymousIdentity(),
          },
        }) as backendInterface;
        
        const result = await anonymousActor.getPublicTasksWithCaptain();
        const endTime = performance.now();
        
        console.log('[usePublicTasksWithCaptain] Query completed successfully', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          resultCount: result.length,
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error('[usePublicTasksWithCaptain] Query failed', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
  });
}

export function useTask(taskId: TaskId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['task', taskId?.toString()],
    queryFn: async () => {
      if (!actor || taskId === null) return null;
      return actor.getTask(taskId);
    },
    enabled: !!actor && !isFetching && taskId !== null,
  });
}

// Alias for backward compatibility
export const useGetTask = useTask;

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientName,
      taskCategory,
      subCategory,
    }: {
      clientName: string;
      taskCategory: string;
      subCategory: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(clientName, taskCategory, subCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      clientName,
      taskCategory,
      subCategory,
      status,
      comment,
      assignedName,
      dueDate,
      assignmentDate,
      completionDate,
      bill,
      advanceReceived,
      outstandingAmount,
      paymentStatus,
    }: {
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
        taskId,
        clientName,
        taskCategory,
        subCategory,
        status,
        comment,
        assignedName,
        dueDate,
        assignmentDate,
        completionDate,
        bill,
        advanceReceived,
        outstandingAmount,
        paymentStatus
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
}

export function useUpdateTaskComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: TaskId; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Get current task to preserve other fields
      const task = await actor.getTask(data.taskId);
      if (!task) throw new Error('Task not found');
      
      return actor.updateTask(
        data.taskId,
        task.clientName,
        task.taskCategory,
        task.subCategory,
        task.status || null,
        data.comment,
        task.assignedName || null,
        task.dueDate || null,
        task.assignmentDate || null,
        task.completionDate || null,
        task.bill || null,
        task.advanceReceived || null,
        task.outstandingAmount || null,
        task.paymentStatus || null
      );
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<TaskWithCaptain[]>(['tasks']);

      if (previousTasks) {
        queryClient.setQueryData<TaskWithCaptain[]>(['tasks'], (old) =>
          old?.map((taskWithCaptain) =>
            taskWithCaptain.task.id === data.taskId 
              ? { ...taskWithCaptain, task: { ...taskWithCaptain.task, comment: data.comment } }
              : taskWithCaptain
          ) || []
        );
      }

      return { previousTasks };
    },
    onError: (err, data, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useBulkUpdateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: PartialTaskUpdate[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUpdateTasks(updates);
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['tasksWithCaptain'] });

      const previousTasks = queryClient.getQueryData<TaskWithCaptain[]>(['tasks']);
      const previousTasksWithCaptain = queryClient.getQueryData<TaskWithCaptain[]>(['tasksWithCaptain']);

      if (previousTasks) {
        const updatedTasks = previousTasks.map((taskWithCaptain) => {
          const update = updates.find((u) => u.id === taskWithCaptain.task.id);
          if (!update) return taskWithCaptain;

          return {
            ...taskWithCaptain,
            task: {
              ...taskWithCaptain.task,
              clientName: update.clientName ?? taskWithCaptain.task.clientName,
              taskCategory: update.taskCategory ?? taskWithCaptain.task.taskCategory,
              subCategory: update.subCategory ?? taskWithCaptain.task.subCategory,
              status: update.status !== undefined ? update.status : taskWithCaptain.task.status,
              comment: update.comment !== undefined ? update.comment : taskWithCaptain.task.comment,
              assignedName: update.assignedName !== undefined ? update.assignedName : taskWithCaptain.task.assignedName,
              dueDate: update.dueDate !== undefined ? update.dueDate : taskWithCaptain.task.dueDate,
              assignmentDate: update.assignmentDate !== undefined ? update.assignmentDate : taskWithCaptain.task.assignmentDate,
              completionDate: update.completionDate !== undefined ? update.completionDate : taskWithCaptain.task.completionDate,
              bill: update.bill !== undefined ? update.bill : taskWithCaptain.task.bill,
              advanceReceived: update.advanceReceived !== undefined ? update.advanceReceived : taskWithCaptain.task.advanceReceived,
              outstandingAmount:
                update.outstandingAmount !== undefined ? update.outstandingAmount : taskWithCaptain.task.outstandingAmount,
              paymentStatus: update.paymentStatus !== undefined ? update.paymentStatus : taskWithCaptain.task.paymentStatus,
            },
          };
        });
        queryClient.setQueryData(['tasks'], updatedTasks);
      }

      return { previousTasks, previousTasksWithCaptain };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTasksWithCaptain) {
        queryClient.setQueryData(['tasksWithCaptain'], context.previousTasksWithCaptain);
      }
      toast.error(`Failed to update tasks: ${error.message}`);
    },
    onSuccess: (_data, updates) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success(`${updates.length} task(s) updated successfully`);
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
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
}

export function useBulkDeleteTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: TaskId[]) => {
      if (!actor) throw new Error('Actor not available');
      await Promise.all(taskIds.map((id) => actor.deleteTask(id)));
    },
    onSuccess: (_data, taskIds) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success(`${taskIds.length} task(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete tasks: ${error.message}`);
    },
  });
}

export function useBulkCreateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: Array<{ clientName: string; taskCategory: string; subCategory: string }>) => {
      if (!actor) throw new Error('Actor not available');
      const promises = tasks.map(task => actor.createTask(task.clientName, task.taskCategory, task.subCategory));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
