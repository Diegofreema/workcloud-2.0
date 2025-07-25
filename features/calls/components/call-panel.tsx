import {
  CallingState,
  IncomingCall,
  OutgoingCall,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";
import { useCallback } from "react";

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
