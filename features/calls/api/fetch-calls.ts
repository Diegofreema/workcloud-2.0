import { useStreamVideoClient } from '@stream-io/video-react-bindings';
import { useAuth } from '~/context/auth';
import { useQuery } from '@tanstack/react-query';

export const useFetchCalls = () => {
  const client = useStreamVideoClient();
  const { user } = useAuth();
  const id = user?.id;
  return useQuery({
    queryKey: ['calls'],
    queryFn: async () => {
      if (!client || !id) return [];
      const { calls } = await client.queryCalls({
        filter_conditions: {
          $or: [{ created_by_user: id }, { members: { $in: [id] } }],
        },
        sort: [{ field: 'created_at', direction: -1 }],
        limit: 50,
        watch: true,
      });

      return calls;
    },
  });
};

export const useFetchCall = (callId: string) => {
  const client = useStreamVideoClient();

  return useQuery({
    queryKey: ['call'],
    queryFn: async () => {
      if (!client) return null;
      const { calls } = await client.queryCalls({
        filter_conditions: {
          ongoing: true,
          id: callId,
        },
        limit: 1,
        watch: true,
      });

      return calls[0];
    },
  });
};
