import { useCall } from '@stream-io/video-react-bindings';
import { CallContent } from '@stream-io/video-react-native-sdk';
import { useMutation, useQuery } from 'convex/react';
import { View } from 'react-native';
import { CustomCallControls } from '~/components/custom-call-buttons';
import { api } from '~/convex/_generated/api';
import { useCallStore } from '../hook/useCallStore';

export const CallComponent = () => {
  const {
    data: { workerId, workspaceId },
    clear,
  } = useCallStore();

  const deleteWaitlist = useMutation(api.workspace.deleteWaitlist);

  const worker = useQuery(
    api.worker.getWorker,
    workerId ? { workerId: workerId } : 'skip'
  );
  console.log({ workerId, workspaceId, attendingTo: worker });

  const call = useCall();
  console.log(call?.state.members.map((m) => m.custom.currentUser));
  const waitList = call?.state.members.map((m) => m.custom.currentUser)[0];
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
      await call.endCall();
      if (workspaceId) {
        await deleteWaitlist({ waitlistId: waitList });
        console.log('Hanged up');

        clear();
      } else {
        await deleteWaitlist({ waitlistId: waitList });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* <StarredComponent
        workspaceId={workspaceId!}
        customerId={waitlist?.customerId!}
      /> */}
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
