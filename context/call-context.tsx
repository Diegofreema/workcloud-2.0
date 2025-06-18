import { View } from "react-native";
import { PropsWithChildren, useEffect } from "react";
import {
  CallingState,
  useCall,
  useCalls,
} from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";

export const CallContext = ({ children }: PropsWithChildren) => {
  const calls = useCalls();
  const call = calls[0];
  useEffect(() => {
    if (call && call?.state.callingState === CallingState.RINGING) {
      router.push("/call/1");
    }
  }, [call, CallingState]);

    console.log(call?.state?.callingState)
  return <View style={{ flex: 1 }}>{children}</View>;
};
