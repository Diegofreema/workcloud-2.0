import { Href, Redirect, useLocalSearchParams } from "expo-router";
import {
  CallContent,
  CallingState,
  StreamCall,
  useCalls,
} from "@stream-io/video-react-native-sdk";
import { useEffect } from "react";
import { InComing, Outgoing } from "~/features/calls/components/call-panel";

export const CallComponent = () => {
  const { id, wkId } = useLocalSearchParams<{ id: string; wkId: string }>();
  // const { data: call, isPending, isError } = useFetchCall(id);
  const calls = useCalls();
  const call = calls.find((c) => c.id === id);
  useEffect(() => {
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);
  console.log(!!call);
  const path = wkId ? `/wk/${wkId}` : `/`;
  if (!call) {
    return <Redirect href={path as Href} />;
  }

  const showOutGoing =
    call.isCreatedByMe && call.state.callingState === CallingState.RINGING;
  const showInComing =
    !call.isCreatedByMe && call.state.callingState === CallingState.RINGING;
  const showCall =
    call.state.callingState !== CallingState.LEFT &&
    call.state.callingState !== CallingState.RINGING;
  console.log({ state: call.state.callingState });
  console.log({ showOutGoing, showInComing, showCall });
  return (
    <StreamCall call={call}>
      {showOutGoing && <Outgoing />}
      {showInComing && <InComing />}
      {showCall && <CallContent />}
    </StreamCall>
  );
};
