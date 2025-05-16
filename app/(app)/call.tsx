import {
  CallContent,
  CallControlProps,
  CallingState,
  HangUpCallButton,
  StreamCall,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleVideoPublishingButton as ToggleCamera,
  useCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

import { StarredComponent } from '~/components/Dialogs/StarredComponent';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { useGetCustomerId } from '~/hooks/useCustomerId';
import { useStarredModal } from '~/hooks/useStarredModal';
import { useWaitlistId } from '~/hooks/useWaitlistId';

export default function CallScreen() {
  const calls = useCalls();
  const call = calls[0];

  const customerId = useGetCustomerId((state) => state.customerId);
  const workspaceId = useGetCustomerId((state) => state.workspaceId);
  const { removeId, isWorker } = useWaitlistId();
  const waitlistId = useWaitlistId((state) => state.waitlistId);
  const removeFromWaitlist = useMutation(api.workspace.removeFromWaitlist);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);
  if (!call) {
    if (isWorker) {
      router.back();
    } else {
      router.replace('/');
    }
    return null;
  }

  const onHangUp = async () => {
    if (!waitlistId) return;

    try {
      await removeFromWaitlist({ waitlistId });
      removeId();
    } catch {
      toast.error('Something went wrong', { description: 'Failed to leave call' });
    }
  };

  return (
    <>
      <StarredComponent customerId={customerId!} workspaceId={workspaceId!} />
      <StreamCall call={call}>
        <CallContent
          onHangupCallHandler={onHangUp}
          CallControls={(props) => <CustomCallControls {...props} isWorker={isWorker} />}
        />
      </StreamCall>
    </>
  );
}

const CustomCallControls = (props: CallControlProps & { isWorker: boolean }) => {
  const call = useCall();
  const onStar = useStarredModal((state) => state.onOpen);
  const { isWorker } = props;

  return (
    <View style={styles.customCallControlsContainer}>
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
      <ToggleMic onPressHandler={call?.microphone.toggle} />
      {isWorker && (
        <CustomPressable onPress={onStar} style={styles.star}>
          <Star color={colors.white} size={30} />
        </CustomPressable>
      )}
      <ToggleCamera onPressHandler={call?.camera.toggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  customCallControlsContainer: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 10,
    width: '80%',
    marginHorizontal: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.buttonBlue,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 5,
    zIndex: 5,
  },
  star: { backgroundColor: colors.callButtonBlue, padding: 5, borderRadius: 100 },
});
