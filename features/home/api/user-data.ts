import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

export const useUserData = () => {
  return useQuery(api.users.getUserByClerkId);
};
