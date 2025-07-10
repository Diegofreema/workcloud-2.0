import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { useAuth } from '~/context/auth';
import { useUser } from './use-id';

export const useGetUserId = () => {
  const { user: storedUser } = useAuth();
  const { user: authUser } = useUser();
  const data = useQuery(api.users.getUserByClerkId, {
    clerkId: storedUser?.id!,
  });
  const user = {
    image: data?.imageUrl,
    name: data?.name,
  };

  const isLoading = data === undefined;
  return {
    id: authUser?.id!,
    organizationId: data?.organizationId,
    worker: data?.workerId,
    bossId: data?.worker?.bossId,
    clerkId: storedUser?.id,
    user,
    isLoading,
    workspaceId: data?.worker?.workspaceId,
    role: data?.worker?.role,
  };
};
