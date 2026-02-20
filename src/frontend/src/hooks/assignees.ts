import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Assignee, AssigneeId, PartialAssigneeInput, backendInterface } from '../backend';
import { toast } from 'sonner';
import { AnonymousIdentity } from '@dfinity/agent';
import { createActorWithConfig } from '../config';

export function useAssignees() {
  const { actor, isFetching } = useActor();

  return useQuery<Assignee[]>({
    queryKey: ['assignees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignees();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useGetAllAssignees = useAssignees;

export function usePublicAssignees() {
  return useQuery<Assignee[]>({
    queryKey: ['publicAssignees'],
    queryFn: async () => {
      const anonymousActor = await createActorWithConfig({
        agentOptions: {
          identity: new AnonymousIdentity(),
        },
      }) as backendInterface;
      return anonymousActor.getPublicAllAssignees();
    },
  });
}

export function useAssignee(assigneeId: AssigneeId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Assignee | null>({
    queryKey: ['assignee', assigneeId?.toString()],
    queryFn: async () => {
      if (!actor || assigneeId === null) return null;
      return actor.getAssignee(assigneeId);
    },
    enabled: !!actor && !isFetching && assigneeId !== null,
  });
}

// Alias for backward compatibility
export const useGetAssignee = useAssignee;

export function useCreateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignee: PartialAssigneeInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAssignee(assignee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      toast.success('Assignee created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create assignee: ${error.message}`);
    },
  });
}

export function useUpdateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assigneeId, assignee }: { assigneeId: AssigneeId; assignee: PartialAssigneeInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAssignee(assigneeId, assignee);
    },
    onMutate: async ({ assigneeId, assignee }) => {
      await queryClient.cancelQueries({ queryKey: ['assignees'] });
      await queryClient.cancelQueries({ queryKey: ['assignee', assigneeId.toString()] });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(['assignees']);
      const previousAssignee = queryClient.getQueryData<Assignee | null>(['assignee', assigneeId.toString()]);

      if (previousAssignees) {
        queryClient.setQueryData<Assignee[]>(
          ['assignees'],
          previousAssignees.map((a) =>
            a.id === assigneeId
              ? {
                  ...a,
                  name: assignee.name,
                  captain: assignee.captain,
                }
              : a
          )
        );
      }

      if (previousAssignee) {
        queryClient.setQueryData<Assignee>(['assignee', assigneeId.toString()], {
          ...previousAssignee,
          name: assignee.name,
          captain: assignee.captain,
        });
      }

      return { previousAssignees, previousAssignee };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(['assignees'], context.previousAssignees);
      }
      if (context?.previousAssignee) {
        queryClient.setQueryData(['assignee', _variables.assigneeId.toString()], context.previousAssignee);
      }
      toast.error(`Failed to update assignee: ${error.message}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      queryClient.invalidateQueries({ queryKey: ['assignee', variables.assigneeId.toString()] });
      toast.success('Assignee updated successfully');
    },
  });
}

export function useDeleteAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: AssigneeId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAssignee(assigneeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      toast.success('Assignee deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete assignee: ${error.message}`);
    },
  });
}

export function useBulkDeleteAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeIds: AssigneeId[]) => {
      if (!actor) throw new Error('Actor not available');
      await Promise.all(assigneeIds.map((id) => actor.deleteAssignee(id)));
    },
    onSuccess: (_data, assigneeIds) => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      toast.success(`${assigneeIds.length} assignee(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete assignees: ${error.message}`);
    },
  });
}

export function useBulkCreateAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignees: PartialAssigneeInput[]) => {
      if (!actor) throw new Error('Actor not available');
      const results = await Promise.all(assignees.map((assignee) => actor.createAssignee(assignee)));
      return results;
    },
    onSuccess: (_data, assignees) => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      toast.success(`${assignees.length} assignee(s) created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create assignees: ${error.message}`);
    },
  });
}
