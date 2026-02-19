import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Todo, TodoId, PartialTodoInput } from '../backend';

export function useGetAllTodos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTodos();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTodo(todoId: TodoId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Todo | null>({
    queryKey: ['todo', todoId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTodo(todoId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: PartialTodoInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTodo(todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { todoId: TodoId; todo: PartialTodoInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTodo(data.todoId, data.todo);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      await queryClient.cancelQueries({ queryKey: ['todo', data.todoId.toString()] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      const previousTodo = queryClient.getQueryData<Todo | null>(['todo', data.todoId.toString()]);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(['todos'], (old) =>
          old?.map((todo) =>
            todo.id === data.todoId
              ? {
                  ...todo,
                  title: data.todo.title,
                  description: data.todo.description ?? undefined,
                  completed: data.todo.completed,
                  dueDate: data.todo.dueDate ?? undefined,
                  priority: data.todo.priority ?? undefined,
                  updatedAt: BigInt(Date.now()),
                }
              : todo
          ) || []
        );
      }

      if (previousTodo) {
        queryClient.setQueryData<Todo | null>(['todo', data.todoId.toString()], {
          ...previousTodo,
          title: data.todo.title,
          description: data.todo.description ?? undefined,
          completed: data.todo.completed,
          dueDate: data.todo.dueDate ?? undefined,
          priority: data.todo.priority ?? undefined,
          updatedAt: BigInt(Date.now()),
        });
      }

      return { previousTodos, previousTodo };
    },
    onError: (err, data, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData(['todo', data.todoId.toString()], context.previousTodo);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', variables.todoId.toString()] });
    },
  });
}

export function useDeleteTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: TodoId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTodo(todoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useBulkCreateTodos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoInputs: PartialTodoInput[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = todoInputs.map(todo => actor.createTodo(todo));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useBulkDeleteTodos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoIds: TodoId[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = todoIds.map(id => actor.deleteTodo(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
