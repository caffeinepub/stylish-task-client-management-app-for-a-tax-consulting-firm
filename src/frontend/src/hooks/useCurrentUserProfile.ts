import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing: authInitializing } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      console.log('👤 [useGetCallerUserProfile] Fetching profile...', {
        hasActor: !!actor,
        hasIdentity: !!identity,
      });

      if (!actor) {
        console.log('👤 [useGetCallerUserProfile] No actor available');
        throw new Error('Actor not available');
      }

      try {
        const profile = await actor.getCallerUserProfile();
        console.log('👤 [useGetCallerUserProfile] Profile fetched:', {
          hasProfile: !!profile,
          profileName: profile?.name,
        });
        return profile;
      } catch (error) {
        console.error('👤 [useGetCallerUserProfile] Error fetching profile:', error);
        // Return null instead of throwing to allow profile setup modal to show
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity && !authInitializing,
    retry: false,
    staleTime: Infinity,
  });

  // Return custom state that properly reflects all dependencies
  return {
    ...query,
    isLoading: authInitializing || actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && !authInitializing && !actorFetching && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
