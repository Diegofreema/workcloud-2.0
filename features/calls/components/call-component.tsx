import { useCall } from '@stream-io/video-react-bindings';
import { CallContent } from '@stream-io/video-react-native-sdk';
import { useMutation, useQuery } from 'convex/react';
import { View } from 'react-native';
import { CustomCallControls } from '~/components/custom-call-buttons';
import { StarredComponent } from '~/components/Dialogs/StarredComponent';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useCallStore } from '../hook/useCallStore';

export const CallComponent = () => {
  const {
    data: { workerId, workspaceId },
    clear,
  } = useCallStore();

  const { id: loggedInUser } = useGetUserId();

  const deleteWaitlist = useMutation(api.workspace.deleteWaitlist);
  const waitlist = useQuery(
    api.workspace.getWaitlistByCustomerId,
    loggedInUser ? { customerId: loggedInUser } : 'skip'
  );
  const worker = useQuery(
    api.worker.getWorker,
    workerId ? { workerId: workerId } : 'skip'
  );
  console.log({
    attendingTo: worker?.attendingTo,
    waitlist: waitlist?._id,
    workspaceId,
    workerId,
  });

  const call = useCall();

  // useEffect(() => {
  //   if (!call) {
  //     router.replace(path as Href)
  //   }
  // }, [call, path, router]);

  if (!call) {
    return null;
  }

  const onHangupCallHandler = async () => {
    try {
      await call.leave();
      if (workspaceId) {
        await deleteWaitlist({ waitlistId: worker?.attendingTo! });
        clear();
      } else {
        await deleteWaitlist({ waitlistId: waitlist?._id! });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <StarredComponent
        workspaceId={workspaceId!}
        customerId={waitlist?.customerId!}
      />
      <View style={{ flex: 1 }}>
        <CallContent
          onHangupCallHandler={onHangupCallHandler}
          layout={'grid'}
          CallControls={CustomCallControls}
        />
      </View>
    </>
  );
};
