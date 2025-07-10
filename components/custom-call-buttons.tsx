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

/**
 * CustomCallControls component that renders a styled control bar for video calls
 *
 * @param props - CallControlProps from Stream Video SDK, includes handlers like onHangupCallHandler
 * @returns A styled control bar with video call control buttons
 */
export const CustomCallControls = (props: CallControlProps) => {
  // Get user role information to conditionally render controls

  return (
    <View style={styles.container}>
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
      {/* Toggle microphone on/off */}
      <ToggleMic />

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
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: colors.callButtonBlue,
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
});
