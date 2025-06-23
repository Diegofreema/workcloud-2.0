import {
  CallControlProps,
  CallingState,
  HangUpCallButton,
  IncomingCall,
  OutgoingCall,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleVideoPublishingButton as ToggleCamera,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { StyleSheet, View } from "react-native";
import { useCallback } from "react";
import { router } from "expo-router";

export const InComing = () => {
  const call = useCall();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const rejectCallHandler = useCallback(async () => {
    try {
      if (callingState === CallingState.LEFT) {
        return;
      }
      await call?.leave({ reject: true, reason: "decline" });
    } catch (error) {
      console.log("Error rejecting Call", error);
    }
  }, [call, callingState]);
  const acceptCallHandler = useCallback(async () => {
    try {
      await call?.join();
    } catch (error) {
      console.log("Error accepting Call", error);
    }
  }, [call]);
  // const endCall = async () => {
  //   if (!call) return;
  //   await call?.endCall();
  //   router.back();
  //   console.log("Pressed");
  // };

  return (
    <IncomingCall
      onRejectCallHandler={rejectCallHandler}
      onAcceptCallHandler={acceptCallHandler}
    />
  );
};
export const Outgoing = () => {
  const call = useCall();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const rejectCallHandler = useCallback(async () => {
    try {
      if (callingState === CallingState.LEFT) {
        return;
      }
      await call?.leave({ reject: true, reason: "decline" });
    } catch (error) {
      console.log("Error rejecting Call", error);
    }
  }, [call, callingState]);
  const acceptCallHandler = useCallback(async () => {
    try {
      await call?.join();
    } catch (error) {
      console.log("Error accepting Call", error);
    }
  }, [call]);
  // const endCall = async () => {
  //   if (!call) return;
  //   await call?.endCall();
  //   router.back();
  //   console.log("Pressed");
  // };
  const hangupCallHandler = useCallback(async () => {
    try {
      if (callingState === CallingState.LEFT) {
        return;
      }
      await call?.leave({ reject: true, reason: "cancel" });
      router.push("/");
    } catch (error) {
      console.log("Error rejecting Call", error);
    }
  }, [call, callingState]);

  return <OutgoingCall onHangupCallHandler={hangupCallHandler} />;
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
