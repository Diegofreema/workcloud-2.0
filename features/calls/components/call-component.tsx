import { Href, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import {
  CallContent,
  CallingState,
  StreamCall,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
import { useStreamVideoClient } from "@stream-io/video-react-bindings";
import { Call } from "@stream-io/video-client";
import { CustomCallControls } from "~/components/custom-call-buttons";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { Id } from "~/convex/_generated/dataModel";

if (Platform.OS === "android") {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export const CallComponent = () => {
  const { id, workerId, workspaceId } = useLocalSearchParams<{
    id: string;
    workerId: Id<"workers">;
    workspaceId: string;
  }>();
  const [call, setCall] = useState<Call | null>(null);
  const { id: loggedInUser } = useGetUserId();
  // const { data: call, isPending, isError } = useFetchCall(id);
  const deleteWaitlist = useMutation(api.workspace.deleteWaitlist);
  const waitlist = useQuery(
    api.workspace.getWaitlistByCustomerId,
    loggedInUser ? { customerId: loggedInUser } : "skip",
  );
  const worker = useQuery(
    api.worker.getWorker,
    workerId ? { workerId: workerId } : "skip",
  );
  console.log({ attendingTo: worker?.attendingTo, waitlist: waitlist?._id, workspaceId });
  const client = useStreamVideoClient();
  const router = useRouter();
  useEffect(() => {
    const _call = client?.call("default", id as string);
    _call?.join({ create: true });

    if (_call) {
      setCall(_call);
    }
  }, [client, id]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  const path = workspaceId ? `/wk/${workspaceId}` : `/`;

  // useEffect(() => {
  //   if (!call) {
  //     router.replace(path as Href)
  //   }
  // }, [call, path, router]);

  if (!call) {
    return <Redirect href={path as Href} />;
  }

  const onHangupCallHandler = async () => {
    router.replace(path as Href);
    try {
      await call.leave();
      if (workspaceId) {
        await deleteWaitlist({ waitlistId: worker?.attendingTo! });
      } else {
        await deleteWaitlist({ waitlistId: waitlist?._id! });
      }
    } catch (e) {}
  };

  return (
    <StreamCall call={call}>
      <View style={{ flex: 1 }}>
        <CallContent
          onHangupCallHandler={onHangupCallHandler}
          layout={"grid"}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
};
