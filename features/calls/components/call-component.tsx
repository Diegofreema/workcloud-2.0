import { useCall } from '@stream-io/video-react-bindings';
import { CallContent } from '@stream-io/video-react-native-sdk';
import { useMutation } from 'convex/react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { CustomCallControls } from '~/components/custom-call-buttons';
import StarMessageComponent from '~/components/Ui/star-component';
import { api } from '~/convex/_generated/api';
import { useStar } from '~/hooks/useStar';
import { useCallStore } from '../hook/useCallStore';

export const CallComponent = () => {
  const {
    data: { workspaceId },
    clear,
  } = useCallStore();

  const deleteWaitlist = useMutation(api.workspace.deleteWaitlist);

  const call = useCall();
  const isOpen = useStar((state) => state.isOpen);
  const setIsOpen = useStar((state) => state.setIsOpen);
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

      if (waitList) {
        await deleteWaitlist({ waitlistId: waitList });
      }

      if (workspaceId) {
        clear();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <CallContent
        onHangupCallHandler={onHangupCallHandler}
        layout={'grid'}
        CallControls={CustomCallControls}
      />
      {isOpen && <StarMessageComponent isOpen={isOpen} setIsOpen={setIsOpen} />}
    </KeyboardAwareScrollView>
  );
};
