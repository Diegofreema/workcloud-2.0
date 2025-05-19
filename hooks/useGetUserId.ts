import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';

export const useGetUserId = () => {
  const { userId: clerkId } = useAuth();
  const data = useQuery(api.users.getUserByClerkId, { clerkId: clerkId! });
  const user = {
    image: data?.imageUrl,
    name: data?.name,
  };
  const isLoading = data === undefined;
  return {
    id: data?._id,
    organizationId: data?.organizationId,
    worker: data?.workerId,
    clerkId,
    user,
    isLoading,
  };
};
