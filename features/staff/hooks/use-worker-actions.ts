import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "~/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner-native";
import { useRouter } from "expo-router";

type Props = {
  id: Id<"users">;
  profileId: Id<"workers">;
};
export const useWorkerActions = ({ id, profileId }: Props) => {
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();
  const data = useQuery(
    api.worker.getSingleWorkerProfile,
    profileId ? { id: profileId } : "skip",
  );

  const pendingData = useQuery(
    api.request.getPendingRequestsAsBoolean,
    data?.user
      ? {
          from: id,
          to: data?.user._id,
        }
      : "skip",
  );

  const cancelPendingRequest = useMutation(api.request.cancelPendingRequests);
  const isPending = data === undefined && pendingData === undefined;
  const isInPending = !!pendingData;
  const onMessage = async () => {
    router.push(`/chat/${data?.user?._id}`);
  };

  const cancelRequest = async () => {
    setCancelling(true);
    if (!pendingData) return;
    try {
      await cancelPendingRequest({ id: pendingData._id });
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  const handleRequest = async () => {
    if (!isInPending) {
      router.push(`/completeRequest/${profileId}`);
      return;
    }

    await cancelRequest();
  };
  return {
    data,
    pendingData,
    isPending,
    cancelPendingRequest,
    isInPending,
    handleRequest,
    cancelling,
    onMessage,
  };
};
