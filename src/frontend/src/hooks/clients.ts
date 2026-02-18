import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Client, ClientId, PartialClientInput } from '../backend';

export function useGetAllClients() {
  const { actor, isFetching } = useActor();

  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClient(clientId: ClientId) {
  const { actor, isFetching } = useActor();

  return useQuery<Client | null>({
    queryKey: ['client', clientId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClient(clientId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (client: PartialClientInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClient(client);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, ...client }: PartialClientInput & { clientId: ClientId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(clientId, client);
    },
    onMutate: async (newClient) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      await queryClient.cancelQueries({ queryKey: ['client', newClient.clientId.toString()] });

      // Snapshot previous values
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);
      const previousClient = queryClient.getQueryData<Client | null>(['client', newClient.clientId.toString()]);

      // Optimistically update clients list
      if (previousClients) {
        queryClient.setQueryData<Client[]>(['clients'], (old) =>
          old?.map((client) =>
            client.id === newClient.clientId
              ? {
                  ...client,
                  name: newClient.name,
                  gstin: newClient.gstin,
                  pan: newClient.pan,
                  notes: newClient.notes,
                  timestamp: BigInt(Date.now()),
                }
              : client
          ) || []
        );
      }

      // Optimistically update single client
      if (previousClient) {
        queryClient.setQueryData<Client | null>(['client', newClient.clientId.toString()], {
          ...previousClient,
          name: newClient.name,
          gstin: newClient.gstin,
          pan: newClient.pan,
          notes: newClient.notes,
          timestamp: BigInt(Date.now()),
        });
      }

      return { previousClients, previousClient };
    },
    onError: (err, newClient, context) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      if (context?.previousClient) {
        queryClient.setQueryData(['client', newClient.clientId.toString()], context.previousClient);
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: ClientId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClient(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useBulkCreateClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clients: PartialClientInput[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkCreateClients(clients);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useBulkDeleteClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientIds: ClientId[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkDeleteClients(clientIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
