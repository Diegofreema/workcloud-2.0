/**
 * CustomCallControls.tsx
 *
 * This component provides a customized UI for video call controls.
 * It renders a styled control bar with buttons for toggling microphone,
 * switching camera, showing reactions (for non-therapists), and ending the call.
 */
import {
  CallControlProps,
  HangUpCallButton,
  ToggleVideoPreviewButton as ToggleCamera,
  ToggleCameraFaceButton,
  ToggleAudioPublishingButton as ToggleMic,
} from '@stream-io/video-react-native-sdk';

import { StyleSheet, View } from 'react-native';
import { colors } from '~/constants/Colors';
import { useCallStore } from '~/features/calls/hook/useCallStore';
import { CustomPressable } from './Ui/CustomPressable';
import { Star } from 'lucide-react-native';
import { useStar } from '~/hooks/useStar';

/**
 * CustomCallControls component that renders a styled control bar for video calls
 *
 * @param props - CallControlProps from Stream Video SDK, includes handlers like onHangupCallHandler
 * @returns A styled control bar with video call control buttons
 */
export const CustomCallControls = (props: CallControlProps) => {
  // Get user role information to conditionally render controls
  const {
    data: { workspaceId },
  } = useCallStore();

  console.log({ workspaceId });

  const setOpen = useStar((state) => state.setIsOpen);
  return (
    <View style={styles.container}>
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
      {/* Toggle microphone on/off */}
      <ToggleMic />
      {workspaceId && (
        <CustomPressable style={styles.button} onPress={() => setOpen(true)}>
          <Star color="white" />
        </CustomPressable>
      )}
      {/* Switch between front and back camera */}
      <ToggleCameraFaceButton />
      <ToggleCamera />
      {/* Only show reactions button for non-therapist users */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.dialPad,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    backgroundColor: colors.callButtonBlue,
    borderRadius: 60,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
});
