import { ErrorBoundaryProps, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  DeepPartial,
  LogLevel,
  StreamVideo,
  StreamVideoClient,
  Theme,
} from "@stream-io/video-react-native-sdk";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";
import { colors } from "~/constants/Colors";
import { useAuth } from "~/context/auth";
import CallProvider from "~/context/call-provider";
import { useDarkMode } from "~/hooks/useDarkMode";

const apiKey = "cnvc46pm8uq9";

if (Platform.OS === "android") {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  const person = {
    id: user?._id!,
    name: user?.name,
    image: user?.image!,
  };
  const tokenProvider = async () => {
    const values = JSON.stringify({
      id: user?._id,
      name: user?.name,
      image: user?.image,
      email: user?.email,
    });
    await AsyncStorage.setItem("person", JSON.stringify(person));
    await AsyncStorage.setItem("body", values);
    try {
      const response = await fetch(`https://workcloud-web.vercel.app/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: values,
      });
      const data = await response.json();
      console.log("🚀 ~ AppLayout ~ tokenProvider ~ data:", data);

      return data.token;
    } catch (error) {
      console.error("error", error);
      throw new Error("Failed to fetch user data");
    }
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: person,
    options: {
      logger: (logLevel: LogLevel, message: string, ...args: unknown[]) => {
        console.log(
          message,
          "message",
          logLevel,
          "level",
          ...args,
          "sadjbcjhhv",
        );
      },
    },
    tokenProvider,
  });
  //@ts-ignore
  const theme: DeepPartial<Theme> = {
    callControls: {
      container: {},
    },
    toggleVideoPreviewButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
      },
    },
    toggleCameraFaceButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleAudioPreviewButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleAudioPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleVideoPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    hangupCallButton: {
      container: {
        // backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
  };

  return (
    <StreamVideo client={client} style={theme}>
      <CallProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            style={darkMode === "dark" ? "light" : "dark"}
            backgroundColor={darkMode === "dark" ? "black" : "white"}
          />

          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen
              name="upload-review"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </CallProvider>
    </StreamVideo>
  );
}
