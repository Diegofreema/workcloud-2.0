import { useCalls } from "@stream-io/video-react-native-sdk";
import { router, usePathname } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { Pressable, Text } from "react-native";
import { useAuth } from "~/context/auth";
import { colors } from "~/constants/Colors";

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls();
  const call = calls[0];

  const { user } = useAuth();
  const isCreator = call?.state?.createdBy?.id === user?.id;
  const pathname = usePathname();

  const isOnCallScreen = pathname.includes("call");

  useEffect(() => {
    if (!call) {
      return;
    }
    if (!isOnCallScreen && call.state.callingState === "ringing") {
      router.push(`/call/${call.id}`);
    }
  }, [call, isOnCallScreen]);

  return (
    <>
      {call && !isOnCallScreen && !isCreator && (
        <Pressable
          onPress={() => router.push(`/call/${call.id}`)}
          style={{
            position: "absolute",
            backgroundColor: colors.dialPad,
            top: 0,
            left: 0,
            right: 0,
            padding: 10,
          }}
        >
          <Text>
            Call: {call.id} ({call.state.callingState})
          </Text>
        </Pressable>
      )}
      {children}
    </>
  );
}
