import { ErrorBoundaryProps, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { VideoProvider } from '~/components/providers/video-provider';
import { api } from '~/convex/_generated/api';
import { ChatWrapper } from '~/components/providers/ChatWrapper';

const audioSource = require('~/assets/sound.wav');
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const player = useAudioPlayer(audioSource);

  const { data, isPending, isError } = useQuery(
    convexQuery(api.workspace.getWaitListCount, {}),
  );

  useEffect(() => {
    const onPlaySound = () => {
      player.seekTo(0);
      player.play();
    };
    if (!isError && !isPending && data > 0) {
      onPlaySound();
    }
  }, [data, isPending, isError, player]);

  return (
    <VideoProvider>
      <ChatWrapper>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen
              name="upload-review"
              options={{
                presentation: 'modal',
                headerShown: false,
                animation:
                  Platform.OS === 'ios' ? 'default' : 'slide_from_bottom',
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ChatWrapper>
    </VideoProvider>
  );
}
