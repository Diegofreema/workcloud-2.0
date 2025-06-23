import { useStreamVideoClient } from "@stream-io/video-react-bindings";
import { useAuth } from "~/context/auth";
import { useQuery } from "@tanstack/react-query";

export const useFetchCalls = () => {
  const client = useStreamVideoClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["calls"],
    queryFn: async () => {
      if (!client || !user) return [];
      const { calls } = await client.queryCalls({
        filter_conditions: {
          $or: [{ created_by_user: user.id }, { members: { $in: [user.id] } }],
        },
        sort: [{ field: "created_at", direction: -1 }],
        limit: 50,
        watch: true,
      });

      return calls;
    },
  });
};

export const useFetchCall = (callId: string) => {
  const client = useStreamVideoClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["call"],
    queryFn: async () => {
      if (!client || !user) return null;
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
