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
import { useAuth } from '~/context/auth';
import CallProvider from '~/context/call-provider';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';
import { colors } from '~/constants/Colors';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = 'cnvc46pm8uq9';

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const { user: userData } = useGetUserId();

  const person = {
    id: user?.id!,
    name: userData?.name,
    image: userData?.image!,
  };

  const tokenProvider = async () => {
    const values = JSON.stringify({
      id: user?.id,
      name: user?.name,
      image: user?.picture,
      email: user?.email,
    });
    await AsyncStorage.setItem('person', JSON.stringify(person));
    await AsyncStorage.setItem('body', values);
    try {
      const response = await fetch(`https://workcloud-web.vercel.app/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: values,
      });
      const data = await response.json();
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
        console.log(message, 'message', logLevel, 'level', ...args);
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
        width: 50,
        height: 50,
      },
    },
    toggleAudioPreviewButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 50,
        height: 50,
      },
    },
    toggleAudioPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 50,
        height: 50,
      },
    },
    toggleVideoPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 50,
        height: 50,
      },
    },
    hangupCallButton: {
      container: {
        // backgroundColor: colors.callButtonBlue,
        width: 50,
        height: 50,
      },
    },
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
  }, []);
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
