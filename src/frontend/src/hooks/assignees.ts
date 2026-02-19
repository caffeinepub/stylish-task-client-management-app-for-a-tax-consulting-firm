import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Assignee, AssigneeId, PartialAssigneeInput } from '../backend';

export function useGetAllAssignees() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Assignee[]>({
    queryKey: ['assignees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignees();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAssignee(assigneeId: AssigneeId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Assignee | null>({
    queryKey: ['assignee', assigneeId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAssignee(assigneeId);
    },
    enabled: !!actor && !actorFetching,
  });
}

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
    },
  });
}

export function useUpdateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { assigneeId: AssigneeId; assignee: PartialAssigneeInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAssignee(data.assigneeId, data.assignee);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['assignees'] });
      await queryClient.cancelQueries({ queryKey: ['assignee', data.assigneeId.toString()] });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(['assignees']);
      const previousAssignee = queryClient.getQueryData<Assignee | null>(['assignee', data.assigneeId.toString()]);

      if (previousAssignees) {
        queryClient.setQueryData<Assignee[]>(['assignees'], (old) =>
          old?.map((assignee) =>
            assignee.id === data.assigneeId
              ? {
                  ...assignee,
                  name: data.assignee.name,
                  captain: data.assignee.captain ?? undefined,
                }
              : assignee
          ) || []
        );
      }

      if (previousAssignee) {
        queryClient.setQueryData<Assignee | null>(['assignee', data.assigneeId.toString()], {
          ...previousAssignee,
          name: data.assignee.name,
          captain: data.assignee.captain ?? undefined,
        });
      }

      return { previousAssignees, previousAssignee };
    },
    onError: (err, data, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(['assignees'], context.previousAssignees);
      }
      if (context?.previousAssignee) {
        queryClient.setQueryData(['assignee', data.assigneeId.toString()], context.previousAssignee);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      queryClient.invalidateQueries({ queryKey: ['assignee', variables.assigneeId.toString()] });
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
    },
  });
}

export function useBulkCreateAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignees: PartialAssigneeInput[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = assignees.map(assignee => actor.createAssignee(assignee));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}

export function useBulkDeleteAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeIds: AssigneeId[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = assigneeIds.map(id => actor.deleteAssignee(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}
