import { ErrorBoundaryProps, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { ChatWrapper } from '~/components/providers/ChatWrapper';
import { VideoProvider } from '~/components/providers/video-provider';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';

const audioSource = require('~/assets/sound.wav');

if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { user } = useAuth();
  const player = useAudioPlayer(audioSource);

  const { data, isPending, isError } = useQuery(
    convexQuery(
      api.workspace.getWaitListCount,
      user?.workerId ? { workerId: user.workerId } : 'skip'
    )
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
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ChatWrapper>
    </VideoProvider>
  );
}
