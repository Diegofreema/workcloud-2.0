import { useCall } from '@stream-io/video-react-bindings';
import { CallContent } from '@stream-io/video-react-native-sdk';
import { useMutation } from 'convex/react';
import { View } from 'react-native';
import { CustomCallControls } from '~/components/custom-call-buttons';
import { api } from '~/convex/_generated/api';
import { useCallStore } from '../hook/useCallStore';

export const CallComponent = () => {
  const {
    data: { workspaceId },
    clear,
  } = useCallStore();

  const deleteWaitlist = useMutation(api.workspace.deleteWaitlist);

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

      await deleteWaitlist({ waitlistId: waitList });

      if (workspaceId) {
        clear();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
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
