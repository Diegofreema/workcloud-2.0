import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { useMutation } from 'convex/react';
import { Id } from '~/convex/_generated/dataModel';
import { useState } from 'react';
import { toast } from 'sonner-native';
import { useRouter } from 'expo-router';
import { useMessage } from '~/hooks/use-message';
import { Alert } from 'react-native';

type Props = {
  profileId: Id<'workers'>;
};
export const useWorkerActions = ({ profileId }: Props) => {
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();
  const { onMessage: handleMessage } = useMessage();
  const data = useQuery(
    api.worker.getSingleWorkerProfile,
    profileId ? { id: profileId } : 'skip',
  );

  const pendingData = useQuery(
    api.request.getPendingRequestsAsBoolean,
    data?.user
      ? {
          to: data?.user._id,
        }
      : 'skip',
  );

  const cancelPendingRequest = useMutation(api.request.cancelPendingRequests);
  const isPending = data === undefined && pendingData === undefined;
  const isInPending = !!pendingData;
  const onMessage = async () => {
    if (!data?.user?.userId) return;
    handleMessage(data.user.userId, 'single');
  };

  const cancelRequest = async () => {
    setCancelling(true);
    if (!pendingData) return;
    try {
      await cancelPendingRequest({ id: pendingData._id });
    } catch (error) {
      console.log(error);

      toast.error('Something went wrong');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequest = async () => {
    if (!isInPending) {
      router.push(`/completeRequest/${profileId}`);
      return;
    }

    await onHandleCancel();
  };
  const onHandleCancel = async () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel the request?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await cancelRequest();
          },
        },
      ],
      { cancelable: true },
    );
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
