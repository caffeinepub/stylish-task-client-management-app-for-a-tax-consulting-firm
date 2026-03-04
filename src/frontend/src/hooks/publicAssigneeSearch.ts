import { useQuery } from "@tanstack/react-query";
import type { AssigneeWithTaskCount, Task } from "../backend";
import { useActor } from "./useActor";

/**
 * Hook to fetch aggregated assignees with task counts for public search
 * Searches by partial assignee name (case-insensitive)
 */
export function usePublicAggregatedAssignees(searchString: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AssigneeWithTaskCount[]>({
    queryKey: ["publicAggregatedAssignees", searchString],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not available");
      }
      return actor.getAggregatedAssignees(searchString);
    },
    enabled: !!actor && !actorFetching && searchString.trim().length > 0,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch all tasks for a specific assignee for public search
 */
export function usePublicAssigneeTasks(assigneeName: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ["publicAssigneeTasks", assigneeName],
    queryFn: async () => {
      if (!actor || !assigneeName) {
        return [];
      }
      return actor.getTasksByAssignee(assigneeName);
    },
    enabled: !!actor && !actorFetching && !!assigneeName,
    staleTime: 30000,
  });
}
