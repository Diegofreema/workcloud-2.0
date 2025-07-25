import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { useAuth } from '~/context/auth';

export const useGetUserId = () => {
  const { user: storedUser } = useAuth();

  const data = useQuery(api.users.getUserByClerkId, {});
  const user = {
    image: data?.image,
    name: data?.name,
  };

  const isLoading = data === undefined;
  return {
    id: storedUser?._id!,
    organizationId: data?.organizationId,
    worker: data?.workerId,
    bossId: data?.worker?.bossId,
    user,
    isLoading,
    workspaceId: data?.worker?.workspaceId,
    role: data?.worker?.role,
  };
};
