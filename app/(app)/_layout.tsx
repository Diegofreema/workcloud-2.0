import { ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  DeepPartial,
  LogLevel,
  StreamVideo,
  StreamVideoClient,
  Theme,
} from '@stream-io/video-react-native-sdk';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConvex, useMutation } from 'convex/react';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import CallProvider from '~/context/call-provider';
import { useNotification } from '~/context/notification-context';
import { api } from '~/convex/_generated/api';
import { useTheme } from '~/hooks/use-theme';
import axios from 'axios';

const apiKey = 'cnvc46pm8uq9';

if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { theme: darkMode } = useTheme();
  const { user } = useAuth();
  console.log('🚀 ~ AppLayout ~ user:', { user });

  const { expoPushToken } = useNotification();
  const convex = useConvex();
  const updateStreamToken = useMutation(api.users.updateStreamToken);
  const person = {
    id: user?._id!,
    name: user?.name,
    image: user?.image!,
  };
  const tokenProvider = async () => {
    const values = JSON.stringify({
      ...person,
      email: user?.email,
    });
    await AsyncStorage.setItem('person', JSON.stringify(person));
    await AsyncStorage.setItem('body', values);
    try {
      const { data } = await axios.post(
        `https://workcloud-web.vercel.app/token`,
        {
          name: user?.name,
          email: user?.email,
          image: user?.image,
          id: user?._id,
        }
      );

      console.log('🚀 ~ AppLayout ~ tokenProvider ~ data:', data);
      await updateStreamToken({ streamToken: data.token });
      return data.token;
    } catch (error) {
      console.error('error', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: person,
    options: {
      logger: (logLevel: LogLevel, message: string, ...args: unknown[]) => {
        console.log(
          message,
          'message',
          logLevel,
          'level',
          ...args,
          'sadjbcjhhv'
        );
      },
    },
    tokenProvider,
  });
  useEffect(() => {
    if (expoPushToken) {
      convex
        .mutation(api.pushNotification.recordPushNotificationToken, {
          token: expoPushToken,
        })

        .catch((error) => alert(error));
    }
  }, [convex, expoPushToken]);
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
            style={darkMode === 'dark' ? 'light' : 'dark'}
            backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
          />

          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen
              name="upload-review"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </CallProvider>
    </StreamVideo>
  );
}
