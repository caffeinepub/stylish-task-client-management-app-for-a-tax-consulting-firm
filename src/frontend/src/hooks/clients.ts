import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Client, ClientId, PartialClientInput } from '../backend';
import { toast } from 'sonner';

export function useClients() {
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

// Alias for backward compatibility
export const useGetAllClients = useClients;

// Removed usePublicClients - backend requires authentication for all data access

export function useClient(clientId: ClientId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Client | null>({
    queryKey: ['client', clientId?.toString()],
    queryFn: async () => {
      if (!actor || clientId === null) return null;
      return actor.getClient(clientId);
    },
    enabled: !!actor && !isFetching && clientId !== null,
  });
}

// Alias for backward compatibility
export const useGetClient = useClient;

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
      toast.success('Client created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, client }: { clientId: ClientId; client: PartialClientInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(clientId, client);
    },
    onMutate: async ({ clientId, client }) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      await queryClient.cancelQueries({ queryKey: ['client', clientId.toString()] });

      const previousClients = queryClient.getQueryData<Client[]>(['clients']);
      const previousClient = queryClient.getQueryData<Client | null>(['client', clientId.toString()]);

      if (previousClients) {
        queryClient.setQueryData<Client[]>(
          ['clients'],
          previousClients.map((c) =>
            c.id === clientId
              ? {
                  ...c,
                  name: client.name,
                  gstin: client.gstin,
                  pan: client.pan,
                  notes: client.notes,
                }
              : c
          )
        );
      }

      if (previousClient) {
        queryClient.setQueryData<Client>(['client', clientId.toString()], {
          ...previousClient,
          name: client.name,
          gstin: client.gstin,
          pan: client.pan,
          notes: client.notes,
        });
      }

      return { previousClients, previousClient };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      if (context?.previousClient) {
        queryClient.setQueryData(['client', _variables.clientId.toString()], context.previousClient);
      }
      toast.error(`Failed to update client: ${error.message}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
      toast.success('Client updated successfully');
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
      toast.success('Client deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
}

export function useBulkDeleteClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientIds: ClientId[]) => {
      if (!actor) throw new Error('Actor not available');
      await Promise.all(clientIds.map((id) => actor.deleteClient(id)));
    },
    onSuccess: (_data, clientIds) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`${clientIds.length} client(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete clients: ${error.message}`);
    },
  });
}

export function useBulkCreateClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clients: PartialClientInput[]) => {
      if (!actor) throw new Error('Actor not available');
      const results = await Promise.all(clients.map((client) => actor.createClient(client)));
      return results;
    },
    onSuccess: (_data, clients) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`${clients.length} client(s) created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create clients: ${error.message}`);
    },
  });
}
