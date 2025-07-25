import {
  StreamVideoClient,
  StreamVideoRN,
} from "@stream-io/video-react-native-sdk";
import { AndroidImportance } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "cnvc46pm8uq9";

export function setPushConfig() {
  StreamVideoRN.setPushConfig({
    isExpo: true,
    ios: {
      pushProviderName: "{REPLACE_WITH_APN_PUSH_PROVIDER_NAME_FROM_DASHBOARD}",
    },
    android: {
      pushProviderName: "firebase",
      callChannel: {
        id: "stream_call_notifications",
        name: "Call notifications",
        importance: AndroidImportance.HIGH,
        sound: "default",
      },
      incomingCallChannel: {
        id: "stream_incoming_call",
        name: "Incoming call notifications",
        importance: AndroidImportance.HIGH,
      },
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Incoming call from ${createdUserName}`,
        getBody: () => "Tap to open the call",
      },
    },
    createStreamVideoClient,
  });
}

const createStreamVideoClient = async () => {
  const person = JSON.parse((await AsyncStorage.getItem("person")) || "{}");
  if (!person) {
    console.error("Push - createStreamVideoClient -- person is undefined");
    return;
  }
  const tokenProvider = async () => {
    const values = await AsyncStorage.getItem("body");
    try {
      const response = await fetch(`https://workcloud-web.vercel.app/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: values,
      });
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("error", error);
      throw new Error("Failed to fetch user data");
    }
  };
  return StreamVideoClient.getOrCreateInstance({
    apiKey: API_KEY,
    tokenProvider,
    user: person,
  });
};
