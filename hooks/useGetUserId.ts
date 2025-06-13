import { useQuery } from "convex/react";

import { api } from "~/convex/_generated/api";
import { useAuth } from "~/context/auth";

export const useGetUserId = () => {
  const { user: storedUser } = useAuth();
  const data = useQuery(api.users.getUserByClerkId, {
    clerkId: storedUser?.id!,
  });
  const user = {
    image: data?.imageUrl,
    name: data?.name,
  };

  const isLoading = data === undefined;
  return {
    id: data?._id,
    organizationId: data?.organizationId,
    worker: data?.workerId,
    bossId: data?.worker?.bossId,
    clerkId: storedUser?.id,
    user,
    isLoading,
    workspaceId: data?.worker?.workspaceId,
    role: data?.worker?.role
  };
};
