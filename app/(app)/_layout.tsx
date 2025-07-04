import { ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  LogLevel,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { useAuth } from '~/context/auth';
import CallProvider from '~/context/call-provider';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';

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
    try {
      const response = await fetch(`https://workcloud-web.vercel.app/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          id: user?.id,
          name: user?.name,
          image: user?.picture,
          email: user?.email,
        }),
      });
      const data = await response.json();
      console.log({ token: data.token });
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
  return (
    <StreamVideo client={client}>
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
