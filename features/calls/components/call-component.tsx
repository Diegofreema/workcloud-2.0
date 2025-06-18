import { StyleSheet, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import {
  CallContent,
  CallControlProps,
  StreamCall,
  useCall,
  useCalls,
  HangUpCallButton,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleVideoPublishingButton as ToggleCamera,
  CallingState,
  RingingCallContent,
} from "@stream-io/video-react-native-sdk";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { useEffect } from "react";

export const CallComponent = () => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const calls = useCalls();

  const call = calls[0];
  useEffect(() => {
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return <LoadingComponent />;
  }
  const endCall = () => {
    router.back();
  };
  const ringing = call.ringing;
  return (
    <StreamCall call={call}>
      <View style={{ flex: 1 }}>
        {ringing ? (
          <RingingCallContent />
        ) : (
          <CallContent
            onHangupCallHandler={endCall}
            CallControls={CustomCallControls}
          />
        )}
      </View>
    </StreamCall>
  );
};

const CustomCallControls = (props: CallControlProps) => {
  const call = useCall();
  return (
    <View style={styles.customCallControlsContainer}>
      <ToggleMic onPressHandler={call?.microphone.toggle} />
      <ToggleCamera onPressHandler={call?.camera.toggle} />
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  customCallControlsContainer: {
    position: "absolute",
    bottom: 40,
    paddingVertical: 10,
    width: "80%",
    marginHorizontal: 20,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    backgroundColor: "orange",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 5,
    zIndex: 5,
  },
});
